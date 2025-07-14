import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CompletionScreenProps {
  onStartOver: () => void;
  orderDetails?: {
    email: string;
    tickets: {[key: string]: number};
    addOns: {[key: string]: number};
    totals: {
      subtotal: string;
      tax: string;
      total: string;
    };
  };
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ onStartOver, orderDetails }) => {
  const { t } = useLanguage();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [showWebhookConfig, setShowWebhookConfig] = useState(false);

  // Send order data to n8n webhook
  const sendToN8n = async (webhookUrl: string) => {
    if (!orderDetails || !webhookUrl) return;

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          order_id: `ORDER-${Date.now()}`,
          customer_email: orderDetails.email,
          tickets: orderDetails.tickets,
          addOns: orderDetails.addOns,
          totals: orderDetails.totals,
          museum: "THEMUSEUM",
          triggered_from: window.location.origin,
        }),
      });
      
      console.log('Order data sent to n8n workflow');
    } catch (error) {
      console.error('Failed to send data to n8n:', error);
    }
  };

  // Auto-send to webhook if URL is configured
  useEffect(() => {
    const savedWebhookUrl = localStorage.getItem('n8n-webhook-url');
    if (savedWebhookUrl && orderDetails) {
      setWebhookUrl(savedWebhookUrl);
      sendToN8n(savedWebhookUrl);
    }
  }, [orderDetails]);

  const handleWebhookSave = () => {
    localStorage.setItem('n8n-webhook-url', webhookUrl);
    setShowWebhookConfig(false);
    if (orderDetails) {
      sendToN8n(webhookUrl);
    }
  };

  const handleManualTrigger = () => {
    if (webhookUrl && orderDetails) {
      sendToN8n(webhookUrl);
    }
  };

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
          
          <div className="webhook-controls">
            <button 
              className="webhook-config-button"
              onClick={() => setShowWebhookConfig(!showWebhookConfig)}
            >
              ⚙️ Configure n8n Webhook
            </button>
            
            {webhookUrl && (
              <button 
                className="webhook-trigger-button"
                onClick={handleManualTrigger}
              >
                📧 Resend Email Receipt
              </button>
            )}
          </div>
          
          {showWebhookConfig && (
            <div className="webhook-config">
              <h3>n8n Webhook Configuration</h3>
              <p>Enter your n8n webhook URL to automatically send email receipts:</p>
              <input
                type="url"
                placeholder="https://your-n8n-instance.com/webhook/your-webhook-id"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="webhook-input"
              />
              <div className="webhook-actions">
                <button onClick={handleWebhookSave} className="save-button">
                  Save & Test
                </button>
                <button onClick={() => setShowWebhookConfig(false)} className="cancel-button">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;