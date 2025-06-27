
import React from 'react';
import { Users, GraduationCap, Heart, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { TicketType } from './KioskInterface';

interface WelcomeScreenProps {
  selectedTicket: TicketType;
  onTicketSelect: (ticketType: TicketType) => void;
  onContinue: () => void;
  user: User | null;
  onSignOut: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  selectedTicket,
  onTicketSelect,
  onContinue,
  user,
  onSignOut
}) => {
  return (
    <div className="screen-container">
      <div className="screen-header">
        <div className="header-top">
          <h1 className="museum-title">Welcome to THEMUSEUM</h1>
          {user && (
            <div className="user-info">
              <div className="user-details">
                <UserIcon size={20} />
                <span>{user.email}</span>
              </div>
              <button className="sign-out-button" onClick={onSignOut}>
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
        <p className="screen-subtitle">Select your ticket type to continue</p>
      </div>

      <div className="ticket-selection">
        <button 
          className={`ticket-button ${selectedTicket === 'general' ? 'selected' : ''}`}
          onClick={() => onTicketSelect('general')}
        >
          <Users className="ticket-icon" size={32} />
          <span className="ticket-text">General Admission</span>
          <span className="ticket-price">$25</span>
        </button>

        <button 
          className={`ticket-button ${selectedTicket === 'student' ? 'selected' : ''}`}
          onClick={() => onTicketSelect('student')}
        >
          <GraduationCap className="ticket-icon" size={32} />
          <span className="ticket-text">Student</span>
          <span className="ticket-price">$15</span>
        </button>

        <button 
          className={`ticket-button ${selectedTicket === 'senior' ? 'selected' : ''}`}
          onClick={() => onTicketSelect('senior')}
        >
          <Heart className="ticket-icon" size={32} />
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
          {user ? 'Continue' : 'Continue (Sign In Required)'}
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
