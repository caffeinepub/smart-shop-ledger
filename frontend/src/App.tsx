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

type Page = 'home' | 'add-sale' | 'history' | 'profile' | 'settings';

function App() {
  console.log('[App] Component mounting at', new Date().toISOString());

  const [showSplash, setShowSplash] = useState(() => {
    try {
      const saved = localStorage.getItem('showSplash');
      return saved ? JSON.parse(saved) : true;
    } catch (error) {
      console.warn('[App] Failed to load showSplash from localStorage:', error);
      return true;
    }
  });

  const [showRegistration, setShowRegistration] = useState(() => {
    try {
      const shopData = localStorage.getItem('shop_profile');
      return !shopData;
    } catch (error) {
      console.warn('[App] Failed to check shop_profile in localStorage:', error);
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
    } catch (error) {
      console.warn('[App] Failed to load currentPage from localStorage:', error);
      return 'home';
    }
  });

  console.log('[App] Initial state:', { showSplash, showRegistration, currentPage });

  const handleSplashComplete = useCallback(() => {
    console.log('[App] Splash complete at', new Date().toISOString());
    setShowSplash(false);
    try {
      localStorage.setItem('showSplash', 'false');
      const shopData = localStorage.getItem('shop_profile');
      if (!shopData) {
        console.log('[App] No shop profile found, showing registration');
        setShowRegistration(true);
      }
    } catch (error) {
      console.error('[App] Error in handleSplashComplete:', error);
    }
  }, []);

  const handleRegistrationComplete = useCallback(() => {
    console.log('[App] Registration complete at', new Date().toISOString());
    setShowRegistration(false);
  }, []);

  const handleRegistrationSkip = useCallback(() => {
    console.log('[App] Registration skipped at', new Date().toISOString());
    setShowRegistration(false);
  }, []);

  const handleNavigate = useCallback((page: Page) => {
    console.log('[App] Navigating to', page, 'at', new Date().toISOString());
    setCurrentPage(page);
    try {
      localStorage.setItem('currentPage', page);
    } catch (error) {
      console.error('[App] Failed to save currentPage to localStorage:', error);
    }
  }, []);

  if (showSplash) {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <SplashScreen onComplete={handleSplashComplete} />
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen">
          <Toaster position="top-center" richColors />
          
          <RegistrationModal 
            open={showRegistration}
            onComplete={handleRegistrationComplete}
            onSkip={handleRegistrationSkip}
          />

          <Layout currentPage={currentPage} onNavigate={handleNavigate}>
            {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
            {currentPage === 'add-sale' && <AddSale onNavigate={handleNavigate} />}
            {currentPage === 'history' && <History onNavigate={handleNavigate} />}
            {currentPage === 'profile' && <Profile onNavigate={handleNavigate} />}
            {currentPage === 'settings' && <Settings />}
          </Layout>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
