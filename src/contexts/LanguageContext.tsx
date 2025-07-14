import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Landing Screen
    buyTickets: 'BUY TICKETS',
    singleCardPayment: 'Single card payment only',
    
    // Progress Steps
    selectTickets: 'Select Tickets',
    yourDetails: 'Your Details',
    payment: 'Payment',
    complete: 'Complete',
    
    // Museum Header
    checkout: 'Checkout',
    
    // Ticket Selection
    museumGeneralAdmission: 'THEMUSEUM General Admission',
    ticketDescription: 'Purchase tickets for general admission to THEMUSEUM as advance listed. Please print "read more" for details. Read more',
    selectTicketsTitle: 'Select Tickets',
    adultGeneral: 'Adult General Admission (17+)',
    childGeneral: 'Child General Admission (4-17)',
    seniorGeneral: 'Senior General Admission (65+)',
    studentGeneral: 'Student General Admission',
    details: 'Details >',
    selectAddons: 'Select Add-ons',
    donate: 'DONATE',
    donationText1: 'Thanks for your generous support of THEMUSEUM! It\'s thanks to you that THEMUSEUM continues to, grow, inspire and enlighten.',
    donationText2: 'Donations of $10 or greater are eligible for a tax receipt.',
    donationText3: 'Registered Name: THEMUSEUM of Hoax Transcending Objects Charitable Registration Number: 80709586001',
    donation5: '$5.00 Donation "Recommended"',
    donation10: '$10.00 Donation',
    donation25: '$25.00 Donation',
    fieldTrip: 'Donation for 1 student to attend a field trip free of charge!',
    busSubsidy: 'Sponsor a bus! Transportation subsidy for 1 class field trip.',
    cartTotal: 'Cart total',
    continueShopping: 'Continue Shopping',
    checkoutButton: 'Checkout',
    yourCart: 'Your Cart',
    item: 'ITEM',
    items: 'ITEMS',
    noItems: 'NO ITEMS',
    cartEmpty: 'Your cart is empty',
    selectTicketsToStart: 'Select tickets to get started',
    edit: 'Edit',
    subtotal: 'Subtotal',
    selectedTax: 'Selected tax',
    serviceFee: 'Service fee',
    totalIncTax: 'Total (inc. tax)',
    
    // Details Screen
    yourDetailsTitle: 'Your Details',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email Address',
    phoneNumber: 'Phone Number',
    postalCode: 'Postal Code',
    newsletter: 'Send me newsletters and updates',
    continueButton: 'Continue',
    
    // Checkout Screen
    processingPayment: 'Processing payment...',
    cardReader: 'Card Reader',
    startOver: 'Start Over',
    
    // Completion Screen
    completionMessage: 'Please take the receipt to\nGuest Services and enjoy\nyour visit to THEMUSEUM.',
    emailBackup: 'A backup receipt has been\nsent to your email.',
    startNewPurchase: 'Start New Purchase',
    
    // Language
    language: 'Language',
    english: 'English',
    french: 'Français'
  },
  fr: {
    // Landing Screen
    buyTickets: 'ACHETER BILLETS',
    singleCardPayment: 'Paiement par carte unique seulement',
    
    // Progress Steps
    selectTickets: 'Sélectionner Billets',
    yourDetails: 'Vos Détails',
    payment: 'Paiement',
    complete: 'Terminé',
    
    // Museum Header
    checkout: 'Commande',
    
    // Ticket Selection
    museumGeneralAdmission: 'THEMUSEUM Admission Générale',
    ticketDescription: 'Achetez des billets pour l\'admission générale au THEMUSEUM comme indiqué à l\'avance. Veuillez imprimer "lire plus" pour les détails. Lire plus',
    selectTicketsTitle: 'Sélectionner les Billets',
    adultGeneral: 'Admission Générale Adulte (17+)',
    childGeneral: 'Admission Générale Enfant (4-17)',
    seniorGeneral: 'Admission Générale Senior (65+)',
    studentGeneral: 'Admission Générale Étudiant',
    details: 'Détails >',
    selectAddons: 'Sélectionner Suppléments',
    donate: 'DONNER',
    donationText1: 'Merci pour votre généreux soutien au THEMUSEUM! C\'est grâce à vous que THEMUSEUM continue de grandir, d\'inspirer et d\'éclairer.',
    donationText2: 'Les dons de 10$ ou plus sont admissibles à un reçu fiscal.',
    donationText3: 'Nom enregistré: THEMUSEUM of Hoax Transcending Objects Numéro d\'enregistrement caritatif: 80709586001',
    donation5: 'Don de 5,00$ "Recommandé"',
    donation10: 'Don de 10,00$',
    donation25: 'Don de 25,00$',
    fieldTrip: 'Don pour qu\'un étudiant participe à une sortie scolaire gratuitement!',
    busSubsidy: 'Parrainez un autobus! Subvention de transport pour une sortie scolaire.',
    cartTotal: 'Total du panier',
    continueShopping: 'Continuer les Achats',
    checkoutButton: 'Commander',
    yourCart: 'Votre Panier',
    item: 'ARTICLE',
    items: 'ARTICLES',
    noItems: 'AUCUN ARTICLE',
    cartEmpty: 'Votre panier est vide',
    selectTicketsToStart: 'Sélectionnez des billets pour commencer',
    edit: 'Modifier',
    subtotal: 'Sous-total',
    selectedTax: 'Taxe sélectionnée',
    serviceFee: 'Frais de service',
    totalIncTax: 'Total (taxes incl.)',
    
    // Details Screen
    yourDetailsTitle: 'Vos Détails',
    firstName: 'Prénom',
    lastName: 'Nom de famille',
    email: 'Adresse courriel',
    phoneNumber: 'Numéro de téléphone',
    postalCode: 'Code postal',
    newsletter: 'M\'envoyer des bulletins et mises à jour',
    continueButton: 'Continuer',
    
    // Checkout Screen
    processingPayment: 'Traitement du paiement...',
    cardReader: 'Lecteur de Carte',
    startOver: 'Recommencer',
    
    // Completion Screen
    completionMessage: 'Veuillez apporter le reçu au\nService à la clientèle et profitez\nde votre visite au THEMUSEUM.',
    emailBackup: 'Un reçu de sauvegarde a été\nenvoyé à votre courriel.',
    startNewPurchase: 'Nouvel Achat',
    
    // Language
    language: 'Langue',
    english: 'English',
    french: 'Français'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};