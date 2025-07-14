import React, { useState } from 'react';

interface DetailsScreenProps {
  onContinue: (details: any) => void;
  totals: any;
}

const DetailsScreen: React.FC<DetailsScreenProps> = ({ onContinue, totals }) => {
  const [details, setDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    postalCode: '',
    discountCode: '',
    emailOffers: true,
    acceptTerms: true
  });

  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  const keyboardLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '-', '⇧'],
    ['123', '@', '_', 'space', '.', '←']
  ];

  const handleFieldFocus = (fieldName: string) => {
    setActiveField(fieldName);
    setShowKeyboard(true);
  };

  const handleKeyPress = (key: string) => {
    if (key === '←') {
      // Backspace
      if (activeField) {
        setDetails(prev => ({
          ...prev,
          [activeField]: String(prev[activeField as keyof typeof prev]).slice(0, -1)
        }));
      }
    } else if (key === 'space') {
      // Space
      if (activeField) {
        setDetails(prev => ({
          ...prev,
          [activeField]: String(prev[activeField as keyof typeof prev]) + ' '
        }));
      }
    } else if (key !== '⇧' && key !== '123') {
      // Regular character
      if (activeField) {
        setDetails(prev => ({
          ...prev,
          [activeField]: String(prev[activeField as keyof typeof prev]) + key
        }));
      }
    }
  };

  const handleContinue = () => {
    onContinue(details);
  };

  const isValid = details.firstName && details.lastName && details.email && details.contactNumber && details.postalCode && details.acceptTerms;

  return (
    <div className="screen-container">
      <div className="museum-header">
        <button className="back-button">← Your Details</button>
        <div className="date-time">11:00AM | September 23, 2025</div>
      </div>

      <div className="details-content">
        <div className="main-content">
          <div className="details-header">
            <h2>Your Details</h2>
            <p>Please enter your details before checking out.</p>
          </div>

          <div className="details-form">
            <div className="form-row">
              <div className="form-field">
                <label>First name*</label>
                <input
                  type="text"
                  placeholder="Placeholder"
                  value={details.firstName}
                  onFocus={() => handleFieldFocus('firstName')}
                  readOnly
                />
              </div>
              <div className="form-field">
                <label>Last name*</label>
                <input
                  type="text"
                  placeholder="Placeholder"
                  value={details.lastName}
                  onFocus={() => handleFieldFocus('lastName')}
                  readOnly
                />
              </div>
            </div>

            <div className="form-field">
              <label>Email address*</label>
              <input
                type="email"
                placeholder="placeholder@placeholder.ca"
                value={details.email}
                onFocus={() => handleFieldFocus('email')}
                readOnly
              />
              {details.email && <span className="validation-check">✓</span>}
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Contact number*</label>
                <input
                  type="tel"
                  placeholder="+1 () 123456789"
                  value={details.contactNumber}
                  onFocus={() => handleFieldFocus('contactNumber')}
                  readOnly
                />
              </div>
              <div className="form-field">
                <label>Postal code*</label>
                <input
                  type="text"
                  placeholder="A1B 2C3"
                  value={details.postalCode}
                  onFocus={() => handleFieldFocus('postalCode')}
                  readOnly
                />
              </div>
            </div>

            <div className="discount-section">
              <h3>Apply a Discount</h3>
              <p>Add a Discount code, gift card or membership below.</p>
              <div className="form-field">
                <input
                  type="text"
                  placeholder="Redeem now"
                  value={details.discountCode}
                  onFocus={() => handleFieldFocus('discountCode')}
                  readOnly
                />
              </div>
            </div>

            <div className="checkbox-section">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={details.emailOffers}
                  onChange={(e) => setDetails(prev => ({ ...prev, emailOffers: e.target.checked }))}
                />
                Email me with news and offers.
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={details.acceptTerms}
                  onChange={(e) => setDetails(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                />
                I have read and accepted the terms and conditions.
              </label>
            </div>

            <button 
              className="continue-button"
              disabled={!isValid}
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>

          {showKeyboard && (
            <div className="virtual-keyboard">
              {keyboardLayout.map((row, rowIndex) => (
                <div key={rowIndex} className="keyboard-row">
                  {row.map((key, keyIndex) => (
                    <button
                      key={keyIndex}
                      className={`keyboard-key ${key === 'space' ? 'space-key' : ''}`}
                      onClick={() => handleKeyPress(key)}
                    >
                      {key === 'space' ? '' : key}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
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

export default DetailsScreen;