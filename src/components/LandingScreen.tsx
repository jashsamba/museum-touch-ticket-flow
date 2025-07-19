
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingScreenProps {
  onStartFlow: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onStartFlow }) => {
  const { t } = useLanguage();
  return (
    <div className="screen-container">
      <div className="museum-header">
        <div className="museum-logo">
          <img 
            src="/lovable-uploads/89e9f3f4-3877-44e4-9cf4-f5c8f0df9e46.png" 
            alt="TheMuseum Logo" 
            className="museum-logo-image"
          />
        </div>
      </div>
      
      <div className="landing-content fade-up">
        <button 
          className="buy-tickets-button button-pulse"
          onClick={onStartFlow}
        >
          {t('buyTickets')}
          <span className="payment-notice">{t('singleCardPayment')}</span>
        </button>
      </div>
    </div>
  );
};

export default LandingScreen;
