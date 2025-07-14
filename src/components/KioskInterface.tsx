
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import LandingScreen from './LandingScreen';
import TicketSelectionScreen from './TicketSelectionScreen';
import DetailsScreen from './DetailsScreen';
import CheckoutScreen from './CheckoutScreen';
import CompletionScreen from './CompletionScreen';

export interface FlowData {
  selections?: any;
  details?: any;
  totals?: any;
}

const KioskInterface = () => {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'tickets' | 'details' | 'checkout' | 'completion'>('landing');
  const [flowData, setFlowData] = useState<FlowData>({});
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
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleStartFlow = () => {
    setCurrentScreen('tickets');
  };

  const handleBackToLanding = () => {
    setCurrentScreen('landing');
  };

  const handleBackToTickets = () => {
    setCurrentScreen('tickets');
  };

  const handleBackToDetails = () => {
    setCurrentScreen('details');
  };

  const handleTicketSelections = (selections: any) => {
    setFlowData(prev => ({ ...prev, selections }));
    setCurrentScreen('details');
  };

  const handleDetailsSubmit = (details: any) => {
    setFlowData(prev => ({ ...prev, details }));
    setCurrentScreen('checkout');
  };

  const handlePaymentComplete = () => {
    setCurrentScreen('completion');
  };

  const handleStartOver = () => {
    setCurrentScreen('landing');
    setFlowData({});
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
      {currentScreen === 'landing' && (
        <LandingScreen onStartFlow={handleStartFlow} />
      )}
      
      {currentScreen === 'tickets' && (
        <TicketSelectionScreen 
          onContinue={handleTicketSelections}
          onBack={handleBackToLanding}
        />
      )}
      
      {currentScreen === 'details' && (
        <DetailsScreen 
          onContinue={handleDetailsSubmit}
          onBack={handleBackToTickets}
          totals={flowData.selections?.totals}
        />
      )}
      
      {currentScreen === 'checkout' && (
        <CheckoutScreen 
          onComplete={handlePaymentComplete}
          onBack={handleBackToDetails}
          totals={flowData.selections?.totals}
        />
      )}
      
      {currentScreen === 'completion' && (
        <CompletionScreen onStartOver={handleStartOver} />
      )}
    </div>
  );
};

export default KioskInterface;
