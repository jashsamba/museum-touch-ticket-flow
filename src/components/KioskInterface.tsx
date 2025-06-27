
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import WelcomeScreen from './WelcomeScreen';
import ContactInfoScreen from './ContactInfoScreen';
import ConfirmationScreen from './ConfirmationScreen';
import AuthScreen from './AuthScreen';

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
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'auth' | 'contact' | 'confirmation'>('welcome');
  const [selectedTicket, setSelectedTicket] = useState<TicketType>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({ email: '', postalCode: '' });
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user && currentScreen === 'auth') {
        setCurrentScreen('welcome');
      }
    });

    return () => subscription.unsubscribe();
  }, [currentScreen]);

  const handleTicketSelect = (ticketType: TicketType) => {
    setSelectedTicket(ticketType);
  };

  const handleContinueToContact = () => {
    if (selectedTicket) {
      if (user) {
        setCurrentScreen('contact');
      } else {
        setCurrentScreen('auth');
      }
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

  const handleAuthBack = () => {
    setCurrentScreen('welcome');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentScreen('welcome');
    setSelectedTicket(null);
    setContactInfo({ email: '', postalCode: '' });
    setBookingData(null);
  };

  if (loading) {
    return (
      <div className="kiosk-container">
        <div className="screen-container">
          <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kiosk-container">
      {currentScreen === 'welcome' && (
        <WelcomeScreen 
          selectedTicket={selectedTicket}
          onTicketSelect={handleTicketSelect}
          onContinue={handleContinueToContact}
          user={user}
          onSignOut={handleSignOut}
        />
      )}
      
      {currentScreen === 'auth' && (
        <AuthScreen 
          onBack={handleAuthBack}
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
