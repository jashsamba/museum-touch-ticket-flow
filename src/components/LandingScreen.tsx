import React from 'react';

interface LandingScreenProps {
  onStartFlow: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onStartFlow }) => {
  return (
    <div className="screen-container">
      <div className="museum-header">
        <div className="museum-logo">
          <span className="museum-title">THEMUSEUM</span>
        </div>
      </div>
      
      <div className="landing-content">
        <button 
          className="buy-tickets-button"
          onClick={onStartFlow}
        >
          BUY TICKETS
          <span className="payment-notice">Single card payment only</span>
        </button>
      </div>
    </div>
  );
};

export default LandingScreen;