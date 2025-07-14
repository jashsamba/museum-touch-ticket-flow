import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface DetailsScreenProps {
  onContinue: (details: any) => void;
  onBack: () => void;
  totals: any;
  quantities: {[key: string]: number};
  addOns: {[key: string]: number};
}

const DetailsScreen: React.FC<DetailsScreenProps> = ({ onContinue, onBack, totals, quantities, addOns }) => {
  const { t } = useLanguage();
  const [details, setDetails] = useState({
    email: '',
    postalCode: ''
  });

  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [formatError, setFormatError] = useState(false);

  const emailKeyboardLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '-', '⇧'],
    ['@gmail.com', '@outlook.com', '@yahoo.com', '@hotmail.com', 'space', '←']
  ];

  const postalCodeKeyboardLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', '←']
  ];

  const getCurrentKeyboardLayout = () => {
    return activeField === 'postalCode' ? postalCodeKeyboardLayout : emailKeyboardLayout;
  };

  const handleFieldFocus = (fieldName: string) => {
    setActiveField(fieldName);
    setShowKeyboard(true);
    setFormatError(false); // Reset any previous errors
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
    } else if (key === 'Enter') {
      // Close keyboard on Enter
      setShowKeyboard(false);
      setActiveField(null);
    } else if (key === 'space') {
      // Space handling (only for email field)
      if (activeField === 'email') {
        setDetails(prev => ({
          ...prev,
          [activeField]: String(prev[activeField as keyof typeof prev]) + ' '
        }));
      }
    } else if (key.startsWith('@')) {
      // Email domain shortcut (only for email field)
      if (activeField === 'email') {
        setDetails(prev => ({
          ...prev,
          [activeField]: String(prev[activeField as keyof typeof prev]) + key
        }));
      }
    } else if (key !== '⇧') {
      // Regular character
      if (activeField) {
        const currentValue = String(details[activeField as keyof typeof details]);
        
        if (activeField === 'postalCode') {
          // Simple postal code - just allow 6 alphanumeric characters
          if (currentValue.length < 6 && /[A-Za-z0-9]/.test(key)) {
            setDetails(prev => ({
              ...prev,
              [activeField]: currentValue + key.toUpperCase()
            }));
          } else if (currentValue.length >= 6) {
            setFormatError(true);
            setTimeout(() => setFormatError(false), 300);
          }
        } else {
          // For email field, just add the character
          setDetails(prev => ({
            ...prev,
            [activeField]: currentValue + key
          }));
        }
      }
    }
  };

  // Validate if character is allowed at specific position for postal code
  const isValidCharacterAtPosition = (char: string, position: number) => {
    // Canadian postal code pattern: A1A 1A1 (positions 0,1,2,4,5,6 - position 3 is space)
    // Position 0, 2, 5: Letters (A-Z)
    // Position 1, 4, 6: Numbers (0-9)
    
    if (position === 0 || position === 2 || position === 5) {
      return /[A-Za-z]/.test(char);
    } else if (position === 1 || position === 4 || position === 6) {
      return /\d/.test(char);
    }
    
    return false; // Invalid position
  };

  // Format Canadian postal code (A1A 1A1) with real-time validation and auto-space
  const formatCanadianPostalCode = (newChar: string, currentValue: string) => {
    // Remove spaces for position calculation
    const withoutSpaces = currentValue.replace(/\s/g, '');
    const position = withoutSpaces.length;
    
    // Don't allow more than 6 characters (excluding space)
    if (position >= 6) {
      setFormatError(true);
      setTimeout(() => setFormatError(false), 300);
      return currentValue;
    }
    
    // Check if the new character is valid at this position
    if (!isValidCharacterAtPosition(newChar, position)) {
      // Trigger error animation
      setFormatError(true);
      setTimeout(() => setFormatError(false), 300);
      return currentValue; // Don't add the character
    }
    
    // Add the character and format
    const newValueWithoutSpace = withoutSpaces + newChar.toUpperCase();
    
    // Automatically add space after 3rd character
    if (newValueWithoutSpace.length > 3) {
      return newValueWithoutSpace.slice(0, 3) + ' ' + newValueWithoutSpace.slice(3);
    }
    
    return newValueWithoutSpace;
  };

  const handleContinue = () => {
    onContinue(details);
  };

  const isValidForm = () => {
    // Email validation
    const emailValid = details.email.includes('@') && details.email.includes('.');
    
    // Simple postal code validation - just 6 alphanumeric characters
    const postalCodeValid = details.postalCode.length === 6 && /^[A-Z0-9]{6}$/.test(details.postalCode);
    
    return emailValid && postalCodeValid;
  };

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

  return (
    <div className="screen-container">
      <div className="museum-header">
        <button className="back-button" onClick={onBack}>← Checkout</button>
        <div className="date-time">11:00AM | September 23, 2025</div>
      </div>

      <div className="details-content">
        <div className="main-content">
          <div className="details-header">
            <h2>Your Details</h2>
            <p>Please enter your details before checking out.</p>
          </div>

          <div className="details-form">
            <div className="form-field">
              <label>Email address*</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={details.email}
                onFocus={() => handleFieldFocus('email')}
                readOnly
              />
              {details.email && details.email.includes('@') && details.email.includes('.') && (
                <span className="validation-check">✓</span>
              )}
            </div>

            <div className="form-field">
              <label>Postal code* (6 characters)</label>
              <input
                type="text"
                placeholder="6 characters"
                value={details.postalCode}
                onFocus={() => handleFieldFocus('postalCode')}
                className={`${formatError ? 'format-error' : ''}`}
                readOnly
              />
              {details.postalCode && details.postalCode.length === 6 && (
                <span className="validation-check">✓</span>
              )}
            </div>

            <button 
              className="continue-button"
              disabled={!isValidForm()}
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>

          {showKeyboard && (
            <div className="keyboard-overlay">
              <div className="virtual-keyboard">
                <div className="keyboard-header">
                  <span>
                    {activeField === 'email' ? 'Enter your email address' : 'Enter your postal code (6 characters)'}
                  </span>
                  <button
                    className="keyboard-close"
                    onClick={() => {
                      setShowKeyboard(false);
                      setActiveField(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
                
                <div className={`typing-display ${formatError ? 'typing-error' : ''}`}>
                  <div className="typing-label">
                    {activeField === 'email' ? 'Email address:' : 'Postal code (6 characters):'}
                  </div>
                  <div className="typing-input">
                    {activeField === 'email' 
                      ? (details.email || "Start typing...")
                      : (details.postalCode || "6 characters")
                    }
                    <span className="typing-cursor">|</span>
                  </div>
                </div>
                
                {getCurrentKeyboardLayout().map((row, rowIndex) => (
                  <div key={rowIndex} className="keyboard-row">
                    {row.map((key, keyIndex) => (
                      <button
                        key={keyIndex}
                        className={`keyboard-key ${key.startsWith('@') ? 'email-domain-key' : ''} ${key === 'space' ? 'space-key' : ''}`}
                        onClick={() => handleKeyPress(key)}
                      >
                        {key === 'space' ? 'SPACE' : key}
                      </button>
                    ))}
                  </div>
                ))}
                <div className="keyboard-row">
                  <button
                    className="keyboard-key enter-key"
                    onClick={() => handleKeyPress('Enter')}
                  >
                    Enter
                  </button>
                </div>
              </div>
            </div>
          )}
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

export default DetailsScreen;