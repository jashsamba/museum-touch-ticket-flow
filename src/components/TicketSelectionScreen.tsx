import React, { useState } from 'react';

interface TicketItem {
  id: string;
  name: string;
  price: number;
  details?: string;
}

interface AddOnItem {
  id: string;
  name: string;
  price: number;
  description?: string;
}

interface TicketSelectionScreenProps {
  onContinue: (selections: any) => void;
}

const TicketSelectionScreen: React.FC<TicketSelectionScreenProps> = ({ onContinue }) => {
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  const [addOns, setAddOns] = useState<{[key: string]: number}>({});

  const tickets: TicketItem[] = [
    { id: 'adult-general', name: 'Adult General Admission (17+)', price: 19.99, details: 'Details >' },
    { id: 'child-general', name: 'Child General Admission (4-17)', price: 14.99, details: 'Details >' },
    { id: 'senior-general', name: 'Senior General Admission (65+)', price: 16.99, details: 'Details >' },
    { id: 'student-general', name: 'Student General Admission', price: 16.99, details: 'Details >' }
  ];

  const addOnItems: AddOnItem[] = [
    { id: 'donation-5', name: '$5.00 Donation "Recommended"', price: 5.00 },
    { id: 'donation-10', name: '$10.00 Donation', price: 10.00 },
    { id: 'donation-25', name: '$25.00 Donation', price: 25.00 },
    { id: 'field-trip', name: 'Donation for 1 student to attend a field trip free of charge!', price: 17.00 },
    { id: 'bus-subsidy', name: 'Sponsor a bus! Transportation subsidy for 1 class field trip.', price: 15.00 }
  ];

  const updateQuantity = (id: string, change: number, isAddOn: boolean = false) => {
    if (isAddOn) {
      setAddOns(prev => ({
        ...prev,
        [id]: Math.max(0, (prev[id] || 0) + change)
      }));
    } else {
      setQuantities(prev => ({
        ...prev,
        [id]: Math.max(0, (prev[id] || 0) + change)
      }));
    }
  };

  const calculateTotal = () => {
    const ticketTotal = tickets.reduce((total, ticket) => {
      return total + (quantities[ticket.id] || 0) * ticket.price;
    }, 0);
    
    const addOnTotal = addOnItems.reduce((total, addOn) => {
      return total + (addOns[addOn.id] || 0) * addOn.price;
    }, 0);
    
    const subtotal = ticketTotal + addOnTotal;
    const tax = subtotal * 0.13; // 13% tax
    const serviceFee = 1.14;
    
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      serviceFee: serviceFee.toFixed(2),
      total: (subtotal + tax + serviceFee).toFixed(2)
    };
  };

  const totals = calculateTotal();
  const hasSelections = Object.values(quantities).some(q => q > 0) || Object.values(addOns).some(q => q > 0);

  const handleContinue = () => {
    onContinue({
      tickets: quantities,
      addOns: addOns,
      totals: totals
    });
  };

  return (
    <div className="screen-container">
      <div className="museum-header">
        <button className="back-button">← Checkout</button>
        <div className="date-time">11:00AM | September 23, 2025</div>
      </div>

      <div className="ticket-selection-content">
        <div className="main-content">
          <div className="museum-logo-section">
            <div className="museum-logo-box">
              <span className="museum-logo-text">M</span>
              <span className="museum-subtitle">THEMUSEUM</span>
            </div>
          </div>

          <div className="ticket-info">
            <h2>THEMUSEUM General Admission</h2>
            <p>Purchase tickets for general admission to THEMUSEUM as advance listed. Please print "read more" for details. Read more</p>
          </div>

          <div className="ticket-section">
            <h3>Select Tickets</h3>
            {tickets.map(ticket => (
              <div key={ticket.id} className="ticket-item">
                <div className="ticket-details">
                  <div className="ticket-name">{ticket.name}</div>
                  <div className="ticket-price">${ticket.price}</div>
                  <div className="ticket-actions">{ticket.details}</div>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(ticket.id, -1)}>−</button>
                  <span className="quantity">{quantities[ticket.id] || 0}</span>
                  <button onClick={() => updateQuantity(ticket.id, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="addons-section">
            <h3>Select Add-ons</h3>
            <div className="donation-header">
              <div className="donate-button">DONATE</div>
              <p>Thanks for your generous support of THEMUSEUM! It's thanks to you that THEMUSEUM continues to, grow, inspire and enlighten.</p>
              <p>Donations of $10 or greater are eligible for a tax receipt.</p>
              <p>Registered Name: THEMUSEUM of Hoax Transcending Objects Charitable Registration Number: 80709586001</p>
            </div>
            
            {addOnItems.map(addOn => (
              <div key={addOn.id} className="addon-item">
                <div className="addon-details">
                  <div className="addon-name">{addOn.name}</div>
                  <div className="addon-price">${addOn.price.toFixed(2)}</div>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(addOn.id, -1, true)}>−</button>
                  <span className="quantity">{addOns[addOn.id] || 0}</span>
                  <button onClick={() => updateQuantity(addOn.id, 1, true)}>+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-total-bottom">
            <div className="cart-total-text">Cart total: ${totals.total}</div>
            <div className="action-buttons">
              <button className="continue-shopping">Continue Shopping</button>
              <button 
                className="checkout-button" 
                disabled={!hasSelections}
                onClick={handleContinue}
              >
                Checkout
              </button>
            </div>
          </div>
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

          <button 
            className="checkout-button-sidebar"
            disabled={!hasSelections}
            onClick={handleContinue}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketSelectionScreen;