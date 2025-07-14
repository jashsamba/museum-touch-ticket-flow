import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CheckoutScreenProps {
  onComplete: () => void;
  onBack: () => void;
  totals: any;
  quantities: {[key: string]: number};
  addOns: {[key: string]: number};
  userEmail?: string;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ onComplete, onBack, totals, quantities, addOns, userEmail }) => {
  const { t } = useLanguage();
  const [processing, setProcessing] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  // Define ticket and add-on items (same as TicketSelectionScreen)
  const tickets = [
    { id: 'adult-general', name: t('adultGeneral'), price: 19.99 },
    { id: 'child-general', name: t('childGeneral'), price: 14.99 },
    { id: 'senior-general', name: t('seniorGeneral'), price: 16.99 },
    { id: 'student-general', name: t('studentGeneral'), price: 16.99 }
  ];

  const addOnItems = [
    { id: 'donation-5', name: t('donation5'), price: 5.00 },
    { id: 'donation-10', name: t('donation10'), price: 10.00 },
    { id: 'donation-25', name: t('donation25'), price: 25.00 },
    { id: 'field-trip', name: t('fieldTrip'), price: 17.00 },
    { id: 'bus-subsidy', name: t('busSubsidy'), price: 15.00 }
  ];

  // Generate dynamic cart items based on current selections
  const generateCartItems = () => {
    const cartItems = [];
    
    // Add selected tickets
    tickets.forEach(ticket => {
      const quantity = quantities[ticket.id] || 0;
      if (quantity > 0) {
        cartItems.push({
          id: ticket.id,
          icon: '🎫',
          name: ticket.name,
          description: `${ticket.name} (${quantity})`,
          price: (quantity * ticket.price).toFixed(2),
          quantity
        });
      }
    });
    
    // Add selected add-ons
    addOnItems.forEach(addOn => {
      const quantity = addOns[addOn.id] || 0;
      if (quantity > 0) {
        cartItems.push({
          id: addOn.id,
          icon: '🎁',
          name: addOn.name,
          description: `${addOn.name} (${quantity})`,
          price: (quantity * addOn.price).toFixed(2),
          quantity
        });
      }
    });
    
    return cartItems;
  };

  const cartItems = generateCartItems();
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSendReceipt = async () => {
    if (!userEmail || emailSent || emailSending) return;
    
    setEmailSending(true);
    
    try {
      // Call N8N webhook
      const webhookUrl = 'https://your-n8n-webhook-url.com/webhook/receipt';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          email: userEmail,
          orderDetails: {
            tickets: quantities,
            addOns: addOns,
            totals: totals
          },
          timestamp: new Date().toISOString()
        })
      });
      
      setEmailSent(true);
      console.log('Receipt email sent to:', userEmail);
    } catch (error) {
      console.error('Failed to send receipt email:', error);
    } finally {
      setEmailSending(false);
    }
  };

  useEffect(() => {
    // Simulate payment processing after 3 seconds
    const timer = setTimeout(() => {
      setProcessing(true);
      // After another 3 seconds, complete the payment
      setTimeout(() => {
        onComplete();
      }, 3000);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="screen-container">
      <div className="museum-header">
        <button className="back-button" onClick={onBack}>← Details</button>
        <div className="date-time">11:00AM | September 23, 2025</div>
      </div>

      <div className="checkout-content">
        <div className="main-content">
          <div className="payment-terminal">
            <div className="payment-amount">
              <span className="payment-label">Card payment:</span>
              <span className="payment-total">${totals.total}</span>
            </div>
            
            <div className="terminal-icon">
              <div className="card-reader">
                <div className="card-slot"></div>
                <div className="screen"></div>
                <div className="keypad">
                  <div className="keypad-row">
                    <div className="key"></div>
                    <div className="key"></div>
                    <div className="key"></div>
                  </div>
                  <div className="keypad-row">
                    <div className="key"></div>
                    <div className="key"></div>
                    <div className="key"></div>
                  </div>
                  <div className="keypad-row">
                    <div className="key"></div>
                    <div className="key"></div>
                    <div className="key"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="payment-instructions">
              {processing ? (
                <div className="processing-message">
                  <div className="spinner"></div>
                  <p>Processing payment...</p>
                  {userEmail && (
                    <button 
                      className={`send-receipt-button ${emailSent ? 'sent' : ''} ${emailSending ? 'sending' : ''}`}
                      onClick={handleSendReceipt}
                      disabled={emailSent || emailSending}
                    >
                      {emailSending ? (
                        <>
                          <div className="mini-spinner"></div>
                          Sending...
                        </>
                      ) : emailSent ? (
                        <>✓ Email Sent</>
                      ) : (
                        'Send Receipt'
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <p>Please follow instructions<br/>on the PIN pad terminal</p>
              )}
            </div>
          </div>

          <button className="start-over-button">START OVER</button>
        </div>

        <div className="cart-sidebar">
          <div className="cart-header">
            <span className="cart-label">{t('yourCart')}</span>
            <span className="item-count">
              {totalItemCount === 0 ? t('noItems') : 
               totalItemCount === 1 ? `1 ${t('item')}` : 
               `${totalItemCount} ${t('items')}`}
            </span>
          </div>
          
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <span className="empty-cart-icon">🛒</span>
                <div className="empty-cart-text">{t('cartEmpty')}</div>
                <div className="empty-cart-subtext">{t('selectTicketsToStart')}</div>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <span className="item-icon">{item.icon}</span>
                  <div className="item-details">
                    <div>{item.name}</div>
                    <div>{item.description}</div>
                    <button className="edit-button">{t('edit')}</button>
                  </div>
                  <div className="item-price">${item.price}</div>
                </div>
              ))
            )}
          </div>

          <div className="cart-summary">
            <div className="summary-line">
              <span>{t('subtotal')}</span>
              <span>${totals?.subtotal || '0.00'}</span>
            </div>
            <div className="summary-line">
              <span>{t('selectedTax')}</span>
              <span>${totals?.tax || '0.00'}</span>
            </div>
            <div className="summary-line total">
              <span>{t('totalIncTax')}</span>
              <span>${totals?.total || '0.00'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutScreen;