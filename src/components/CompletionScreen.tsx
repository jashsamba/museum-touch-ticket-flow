import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CompletionScreenProps {
  onStartOver: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ onStartOver }) => {
  const { t } = useLanguage();
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
        <div className="completion-center-container">
          <div className="completion-message">
            <p>{t('completionMessage')}</p>
            
            <p className="email-backup">{t('emailBackup')}</p>
          </div>
          
          <button 
            className="start-over-button"
            onClick={onStartOver}
          >
            {t('startNewPurchase')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;