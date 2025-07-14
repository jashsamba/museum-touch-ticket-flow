import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const {
    language,
    setLanguage,
    t
  } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    {
      code: 'en' as Language,
      flag: '🇬🇧',
      name: t('english')
    },
    {
      code: 'fr' as Language,
      flag: '🇫🇷',
      name: t('french')
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setIsOpen(false);
  };

  return (
    <div className="language-selector-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="language-selector mx-[4px] mt-[-6px] py-[5px] px-[5px]"
      >
        <span className="language-flag">{currentLanguage?.flag}</span>
        <span className="language-code">{currentLanguage?.code.toUpperCase()}</span>
        <ChevronDown size={16} className={`chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`language-option ${language === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
