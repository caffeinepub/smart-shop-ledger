import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '../locales/translations';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  console.log('[LanguageProvider] Initializing at', new Date().toISOString());

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'bn')) {
        console.log('[LanguageProvider] Loaded language from localStorage:', savedLanguage);
        return savedLanguage;
      }
      console.log('[LanguageProvider] Using default language: en');
      return 'en';
    } catch (error) {
      console.error('[LanguageProvider] Failed to load language from localStorage:', error);
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    console.log('[LanguageProvider] Setting language to:', lang);
    if (lang !== 'en' && lang !== 'bn') {
      console.warn('[LanguageProvider] Invalid language value:', lang);
      return;
    }
    setLanguageState(lang);
    try {
      localStorage.setItem('language', lang);
    } catch (error) {
      console.error('[LanguageProvider] Failed to save language to localStorage:', error);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
