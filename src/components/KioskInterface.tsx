
import React, { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import ContactInfoScreen from './ContactInfoScreen';
import ConfirmationScreen from './ConfirmationScreen';

export type TicketType = 'general' | 'student' | 'senior' | null;

export interface ContactInfo {
  email: string;
  postalCode: string;
}

export interface BookingData {
  ticketType: TicketType;
  contactInfo: ContactInfo;
  timestamp: Date;
}

const KioskInterface = () => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'contact' | 'confirmation'>('welcome');
  const [selectedTicket, setSelectedTicket] = useState<TicketType>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({ email: '', postalCode: '' });
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const handleTicketSelect = (ticketType: TicketType) => {
    setSelectedTicket(ticketType);
  };

  const handleContinueToContact = () => {
    if (selectedTicket) {
      setCurrentScreen('contact');
    }
  };

  const handleContactSubmit = (info: ContactInfo) => {
    setContactInfo(info);
    const booking: BookingData = {
      ticketType: selectedTicket,
      contactInfo: info,
      timestamp: new Date()
    };
    setBookingData(booking);
    setCurrentScreen('confirmation');
  };

  const handleStartOver = () => {
    setCurrentScreen('welcome');
    setSelectedTicket(null);
    setContactInfo({ email: '', postalCode: '' });
    setBookingData(null);
  };

  return (
    <div className="kiosk-container">
      {currentScreen === 'welcome' && (
        <WelcomeScreen 
          selectedTicket={selectedTicket}
          onTicketSelect={handleTicketSelect}
          onContinue={handleContinueToContact}
        />
      )}
      
      {currentScreen === 'contact' && (
        <ContactInfoScreen 
          onSubmit={handleContactSubmit}
          initialData={contactInfo}
        />
      )}
      
      {currentScreen === 'confirmation' && bookingData && (
        <ConfirmationScreen 
          bookingData={bookingData}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  );
};

export default KioskInterface;
