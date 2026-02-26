import React, { createContext, useContext, useState } from 'react';
import { Home, PlusCircle, History, User, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import AdBanner from './AdBanner';

interface LayoutContextType {
  hideBottomNav: boolean;
  setHideBottomNav: (hide: boolean) => void;
}

export const LayoutContext = createContext<LayoutContextType>({
  hideBottomNav: false,
  setHideBottomNav: () => {},
});

export function useLayoutContext() {
  return useContext(LayoutContext);
}

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'home',     label: 'Home',     labelBn: 'হোম',      icon: Home },
  { id: 'add-sale', label: 'Add Sale', labelBn: 'বিক্রয়',   icon: PlusCircle },
  { id: 'history',  label: 'History',  labelBn: 'ইতিহাস',   icon: History },
  { id: 'profile',  label: 'Profile',  labelBn: 'প্রোফাইল', icon: User },
  { id: 'settings', label: 'Settings', labelBn: 'সেটিংস',   icon: Settings },
];

// Nav bar height in px (used to offset ad banner and main content)
const NAV_HEIGHT = 64;
const AD_HEIGHT = 56;

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [hideBottomNav, setHideBottomNav] = useState(false);
  const { mode } = useTheme();

  const isPremium = (() => {
    try { return localStorage.getItem('isPremium') === 'true'; } catch { return false; }
  })();

  const lang = (() => {
    try { return localStorage.getItem('language') || 'en'; } catch { return 'en'; }
  })();

  // App name based on language
  const appName = lang === 'bn' ? 'স্মার্ট শপ লেজার' : 'SMART SHOP LEDGER';

  // Bottom padding for main content: nav + optional ad
  const mainPaddingBottom = hideBottomNav
    ? (isPremium ? 0 : AD_HEIGHT)
    : (isPremium ? NAV_HEIGHT : NAV_HEIGHT + AD_HEIGHT);

  return (
    <LayoutContext.Provider value={{ hideBottomNav, setHideBottomNav }}>
      <div className="flex flex-col min-h-screen bg-app">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-header shadow-md">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/app-logo.dim_80x80.png"
                alt="Logo"
                className="w-10 h-10 rounded-xl object-contain"
              />
              <div>
                <h1 className="text-white font-bold text-lg leading-tight tracking-wide">
                  {appName}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Bangladesh flag accent */}
              <div className="flex gap-1">
                <div className="w-2 h-6 rounded-sm" style={{ backgroundColor: 'oklch(0.55 0.22 145)' }} />
                <div className="w-2 h-6 rounded-sm" style={{ backgroundColor: 'oklch(0.55 0.22 25)' }} />
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ paddingBottom: `${mainPaddingBottom}px` }}
        >
          {children}
        </main>

        {/* Ad Banner for non-premium users — sits just above the bottom nav */}
        {!isPremium && !hideBottomNav && (
          <div
            className="fixed left-0 right-0 z-40"
            style={{ bottom: `${NAV_HEIGHT}px` }}
          >
            <AdBanner />
          </div>
        )}

        {/* Bottom Navigation — always at the very bottom */}
        {!hideBottomNav && (
          <nav
            className="fixed bottom-0 left-0 right-0 z-50 border-t"
            style={{
              backgroundColor: 'var(--nav-bg)',
              borderColor: 'var(--nav-border)',
              height: `${NAV_HEIGHT}px`,
            }}
          >
            <div className="flex items-center justify-around px-2 h-full">
              {navItems.map(({ id, label, labelBn, icon: Icon }) => {
                const isActive = currentPage === id || (id === 'home' && currentPage === '');
                return (
                  <button
                    key={id}
                    onClick={() => onNavigate(id)}
                    className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all min-w-0"
                    style={{
                      color: isActive ? 'var(--accent-primary)' : 'var(--muted-foreground)',
                    }}
                  >
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                    <span className="text-xs font-medium truncate" style={{ fontSize: '10px' }}>
                      {lang === 'bn' ? labelBn : label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </LayoutContext.Provider>
  );
}
