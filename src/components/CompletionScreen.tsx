import React from 'react';

interface CompletionScreenProps {
  onStartOver: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ onStartOver }) => {
  return (
    <div className="screen-container">
      <div className="museum-header">
        <div className="museum-logo">
          <span className="museum-title">THEMUSEUM</span>
        </div>
        <div className="language-selector">
          🇬🇧 EN ▼
        </div>
        <div className="museum-text">MUSEUM</div>
      </div>
      
      <div className="completion-content">
        <div className="completion-message">
          <p>Please take the receipt to<br/>
          Guest Services and enjoy<br/>
          your visit to THEMUSEUM.</p>
          
          <p className="email-backup">A backup receipt has been<br/>
          sent to your email.</p>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;