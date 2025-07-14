import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Input validation schemas
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

const validatePostalCode = (postalCode: string): boolean => {
  const canadianPostalRegex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
  return canadianPostalRegex.test(postalCode);
};

const validateName = (name: string): boolean => {
  return name.length >= 1 && name.length <= 100 && /^[a-zA-Z\s'-]+$/.test(name);
};

const validateAmount = (amount: number): boolean => {
  return typeof amount === 'number' && amount > 0 && amount <= 10000 && Number.isFinite(amount);
};

const getClientIP = (req: Request): string => {
  return req.headers.get('x-forwarded-for')?.split(',')[0] || 
         req.headers.get('x-real-ip') || 
         'unknown';
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const clientIP = getClientIP(req);
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const {
      firstName,
      lastName,
      email,
      contactNumber,
      postalCode,
      tickets,
      addOns,
      subtotal,
      tax,
      serviceFee,
      total
    } = requestData;

    // Rate limiting check
    const { data: rateLimitData, error: rateLimitError } = await supabase
      .rpc('check_purchase_rate_limit', { client_ip: clientIP });
    
    if (rateLimitError || !rateLimitData) {
      console.error('Rate limit check failed:', rateLimitError);
      return new Response(JSON.stringify({ error: "Rate limit check failed" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Input validation
    const validationErrors = [];
    
    if (!validateName(firstName)) validationErrors.push("Invalid first name");
    if (!validateName(lastName)) validationErrors.push("Invalid last name");
    if (!validateEmail(email)) validationErrors.push("Invalid email format");
    if (postalCode && !validatePostalCode(postalCode)) validationErrors.push("Invalid postal code format");
    if (!validateAmount(subtotal)) validationErrors.push("Invalid subtotal amount");
    if (!validateAmount(tax)) validationErrors.push("Invalid tax amount");
    if (!validateAmount(serviceFee)) validationErrors.push("Invalid service fee amount");
    if (!validateAmount(total)) validationErrors.push("Invalid total amount");

    // Validate ticket and add-on structure
    if (!tickets || typeof tickets !== 'object') validationErrors.push("Invalid tickets data");
    if (addOns && typeof addOns !== 'object') validationErrors.push("Invalid add-ons data");

    // Validate total calculation (server-side price verification)
    const calculatedTotal = subtotal + tax + serviceFee;
    if (Math.abs(calculatedTotal - total) > 0.01) {
      validationErrors.push("Total calculation mismatch");
    }

    if (validationErrors.length > 0) {
      await supabase.from('purchase_audit_log').insert({
        action: 'validation_failed',
        ip_address: clientIP,
        user_agent: userAgent,
        details: { errors: validationErrors, requestData }
      });

      return new Response(JSON.stringify({ 
        error: "Validation failed", 
        details: validationErrors 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert purchase record
    const { data: purchaseData, error: purchaseError } = await supabase
      .from('ticket_purchases')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        contact_number: contactNumber,
        postal_code: postalCode,
        tickets: tickets,
        add_ons: addOns,
        subtotal: subtotal,
        tax: tax,
        service_fee: serviceFee,
        total: total,
        status: 'completed'
      })
      .select()
      .single();

    if (purchaseError) {
      console.error('Purchase insert failed:', purchaseError);
      
      await supabase.from('purchase_audit_log').insert({
        action: 'purchase_failed',
        ip_address: clientIP,
        user_agent: userAgent,
        details: { error: purchaseError.message, requestData }
      });

      return new Response(JSON.stringify({ error: "Purchase processing failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Log successful purchase
    await supabase.from('purchase_audit_log').insert({
      purchase_id: purchaseData.id,
      action: 'purchase_completed',
      ip_address: clientIP,
      user_agent: userAgent,
      details: { total: total, email: email }
    });

    // Send receipt via webhook (if configured)
    const webhookUrl = Deno.env.get("RECEIPT_WEBHOOK_URL");
    if (webhookUrl && email) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': await generateWebhookSignature(purchaseData),
          },
          body: JSON.stringify({
            email: email,
            purchaseId: purchaseData.id,
            orderDetails: {
              tickets: tickets,
              addOns: addOns,
              totals: { subtotal, tax, serviceFee, total }
            },
            timestamp: new Date().toISOString()
          }),
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (!webhookResponse.ok) {
          console.error('Webhook failed:', await webhookResponse.text());
        }
      } catch (webhookError) {
        console.error('Webhook error:', webhookError);
        // Don't fail the purchase if webhook fails
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      purchaseId: purchaseData.id 
    }), {
      status: 200,
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY"
      },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    
    const clientIP = getClientIP(req);
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    await supabase.from('purchase_audit_log').insert({
      action: 'unexpected_error',
      ip_address: clientIP,
      user_agent: userAgent,
      details: { error: error.message }
    });

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function generateWebhookSignature(data: any): Promise<string> {
  const secret = Deno.env.get("WEBHOOK_SECRET") || "default-secret";
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(JSON.stringify(data));
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}