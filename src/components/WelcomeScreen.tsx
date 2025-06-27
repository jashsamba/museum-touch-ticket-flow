
import React from 'react';
import { Users, GraduationCap, Heart } from 'lucide-react';
import { TicketType } from './KioskInterface';

interface WelcomeScreenProps {
  selectedTicket: TicketType;
  onTicketSelect: (ticketType: TicketType) => void;
  onContinue: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  selectedTicket,
  onTicketSelect,
  onContinue
}) => {
  return (
    <div className="screen-container">
      <div className="screen-header">
        <h1 className="museum-title">Welcome to THEMUSEUM</h1>
        <p className="screen-subtitle">Select your ticket type to continue</p>
      </div>

      <div className="ticket-selection">
        <button 
          className={`ticket-button ${selectedTicket === 'general' ? 'selected' : ''}`}
          onClick={() => onTicketSelect('general')}
        >
          <Users className="ticket-icon" size={48} />
          <span className="ticket-text">General Admission</span>
          <span className="ticket-price">$25</span>
        </button>

        <button 
          className={`ticket-button ${selectedTicket === 'student' ? 'selected' : ''}`}
          onClick={() => onTicketSelect('student')}
        >
          <GraduationCap className="ticket-icon" size={48} />
          <span className="ticket-text">Student</span>
          <span className="ticket-price">$15</span>
        </button>

        <button 
          className={`ticket-button ${selectedTicket === 'senior' ? 'selected' : ''}`}
          onClick={() => onTicketSelect('senior')}
        >
          <Heart className="ticket-icon" size={48} />
          <span className="ticket-text">Senior</span>
          <span className="ticket-price">$20</span>
        </button>
      </div>

      <div className="screen-footer">
        <button 
          className={`continue-button ${selectedTicket ? 'active' : 'disabled'}`}
          onClick={onContinue}
          disabled={!selectedTicket}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
