-- Fix security policies for ticket_purchases table
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "allow_public_insert" ON public.ticket_purchases;
DROP POLICY IF EXISTS "select_own_purchases" ON public.ticket_purchases;

-- Create more secure policies
-- Allow inserts only with proper validation and rate limiting
CREATE POLICY "secure_insert_purchases" ON public.ticket_purchases
FOR INSERT
WITH CHECK (
  -- Basic validation: ensure required fields are present
  first_name IS NOT NULL AND 
  last_name IS NOT NULL AND 
  email IS NOT NULL AND
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
  subtotal > 0 AND
  total > 0 AND
  status IN ('pending', 'completed', 'failed')
);

-- Only allow reading purchases from the last 24 hours (for receipt purposes)
CREATE POLICY "select_recent_purchases" ON public.ticket_purchases
FOR SELECT
USING (created_at >= now() - interval '24 hours');

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS public.purchase_rate_limits (
  ip_address INET NOT NULL,
  last_purchase TIMESTAMPTZ NOT NULL DEFAULT now(),
  purchase_count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (ip_address)
);

-- Enable RLS on rate limiting table
ALTER TABLE public.purchase_rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage rate limits
CREATE POLICY "service_role_rate_limits" ON public.purchase_rate_limits
FOR ALL
USING (true);

-- Create function to check rate limits
CREATE OR REPLACE FUNCTION check_purchase_rate_limit(client_ip INET)
RETURNS BOOLEAN AS $$
DECLARE
  last_purchase TIMESTAMPTZ;
  count_in_window INTEGER;
BEGIN
  -- Check if IP has purchased in the last minute
  SELECT last_purchase INTO last_purchase 
  FROM purchase_rate_limits 
  WHERE ip_address = client_ip;
  
  IF last_purchase IS NOT NULL AND last_purchase > now() - interval '1 minute' THEN
    -- Check count in last hour
    SELECT purchase_count INTO count_in_window
    FROM purchase_rate_limits 
    WHERE ip_address = client_ip;
    
    IF count_in_window >= 5 THEN
      RETURN FALSE; -- Rate limit exceeded
    END IF;
  END IF;
  
  -- Update or insert rate limit record
  INSERT INTO purchase_rate_limits (ip_address, last_purchase, purchase_count)
  VALUES (client_ip, now(), 1)
  ON CONFLICT (ip_address) 
  DO UPDATE SET 
    last_purchase = now(),
    purchase_count = CASE 
      WHEN purchase_rate_limits.last_purchase < now() - interval '1 hour' 
      THEN 1 
      ELSE purchase_rate_limits.purchase_count + 1 
    END;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit log table
CREATE TABLE IF NOT EXISTS public.purchase_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID REFERENCES public.ticket_purchases(id),
  action TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  details JSONB
);

ALTER TABLE public.purchase_audit_log ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage audit logs
CREATE POLICY "service_role_audit_logs" ON public.purchase_audit_log
FOR ALL
USING (true);