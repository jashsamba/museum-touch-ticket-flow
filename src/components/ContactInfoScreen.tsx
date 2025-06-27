
import React, { useState, useEffect } from 'react';
import { Mail, MapPin } from 'lucide-react';
import { ContactInfo } from './KioskInterface';

interface ContactInfoScreenProps {
  onSubmit: (info: ContactInfo) => void;
  initialData: ContactInfo;
}

const ContactInfoScreen: React.FC<ContactInfoScreenProps> = ({
  onSubmit,
  initialData
}) => {
  const [email, setEmail] = useState(initialData.email);
  const [postalCode, setPostalCode] = useState(initialData.postalCode);
  const [isValid, setIsValid] = useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Canadian postal code regex (flexible format)
  const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][\s-]?\d[A-Za-z]\d$/;

  useEffect(() => {
    const emailValid = emailRegex.test(email);
    const postalValid = postalCodeRegex.test(postalCode);
    setIsValid(emailValid && postalValid);
  }, [email, postalCode]);

  const handleSubmit = () => {
    if (isValid) {
      onSubmit({ email, postalCode: postalCode.toUpperCase() });
    }
  };

  return (
    <div className="screen-container">
      <div className="screen-header">
        <h1 className="screen-title">Almost Done – Please Enter Your Contact Info</h1>
        <p className="screen-subtitle">We'll send your ticket confirmation to your email</p>
      </div>

      <div className="contact-form">
        <div className="input-group">
          <label className="input-label">
            <Mail className="input-icon" size={24} />
            Email Address
          </label>
          <input
            type="email"
            className="kiosk-input"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="input-group">
          <label className="input-label">
            <MapPin className="input-icon" size={24} />
            Postal Code
          </label>
          <input
            type="text"
            className="kiosk-input"
            placeholder="N2G 1A3"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            maxLength={7}
            autoComplete="postal-code"
          />
        </div>
      </div>

      <div className="screen-footer">
        <button 
          className={`submit-button ${isValid ? 'active' : 'disabled'}`}
          onClick={handleSubmit}
          disabled={!isValid}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ContactInfoScreen;
