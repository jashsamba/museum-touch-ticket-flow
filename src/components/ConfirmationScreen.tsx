
import React from 'react';
import { CheckCircle, Calendar, Mail, MapPin, RefreshCw } from 'lucide-react';
import { BookingData } from './KioskInterface';

interface ConfirmationScreenProps {
  bookingData: BookingData;
  onStartOver: () => void;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  bookingData,
  onStartOver
}) => {
  const formatTicketType = (type: string) => {
    switch (type) {
      case 'general': return 'General Admission';
      case 'student': return 'Student';
      case 'senior': return 'Senior';
      default: return type;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-CA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-CA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="screen-container">
      <div className="screen-header">
        <div className="success-icon">
          <CheckCircle size={72} className="text-green-500" />
        </div>
        <h1 className="screen-title">Thank You!</h1>
        <p className="screen-subtitle">Your ticket has been booked successfully</p>
      </div>

      <div className="confirmation-details">
        <div className="ticket-preview">
          <div className="ticket-header">
            <h3>THEMUSEUM</h3>
            <div className="qr-placeholder">
              <div className="qr-code"></div>
            </div>
          </div>
          
          <div className="ticket-info">
            <div className="info-row">
              <span className="info-label">Ticket Type:</span>
              <span className="info-value">{formatTicketType(bookingData.ticketType!)}</span>
            </div>
            
            <div className="info-row">
              <Mail size={16} />
              <span className="info-value">{bookingData.contactInfo.email}</span>
            </div>
            
            <div className="info-row">
              <MapPin size={16} />
              <span className="info-value">{bookingData.contactInfo.postalCode}</span>
            </div>
            
            <div className="info-row">
              <Calendar size={16} />
              <span className="info-value">
                {formatDate(bookingData.timestamp)} at {formatTime(bookingData.timestamp)}
              </span>
            </div>
          </div>
        </div>

        <div className="confirmation-message">
          <p>A confirmation email has been sent to your email address with your ticket details.</p>
          <p>Please present this confirmation at the entrance.</p>
        </div>
      </div>

      <div className="screen-footer">
        <button className="start-over-button" onClick={onStartOver}>
          <RefreshCw size={24} />
          Start Over
        </button>
      </div>
    </div>
  );
};

export default ConfirmationScreen;
