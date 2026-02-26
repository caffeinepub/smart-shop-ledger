import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme, AccentColor } from '../contexts/ThemeContext';
import { Moon, Sun, Globe, Volume2, Bell, Crown, ExternalLink, Upload, Info } from 'lucide-react';
import PremiumModal from '../components/PremiumModal';
import DeveloperInfoModal from '../components/DeveloperInfoModal';
import { playClickSound } from '../hooks/useClickSound';

const Settings: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { mode, toggleMode, accentColor, setAccentColor } = useTheme();
  const isDark = mode === 'dark';
  const isBn = language === 'bn';

  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('soundEnabled') !== 'false';
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('notificationsEnabled') !== 'false';
  });
  const [showPremium, setShowPremium] = useState(false);
  const [showDevInfo, setShowDevInfo] = useState(false);

  const toggleSound = () => {
    const newVal = !soundEnabled;
    setSoundEnabled(newVal);
    localStorage.setItem('soundEnabled', String(newVal));
  };

  const toggleNotifications = () => {
    const newVal = !notificationsEnabled;
    setNotificationsEnabled(newVal);
    localStorage.setItem('notificationsEnabled', String(newVal));
  };

  const handleSoundTest = () => {
    playClickSound();
  };

  const handleUploadSound = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        localStorage.setItem('customClickSound', base64);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const accentColors: { key: AccentColor; label: string; color: string }[] = [
    { key: 'green', label: isBn ? 'সবুজ' : 'Green', color: 'bg-green-500' },
    { key: 'red', label: isBn ? 'লাল' : 'Red', color: 'bg-red-500' },
    { key: 'blue', label: isBn ? 'নীল' : 'Blue', color: 'bg-blue-500' },
    { key: 'yellow', label: isBn ? 'হলুদ' : 'Yellow', color: 'bg-yellow-500' },
    { key: 'orange', label: isBn ? 'কমলা' : 'Orange', color: 'bg-orange-500' },
    { key: 'dark', label: isBn ? 'কালো' : 'Dark', color: 'bg-gray-800' },
  ];

  // Translate function for DeveloperInfoModal
  const tFn = (key: string): string => {
    return t(key as Parameters<typeof t>[0]) || key;
  };

  return (
    <div className="min-h-screen bg-gray-950 pb-8">
      <div className="px-4 pt-4">
        <h1 className="text-xl font-bold text-white mb-5">
          {isBn ? 'সেটিংস' : 'Settings'}
        </h1>

        {/* Appearance */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            {isDark
              ? <Moon size={16} className="text-blue-400" />
              : <Sun size={16} className="text-yellow-400" />}
            {isBn ? 'চেহারা' : 'Appearance'}
          </h2>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-300 text-sm">{isBn ? 'ডার্ক মোড' : 'Dark Mode'}</span>
            <button
              onClick={toggleMode}
              className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-green-600' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${isDark ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-2">{isBn ? 'অ্যাকসেন্ট রঙ' : 'Accent Color'}</p>
            <div className="flex gap-2 flex-wrap">
              {accentColors.map(ac => (
                <button
                  key={ac.key}
                  onClick={() => setAccentColor(ac.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                    accentColor === ac.key ? 'border-white text-white' : 'border-gray-700 text-gray-400'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${ac.color}`} />
                  {ac.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Globe size={16} className="text-green-400" />
            {isBn ? 'ভাষা' : 'Language'}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setLanguage('bn')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                language === 'bn' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                language === 'en' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Sound */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Volume2 size={16} className="text-green-400" />
            {isBn ? 'সাউন্ড' : 'Sound'}
          </h2>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-300 text-sm">{isBn ? 'সাউন্ড চালু' : 'Enable Sound'}</span>
            <button
              onClick={toggleSound}
              className={`w-12 h-6 rounded-full transition-colors relative ${soundEnabled ? 'bg-green-600' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSoundTest}
              className="flex-1 bg-gray-800 text-gray-300 rounded-xl py-2 text-sm hover:bg-gray-700"
            >
              {isBn ? 'সাউন্ড টেস্ট' : 'Sound Test'}
            </button>
            <button
              onClick={handleUploadSound}
              className="flex items-center gap-1.5 bg-gray-800 text-gray-300 rounded-xl px-3 py-2 text-sm hover:bg-gray-700"
            >
              <Upload size={14} />
              {isBn ? 'আপলোড' : 'Upload'}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {isBn
              ? 'ডিফল্ট ক্লিক সাউন্ড প্রতিস্থাপন করতে নিজের অডিও ফাইল আপলোড করুন'
              : 'Upload your own audio file to replace the default click sound'}
          </p>
        </div>

        {/* Notifications */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Bell size={16} className="text-green-400" />
            {isBn ? 'নোটিফিকেশন' : 'Notifications'}
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">
              {isBn ? 'নোটিফিকেশন চালু' : 'Enable Notifications'}
            </span>
            <button
              onClick={toggleNotifications}
              className={`w-12 h-6 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-green-600' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Premium */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Crown size={16} className="text-yellow-400" />
            {isBn ? 'প্রিমিয়াম' : 'Premium'}
          </h2>
          <button
            onClick={() => setShowPremium(true)}
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-3 rounded-xl hover:from-yellow-500 hover:to-yellow-400 transition-all"
          >
            👑 {isBn ? 'প্রিমিয়াম আপগ্রেড করুন' : 'Upgrade to Premium'}
          </button>
        </div>

        {/* Developer Info / Facebook */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Info size={16} className="text-green-400" />
            {isBn ? 'ডেভেলপার তথ্য' : 'Developer Info'}
          </h2>
          <button
            onClick={() => setShowDevInfo(true)}
            className="w-full bg-gray-800 text-gray-300 rounded-xl py-2.5 text-sm hover:bg-gray-700 mb-3"
          >
            {isBn ? 'অ্যাপ তথ্য' : 'App Info'}
          </button>
          <a
            href="https://fb.openinapp.co/khncs"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            <ExternalLink size={16} />
            Facebook Page
          </a>
        </div>

        {/* Footer */}
        <footer className="pt-4 pb-2 text-center">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Smart Shop Ledger · Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>

      {showPremium && (
        <PremiumModal
          onClose={() => setShowPremium(false)}
          onActivate={() => setShowPremium(false)}
        />
      )}
      {showDevInfo && (
        <DeveloperInfoModal
          isOpen={showDevInfo}
          onClose={() => setShowDevInfo(false)}
          isDark={isDark}
          t={tFn}
        />
      )}
    </div>
  );
};

export default Settings;
