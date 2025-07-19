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
          <span className="museum-title">THEMUSEUM</span>
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