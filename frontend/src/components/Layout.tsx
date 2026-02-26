import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePremiumStatus } from '../hooks/usePremiumStatus';
import { Home, History, ShoppingBag, List, User, Settings, Lock } from 'lucide-react';
import AdBanner from './AdBanner';
import PremiumModal from './PremiumModal';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { t, language } = useLanguage();
  const { isDark } = useTheme();
  const { isActive: isPremium } = usePremiumStatus();
  const isBn = language === 'bn';
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const navItems = [
    { id: 'home', icon: Home, labelEn: 'Home', labelBn: 'হোম', premium: false },
    { id: 'history', icon: History, labelEn: 'History', labelBn: 'ইতিহাস', premium: false },
    { id: 'products', icon: ShoppingBag, labelEn: 'Products', labelBn: 'পণ্য', premium: true },
    { id: 'lists', icon: List, labelEn: 'Lists', labelBn: 'তালিকা', premium: true },
    { id: 'profile', icon: User, labelEn: 'Profile', labelBn: 'প্রোফাইল', premium: false },
    { id: 'settings', icon: Settings, labelEn: 'Settings', labelBn: 'সেটিংস', premium: false },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.premium && !isPremium) {
      setShowPremiumModal(true);
      return;
    }
    onNavigate(item.id);
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-30 flex items-center justify-between px-4 py-3 shadow-md ${isDark ? 'bg-gray-800' : 'bg-gray-900'}`}>
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/app-logo.dim_80x80.png"
            alt="logo"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div>
            <h1 className="text-white font-bold text-base leading-tight">
              {isBn ? 'স্মার্ট শপ লেজার' : 'SMART SHOP LEDGER'}
            </h1>
          </div>
        </div>
        {isPremium && (
          <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">
            👑 {isBn ? 'প্রিমিয়াম' : 'Premium'}
          </span>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-32">
        {children}
      </main>

      {/* Ad Banner for non-premium users */}
      {!isPremium && (
        <div className="fixed bottom-16 left-0 right-0 z-20">
          <AdBanner />
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 z-30 border-t ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
        <div className="flex items-center justify-around px-1 py-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const isLocked = item.premium && !isPremium;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`relative flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all min-w-0 flex-1 ${
                  isActive
                    ? 'text-amber-500'
                    : isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                <div className="relative">
                  <Icon size={20} />
                  {isLocked && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 flex items-center justify-center">
                      <Lock size={8} className="text-white" />
                    </div>
                  )}
                </div>
                <span className="text-xs truncate w-full text-center leading-tight">
                  {isBn ? item.labelBn : item.labelEn}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-amber-500" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onActivate={() => setShowPremiumModal(false)}
      />
    </div>
  );
}
