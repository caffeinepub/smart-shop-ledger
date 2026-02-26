import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import RegistrationModal from './components/RegistrationModal';
import InterstitialAdScreen from './components/InterstitialAdScreen';
import Layout from './components/Layout';
import Home from './pages/Home';
import AddSale from './pages/AddSale';
import History from './pages/History';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ProductList from './pages/ProductList';
import Lists from './pages/Lists';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { usePremiumStatus } from './hooks/usePremiumStatus';
import { playClickSound } from './hooks/useClickSound';

type Page = 'home' | 'add-sale' | 'history' | 'profile' | 'settings' | 'products' | 'lists';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { checkAndEnforceExpiry } = usePremiumStatus();

  useEffect(() => {
    checkAndEnforceExpiry();
  }, [checkAndEnforceExpiry]);

  // Global click sound listener — fires on any button/interactive element except text inputs
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      const clickable = target.closest('button, [role="button"], a, select, label');
      if (clickable) {
        playClickSound();
      }
    };
    document.addEventListener('click', handleGlobalClick, true);
    return () => document.removeEventListener('click', handleGlobalClick, true);
  }, []);

  // Listen for custom navigate events dispatched from child components
  useEffect(() => {
    const handleCustomNavigate = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      if (detail) setCurrentPage(detail as Page);
    };
    window.addEventListener('navigate', handleCustomNavigate);
    return () => window.removeEventListener('navigate', handleCustomNavigate);
  }, []);

  const handleSplashComplete = () => {
    const registrationComplete = localStorage.getItem('registrationComplete');
    if (!registrationComplete) {
      setShowSplash(false);
      setShowRegistration(true);
    } else {
      const interstitialShown = sessionStorage.getItem('interstitialShown');
      if (!interstitialShown) {
        setShowSplash(false);
        setShowInterstitial(true);
      } else {
        setShowSplash(false);
      }
    }
  };

  const handleRegistrationComplete = () => {
    setShowRegistration(false);
    const interstitialShown = sessionStorage.getItem('interstitialShown');
    if (!interstitialShown) {
      setShowInterstitial(true);
    }
  };

  const handleRegistrationSkip = () => {
    setShowRegistration(false);
    const interstitialShown = sessionStorage.getItem('interstitialShown');
    if (!interstitialShown) {
      setShowInterstitial(true);
    }
  };

  const handleInterstitialComplete = () => {
    sessionStorage.setItem('interstitialShown', 'true');
    setShowInterstitial(false);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (showRegistration) {
    return (
      <RegistrationModal
        onComplete={handleRegistrationComplete}
        onSkip={handleRegistrationSkip}
      />
    );
  }

  if (showInterstitial) {
    return <InterstitialAdScreen onComplete={handleInterstitialComplete} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':     return <Home />;
      case 'add-sale': return <AddSale />;
      case 'history':  return <History />;
      case 'profile':  return <Profile />;
      case 'settings': return <Settings />;
      case 'products': return <ProductList />;
      case 'lists':    return <Lists />;
      default:         return <Home />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
