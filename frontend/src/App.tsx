import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Toaster } from '@/components/ui/sonner';
import SplashScreen from './components/SplashScreen';
import RegistrationModal from './components/RegistrationModal';
import Layout from './components/Layout';
import Home from './pages/Home';
import AddSale from './pages/AddSale';
import History from './pages/History';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ProductList from './pages/ProductList';
import { useClickSound } from './hooks/useClickSound';

type Page = 'home' | 'add-sale' | 'history' | 'profile' | 'settings' | 'product-list';

function AppContent() {
  const { playSound } = useClickSound();

  // Clear stale timer localStorage keys on startup
  useEffect(() => {
    try {
      localStorage.removeItem('timerEnabled');
      localStorage.removeItem('currentTimer');
      localStorage.removeItem('timerNotification');
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.closest('input') ||
        target.closest('textarea')
      ) {
        return;
      }
      playSound();
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [playSound]);

  // Always show splash on every app load
  const [showSplash, setShowSplash] = useState(true);

  const [showRegistration, setShowRegistration] = useState(() => {
    try {
      const shopData = localStorage.getItem('shop_profile');
      return !shopData;
    } catch {
      return false;
    }
  });

  const [currentPage, setCurrentPage] = useState<Page>(() => {
    try {
      const saved = localStorage.getItem('currentPage');
      const page = saved as Page;
      if (page && ['home', 'add-sale', 'history', 'profile', 'settings'].includes(page)) {
        return page;
      }
      return 'home';
    } catch {
      return 'home';
    }
  });

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    try {
      const shopData = localStorage.getItem('shop_profile');
      if (!shopData) {
        setShowRegistration(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleRegistrationComplete = useCallback(() => {
    setShowRegistration(false);
  }, []);

  const handleRegistrationSkip = useCallback(() => {
    setShowRegistration(false);
  }, []);

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
    try {
      if (page !== 'product-list') {
        localStorage.setItem('currentPage', page);
      }
    } catch {
      // ignore
    }
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  const isSubPage = currentPage === 'product-list';

  return (
    <div className="min-h-screen">
      <Toaster position="top-center" richColors />
      
      <RegistrationModal 
        open={showRegistration}
        onComplete={handleRegistrationComplete}
        onSkip={handleRegistrationSkip}
      />

      {isSubPage ? (
        <ProductList onNavigate={handleNavigate} />
      ) : (
        <Layout currentPage={currentPage} onNavigate={handleNavigate}>
          {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
          {currentPage === 'add-sale' && <AddSale onNavigate={handleNavigate} />}
          {currentPage === 'history' && <History onNavigate={handleNavigate} />}
          {currentPage === 'profile' && <Profile onNavigate={handleNavigate} />}
          {currentPage === 'settings' && <Settings />}
        </Layout>
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
