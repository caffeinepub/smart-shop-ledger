import React, { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePremiumStatus } from '../hooks/usePremiumStatus';
import {
  Sun, Moon, Globe, Bell, BellOff, Volume2, VolumeX,
  Crown, Info, Lock, Download, BarChart2, Music, Check, Upload
} from 'lucide-react';
import PremiumModal from '../components/PremiumModal';
import DeveloperInfoModal from '../components/DeveloperInfoModal';

const PREMIUM_THEMES = ['purple', 'orange', 'teal'];

export default function Settings() {
  const { t, language, setLanguage } = useLanguage();
  const { isDark, mode, toggleMode, color, setColor } = useTheme();
  const { isActive: isPremium } = usePremiumStatus();
  const isBn = language === 'bn';

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    try { return localStorage.getItem('notificationsEnabled') !== 'false'; } catch { return true; }
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try { return localStorage.getItem('soundEnabled') !== 'false'; } catch { return true; }
  });
  const [customSoundName, setCustomSoundName] = useState(() => {
    try { return localStorage.getItem('customSoundName') || ''; } catch { return ''; }
  });
  const soundInputRef = useRef<HTMLInputElement>(null);

  const themes = [
    { id: 'green', labelEn: 'Green', labelBn: 'সবুজ', color: '#22c55e' },
    { id: 'red', labelEn: 'Red', labelBn: 'লাল', color: '#ef4444' },
    { id: 'black', labelEn: 'Black', labelBn: 'কালো', color: '#374151' },
    { id: 'purple', labelEn: 'Purple', labelBn: 'বেগুনি', color: '#a855f7' },
    { id: 'orange', labelEn: 'Orange', labelBn: 'কমলা', color: '#f97316' },
    { id: 'teal', labelEn: 'Teal', labelBn: 'টিল', color: '#14b8a6' },
  ];

  const handleThemeClick = (themeId: string) => {
    if (PREMIUM_THEMES.includes(themeId) && !isPremium) {
      setShowPremiumModal(true);
      return;
    }
    setColor(themeId as any);
  };

  const handleNotificationToggle = () => {
    const next = !notificationsEnabled;
    setNotificationsEnabled(next);
    try { localStorage.setItem('notificationsEnabled', next ? 'true' : 'false'); } catch {}
  };

  const handleSoundToggle = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try { localStorage.setItem('soundEnabled', next ? 'true' : 'false'); } catch {}
  };

  const handleCustomSoundClick = () => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }
    soundInputRef.current?.click();
  };

  const handleSoundFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      try {
        localStorage.setItem('customSound', base64);
        localStorage.setItem('customSoundName', file.name);
        setCustomSoundName(file.name);
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  const handleDataExport = () => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }
    try {
      const sales = JSON.parse(localStorage.getItem('sales') || '[]');
      const rows = [
        ['Date', 'Product Name', 'Quantity', 'Unit', 'Selling Price', 'Buying Price', 'Profit'],
        ...sales.map((s: any) => [
          new Date(s.date).toLocaleDateString(),
          s.productName || '',
          s.quantity || '',
          s.unit || '',
          s.sellingPrice || 0,
          s.buyingPrice || 0,
          s.profit || 0,
        ])
      ];
      const csv = rows.map(r => r.map((v: any) => `"${v}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smart-shop-ledger-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <h2 className={`text-xs font-bold uppercase tracking-wider px-4 pt-5 pb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
      {title}
    </h2>
  );

  const SettingRow = ({
    icon,
    title,
    subtitle,
    right,
    onClick,
    locked,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
    onClick?: () => void;
    locked?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors ${
        isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
      } ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</p>
          {locked && <Lock size={12} className="text-amber-500" />}
          {locked && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">👑</span>}
        </div>
        {subtitle && <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{subtitle}</p>}
      </div>
      {right}
    </button>
  );

  return (
    <div className={`min-h-screen pb-24 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`px-4 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {isBn ? 'সেটিংস' : 'Settings'}
        </h1>
      </div>

      {/* Appearance */}
      <SectionHeader title={isBn ? 'চেহারা' : 'Appearance'} />
      <div className={`mx-4 rounded-2xl overflow-hidden border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <SettingRow
          icon={isDark ? <Moon size={18} className="text-blue-400" /> : <Sun size={18} className="text-amber-500" />}
          title={isBn ? 'ডার্ক মোড' : 'Dark Mode'}
          subtitle={isDark ? (isBn ? 'চালু' : 'On') : (isBn ? 'বন্ধ' : 'Off')}
          onClick={toggleMode}
          right={
            <div className={`w-11 h-6 rounded-full transition-colors ${isDark ? 'bg-amber-500' : 'bg-gray-300'} relative`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isDark ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          }
        />
      </div>

      {/* Color Themes */}
      <SectionHeader title={isBn ? 'কালার থিম' : 'Color Theme'} />
      <div className={`mx-4 rounded-2xl p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="grid grid-cols-3 gap-3">
          {themes.map(theme => {
            const isLocked = PREMIUM_THEMES.includes(theme.id) && !isPremium;
            const isSelected = color === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleThemeClick(theme.id)}
                className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50'
                    : isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-full shadow-sm"
                  style={{ backgroundColor: theme.color }}
                />
                <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {isBn ? theme.labelBn : theme.labelEn}
                </span>
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                    <Check size={10} className="text-white" />
                  </div>
                )}
                {isLocked && (
                  <div className="absolute inset-0 rounded-xl bg-black/20 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                      <Lock size={12} className="text-white" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Language */}
      <SectionHeader title={isBn ? 'ভাষা' : 'Language'} />
      <div className={`mx-4 rounded-2xl overflow-hidden border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex">
          <button
            onClick={() => setLanguage('bn')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              language === 'bn' ? 'bg-amber-500 text-white' : isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            বাংলা
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              language === 'en' ? 'bg-amber-500 text-white' : isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Sound & Notifications */}
      <SectionHeader title={isBn ? 'সাউন্ড ও নোটিফিকেশন' : 'Sound & Notifications'} />
      <div className={`mx-4 rounded-2xl overflow-hidden border divide-y ${isDark ? 'bg-gray-800 border-gray-700 divide-gray-700' : 'bg-white border-gray-200 divide-gray-100'}`}>
        <SettingRow
          icon={soundEnabled ? <Volume2 size={18} className="text-green-500" /> : <VolumeX size={18} className="text-gray-400" />}
          title={isBn ? 'সাউন্ড' : 'Sound'}
          subtitle={soundEnabled ? (isBn ? 'চালু' : 'On') : (isBn ? 'বন্ধ' : 'Off')}
          onClick={handleSoundToggle}
          right={
            <div className={`w-11 h-6 rounded-full transition-colors ${soundEnabled ? 'bg-green-500' : 'bg-gray-300'} relative`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${soundEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          }
        />
        <SettingRow
          icon={notificationsEnabled ? <Bell size={18} className="text-blue-500" /> : <BellOff size={18} className="text-gray-400" />}
          title={isBn ? 'নোটিফিকেশন' : 'Notifications'}
          subtitle={notificationsEnabled ? (isBn ? 'চালু' : 'On') : (isBn ? 'বন্ধ' : 'Off')}
          onClick={handleNotificationToggle}
          right={
            <div className={`w-11 h-6 rounded-full transition-colors ${notificationsEnabled ? 'bg-blue-500' : 'bg-gray-300'} relative`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          }
        />
        <SettingRow
          icon={<Music size={18} className={isPremium ? 'text-purple-500' : 'text-gray-400'} />}
          title={isBn ? 'কাস্টম সাউন্ড' : 'Custom Sound'}
          subtitle={customSoundName || (isBn ? 'নিজের সাউন্ড আপলোড করুন' : 'Upload your own sound')}
          onClick={handleCustomSoundClick}
          locked={!isPremium}
          right={<Upload size={16} className={isDark ? 'text-gray-500' : 'text-gray-400'} />}
        />
      </div>

      {/* Premium Features */}
      <SectionHeader title={isBn ? 'প্রিমিয়াম ফিচার' : 'Premium Features'} />
      <div className={`mx-4 rounded-2xl overflow-hidden border divide-y ${isDark ? 'bg-gray-800 border-gray-700 divide-gray-700' : 'bg-white border-gray-200 divide-gray-100'}`}>
        <SettingRow
          icon={<Download size={18} className={isPremium ? 'text-green-500' : 'text-gray-400'} />}
          title={isBn ? 'ডেটা এক্সপোর্ট' : 'Data Export'}
          subtitle={isBn ? 'CSV ফাইলে ডেটা ডাউনলোড করুন' : 'Download data as CSV file'}
          onClick={handleDataExport}
          locked={!isPremium}
          right={<Download size={16} className={isDark ? 'text-gray-500' : 'text-gray-400'} />}
        />
        <SettingRow
          icon={<Crown size={18} className="text-amber-500" />}
          title={isBn ? 'প্রিমিয়াম সাবস্ক্রিপশন' : 'Premium Subscription'}
          subtitle={isPremium ? (isBn ? 'সক্রিয়' : 'Active') : (isBn ? 'আনলক করুন' : 'Unlock now')}
          onClick={() => setShowPremiumModal(true)}
          right={
            isPremium
              ? <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold">✓ Active</span>
              : <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full font-bold">Upgrade</span>
          }
        />
      </div>

      {/* Advanced Statistics (Premium) */}
      <SectionHeader title={isBn ? 'অ্যাডভান্সড স্ট্যাটিস্টিক্স' : 'Advanced Statistics'} />
      <AdvancedStatistics isPremium={isPremium} isDark={isDark} isBn={isBn} onShowPremium={() => setShowPremiumModal(true)} />

      {/* Developer Info */}
      <SectionHeader title={isBn ? 'অ্যাপ সম্পর্কে' : 'About'} />
      <div className={`mx-4 rounded-2xl overflow-hidden border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <SettingRow
          icon={<Info size={18} className="text-blue-500" />}
          title={isBn ? 'ডেভেলপার তথ্য' : 'Developer Info'}
          subtitle={isBn ? 'অ্যাপ সম্পর্কে জানুন' : 'About this app'}
          onClick={() => setShowDevModal(true)}
        />
      </div>

      {/* Hidden file input */}
      <input
        ref={soundInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleSoundFileChange}
      />

      {/* Modals */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onActivate={() => setShowPremiumModal(false)}
      />
      <DeveloperInfoModal
        isOpen={showDevModal}
        onClose={() => setShowDevModal(false)}
        isDark={isDark}
        t={t}
      />
    </div>
  );
}

function AdvancedStatistics({
  isPremium,
  isDark,
  isBn,
  onShowPremium,
}: {
  isPremium: boolean;
  isDark: boolean;
  isBn: boolean;
  onShowPremium: () => void;
}) {
  const getSalesData = () => {
    try {
      return JSON.parse(localStorage.getItem('sales') || '[]');
    } catch {
      return [];
    }
  };

  if (!isPremium) {
    return (
      <div className="mx-4 relative">
        <div
          className={`rounded-2xl p-4 border blur-sm pointer-events-none ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-8 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
            ))}
          </div>
        </div>
        <button
          onClick={onShowPremium}
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/40"
        >
          <Lock size={24} className="text-amber-400 mb-2" />
          <span className="text-white font-bold text-sm">
            {isBn ? 'প্রিমিয়াম প্রয়োজন' : 'Premium Required'}
          </span>
          <span className="text-amber-300 text-xs mt-1">
            👑 {isBn ? 'আনলক করুন' : 'Unlock'}
          </span>
        </button>
      </div>
    );
  }

  const sales = getSalesData();
  const now = new Date();

  // Weekly profit
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weeklySales = sales.filter((s: any) => new Date(s.date) >= weekAgo);
  const weeklyProfit = weeklySales.reduce((sum: number, s: any) => sum + (s.profit || 0), 0);

  // Monthly profit
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const monthlySales = sales.filter((s: any) => new Date(s.date) >= monthAgo);
  const monthlyProfit = monthlySales.reduce((sum: number, s: any) => sum + (s.profit || 0), 0);

  // Top products
  const productMap: Record<string, number> = {};
  sales.forEach((s: any) => {
    if (s.productName) {
      productMap[s.productName] = (productMap[s.productName] || 0) + (s.quantity || 1);
    }
  });
  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Best day
  const dayMap: Record<string, number> = {};
  sales.forEach((s: any) => {
    const day = new Date(s.date).toLocaleDateString();
    dayMap[day] = (dayMap[day] || 0) + (s.profit || 0);
  });
  const bestDay = Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className={`mx-4 rounded-2xl p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`rounded-xl p-3 ${isDark ? 'bg-gray-700' : 'bg-green-50'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{isBn ? 'সাপ্তাহিক লাভ' : 'Weekly Profit'}</p>
          <p className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>৳{weeklyProfit.toFixed(0)}</p>
        </div>
        <div className={`rounded-xl p-3 ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{isBn ? 'মাসিক লাভ' : 'Monthly Profit'}</p>
          <p className={`text-lg font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>৳{monthlyProfit.toFixed(0)}</p>
        </div>
      </div>

      {topProducts.length > 0 && (
        <div className="mb-4">
          <p className={`text-xs font-bold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {isBn ? 'সেরা পণ্য' : 'Top Products'}
          </p>
          <div className="space-y-2">
            {topProducts.map(([name, qty], i) => (
              <div key={name} className="flex items-center gap-2">
                <span className={`text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                  i === 0 ? 'bg-amber-500 text-white' : isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                }`}>{i + 1}</span>
                <span className={`flex-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{name}</span>
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{qty} {isBn ? 'টি' : 'pcs'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {bestDay && (
        <div className={`rounded-xl p-3 ${isDark ? 'bg-gray-700' : 'bg-amber-50'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{isBn ? 'সেরা দিন' : 'Best Day'}</p>
          <p className={`text-sm font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{bestDay[0]}</p>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>৳{Number(bestDay[1]).toFixed(0)} {isBn ? 'লাভ' : 'profit'}</p>
        </div>
      )}
    </div>
  );
}
