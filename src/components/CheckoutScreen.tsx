import React, { useState, useEffect } from 'react';

interface CheckoutScreenProps {
  onComplete: () => void;
  totals: any;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ onComplete, totals }) => {
  const [processing, setProcessing] = useState(false);

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
        <button className="back-button">← Checkout</button>
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
            <span className="cart-label">Your Cart</span>
            <span className="item-count">1 ITEM</span>
          </div>
          
          <div className="cart-items">
            <div className="cart-item">
              <span className="item-icon">🎫</span>
              <div className="item-details">
                <div>THEMUSEUM General</div>
                <div>Adult General Admission (1...)</div>
                <button className="edit-button">Edit</button>
              </div>
              <div className="item-price">${totals.subtotal}</div>
            </div>
            
            <div className="cart-item">
              <span className="item-icon">🎁</span>
              <div className="item-details">
                <div>Donation Add-On</div>
                <div>$5.00 Donation "Recommend...</div>
                <button className="edit-button">Edit</button>
              </div>
              <div className="item-price">$5.00</div>
            </div>
          </div>

          <div className="cart-summary">
            <div className="summary-line">
              <span>Subtotal</span>
              <span>${totals.subtotal}</span>
            </div>
            <div className="summary-line">
              <span>Selected tax</span>
              <span>${totals.tax}</span>
            </div>
            <div className="summary-line">
              <span>Service fee</span>
              <span>${totals.serviceFee}</span>
            </div>
            <div className="summary-line total">
              <span>Total (inc. tax)</span>
              <span>${totals.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutScreen;