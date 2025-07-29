import React, { useState, useEffect } from 'react';
import EnhancedQuantityControl from './EnhancedQuantityControl';
import { useLanguage } from '../contexts/LanguageContext';

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
  onBack: () => void;
  quantities: {[key: string]: number};
  addOns: {[key: string]: number};
  onUpdateQuantity: (id: string, change: number, isAddOn?: boolean) => void;
}

const TicketSelectionScreen: React.FC<TicketSelectionScreenProps> = ({
  onContinue,
  onBack,
  quantities,
  addOns,
  onUpdateQuantity
}) => {
  const { t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time as "11:00AM | September 23, 2025"
  const formatDateTime = (date: Date) => {
    const timeString = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    const dateString = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return `${timeString} | ${dateString}`;
  };

  const tickets: TicketItem[] = [
    { id: 'adult-general', name: t('adultGeneral'), price: 19.99 },
    { id: 'child-general', name: t('childGeneral'), price: 14.99 },
    { id: 'senior-general', name: t('seniorGeneral'), price: 16.99 },
    { id: 'student-general', name: t('studentGeneral'), price: 16.99 }
  ];

  const addOnItems: AddOnItem[] = [
    { id: 'donation-10', name: t('donation10'), price: 10.00 },
    { id: 'donation-15', name: t('donation15'), price: 15.00 },
    { id: 'donation-25', name: t('donation25'), price: 25.00 },
    { id: 'field-trip', name: 'Donate to support a field trip for an entire class!', price: 300.00 }
  ];


  const calculateTotal = () => {
    const ticketTotal = tickets.reduce((total, ticket) => {
      return total + (quantities[ticket.id] || 0) * ticket.price;
    }, 0);

    const addOnTotal = addOnItems.reduce((total, addOn) => {
      return total + (addOns[addOn.id] || 0) * addOn.price;
    }, 0);

    const subtotal = ticketTotal + addOnTotal;
    const tax = subtotal * 0.13; // 13% tax

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: (subtotal + tax).toFixed(2) // No service fee in display
    };
  };

  const totals = calculateTotal();
  const hasSelections = Object.values(quantities).some(q => q > 0) || Object.values(addOns).some(q => q > 0);

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
        <button className="back-button" onClick={onBack}>{t('backToMain')}</button>
        <div className="date-time">{formatDateTime(currentTime)}</div>
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
            <h2>{t('museumGeneralAdmission')}</h2>
          </div>

          <div className="ticket-section">
            <h3>{t('selectTicketsTitle')}</h3>
            {tickets.map(ticket => (
              <div key={ticket.id} className="ticket-item">
                <div className="ticket-details">
                  <div className="ticket-name">{ticket.name}</div>
                  <div className="ticket-price">${ticket.price}</div>
                  <div className="ticket-actions">{ticket.details}</div>
                </div>
                <EnhancedQuantityControl
                  quantity={quantities[ticket.id] || 0}
                  onUpdate={(change) => onUpdateQuantity(ticket.id, change)}
                  className="ticket-quantity"
                />
              </div>
            ))}
          </div>

          <div className="addons-section">
            <h3>{t('selectAddons')}</h3>
            <div className="donation-header">
              <h4>DONATION ADD-ON</h4>
              <p>{t('donationText1')}</p>
              <p>{t('donationText2')}</p>
              <p>{t('donationText3')}</p>
              <div className="donate-button">DONATE</div>
            </div>

            {addOnItems.map(addOn => (
              <div key={addOn.id} className="addon-item">
                <div className="addon-details">
                  <div className="addon-name">{addOn.name}</div>
                  <div className="addon-price">${addOn.price.toFixed(2)}</div>
                </div>
                <EnhancedQuantityControl
                  quantity={addOns[addOn.id] || 0}
                  onUpdate={(change) => onUpdateQuantity(addOn.id, change, true)}
                  className="addon-quantity"
                />
              </div>
            ))}
          </div>

          <div className="cart-total-bottom">
            <div className="cart-total-text">{t('cartTotal')}: ${totals.total}</div>
            <div className="action-buttons">
              <button className="continue-shopping">{t('continueShopping')}</button>
              <button
                className={`checkout-button ${hasSelections ? 'button-pulse' : ''}`}
                disabled={!hasSelections}
                onClick={handleContinue}
              >
                {t('checkoutButton')}
              </button>
            </div>
          </div>
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
              <span>${totals.subtotal}</span>
            </div>
            <div className="summary-line">
              <span>{t('selectedTax')}</span>
              <span>${totals.tax}</span>
            </div>
            <div className="summary-line total">
              <span>{t('totalIncTax')}</span>
              <span>${totals.total}</span>
            </div>
          </div>

          <button
            className={`checkout-button-sidebar ${hasSelections ? 'button-pulse' : ''}`}
            disabled={!hasSelections}
            onClick={handleContinue}
          >
            {t('checkoutButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketSelectionScreen;
