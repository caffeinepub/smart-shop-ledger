import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePremiumStatus } from '../hooks/usePremiumStatus';
import PremiumModal from '../components/PremiumModal';
import DeveloperInfoModal from '../components/DeveloperInfoModal';
import { Crown, Sun, Moon, Volume2, Bell, Info, ChevronRight, Check } from 'lucide-react';

const CONTACT_EMAIL = 'mdjahidhasanrubel73@gmail.com';

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const { mode, toggleMode, accentColor, setAccentColor } = useTheme();
  const isDark = mode === 'dark';
  const { isActive, expiryDate } = usePremiumStatus();

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('soundEnabled') !== 'false');
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => localStorage.getItem('notificationsEnabled') !== 'false');
  const [offerCopied, setOfferCopied] = useState(false);

  const handleSoundToggle = () => {
    const newVal = !soundEnabled;
    setSoundEnabled(newVal);
    localStorage.setItem('soundEnabled', String(newVal));
  };

  const handleNotificationsToggle = () => {
    const newVal = !notificationsEnabled;
    setNotificationsEnabled(newVal);
    localStorage.setItem('notificationsEnabled', String(newVal));
  };

  const handleOfferClick = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setOfferCopied(true);
      setTimeout(() => setOfferCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const features = [
    t('featureUnlimitedProducts'),
    t('featureUnlimitedSales'),
    t('featureAdvancedReports'),
    t('featureDataBackup'),
    t('featurePrioritySupport'),
    t('featureCustomThemes'),
    t('featureDoToList'),
  ];

  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const textPrimary = isDark ? '#ffffff' : '#1a1a1a';
  const textSecondary = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)';

  const SectionCard = ({ children }: { children: React.ReactNode }) => (
    <div
      className="rounded-2xl overflow-hidden mb-4"
      style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {children}
    </div>
  );

  const RowDivider = () => (
    <div style={{ height: '1px', background: cardBorder, marginLeft: '16px' }} />
  );

  const ToggleSwitch = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className="relative w-12 h-6 rounded-full transition-colors duration-200"
      style={{ background: value ? '#22c55e' : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)') }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: value ? 'translateX(26px)' : 'translateX(2px)' }}
      />
    </button>
  );

  // Translate function for DeveloperInfoModal
  const tFn = (key: string): string => {
    return t(key as Parameters<typeof t>[0]) || key;
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: isDark ? '#0f172a' : '#f1f5f9' }}>
      <div className="px-4 pt-4 max-w-lg mx-auto">

        {/* Appearance */}
        <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: textSecondary }}>
          {t('appearance')}
        </p>
        <SectionCard>
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span style={{ color: '#22c55e' }}>
                {isDark ? <Moon size={18} /> : <Sun size={18} />}
              </span>
              <span className="text-sm font-medium" style={{ color: textPrimary }}>{t('darkMode')}</span>
            </div>
            <ToggleSwitch value={isDark} onToggle={toggleMode} />
          </div>
          <RowDivider />
          <div className="px-4 py-3">
            <p className="text-sm font-medium mb-2" style={{ color: textPrimary }}>{t('themeColor')}</p>
            <div className="flex gap-3">
              {(['green', 'red', 'blue', 'yellow', 'orange', 'dark'] as const).map((c) => {
                const colorMap: Record<string, string> = {
                  green: '#16a34a', red: '#dc2626', blue: '#2563eb',
                  yellow: '#ca8a04', orange: '#ea580c', dark: '#1a1a1a',
                };
                return (
                  <button
                    key={c}
                    onClick={() => setAccentColor(c)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90"
                    style={{
                      background: colorMap[c],
                      border: accentColor === c ? '3px solid #fbbf24' : '3px solid transparent',
                      transform: accentColor === c ? 'scale(1.15)' : 'scale(1)',
                    }}
                  >
                    {accentColor === c && <Check size={12} color="#fff" />}
                  </button>
                );
              })}
            </div>
          </div>
        </SectionCard>

        {/* Language */}
        <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: textSecondary }}>
          {t('language')}
        </p>
        <SectionCard>
          <div className="px-4 py-3">
            <div className="flex gap-2">
              {(['en', 'bn'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: language === lang ? '#22c55e' : (isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9'),
                    color: language === lang ? '#fff' : textSecondary,
                    border: language === lang ? '2px solid #16a34a' : `2px solid ${cardBorder}`,
                  }}
                >
                  {lang === 'en' ? t('english') : t('bengali')}
                </button>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Sound */}
        <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: textSecondary }}>
          {t('sound')}
        </p>
        <SectionCard>
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <Volume2 size={18} color="#22c55e" />
              <span className="text-sm font-medium" style={{ color: textPrimary }}>{t('clickSound')}</span>
            </div>
            <ToggleSwitch value={soundEnabled} onToggle={handleSoundToggle} />
          </div>
        </SectionCard>

        {/* Notifications */}
        <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: textSecondary }}>
          {t('notifications')}
        </p>
        <SectionCard>
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <Bell size={18} color="#22c55e" />
              <span className="text-sm font-medium" style={{ color: textPrimary }}>{t('enableNotifications')}</span>
            </div>
            <ToggleSwitch value={notificationsEnabled} onToggle={handleNotificationsToggle} />
          </div>
        </SectionCard>

        {/* Premium Section */}
        <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: textSecondary }}>
          {t('premium')}
        </p>

        {isActive ? (
          /* Premium Active Card */
          <div
            className="rounded-2xl p-5 mb-4"
            style={{
              background: 'linear-gradient(135deg, #14532d, #166534)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              boxShadow: '0 4px 20px rgba(34, 197, 94, 0.2)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Crown size={24} color="#fbbf24" />
              <span className="text-lg font-bold text-white">{t('premiumActive')}</span>
            </div>
            {expiryDate && (
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {t('premiumExpiry')}: {expiryDate.toLocaleDateString()}
              </p>
            )}
          </div>
        ) : (
          /* Premium Inactive Card - matches screenshot */
          <div
            className="rounded-2xl overflow-hidden mb-4"
            style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5e8',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.08)',
            }}
          >
            <div className="p-5">
              {/* Header row */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Crown size={22} color="#16a34a" />
                  <span className="text-xl font-bold" style={{ color: '#16a34a' }}>{t('premiumTitle')}</span>
                </div>
                {/* Offer tag - replaces Buy button */}
                <button
                  onClick={handleOfferClick}
                  className="px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
                  style={{
                    background: offerCopied
                      ? 'linear-gradient(135deg, #16a34a, #15803d)'
                      : 'linear-gradient(135deg, #f97316, #ea580c)',
                    color: '#fff',
                    boxShadow: offerCopied
                      ? '0 2px 8px rgba(22, 163, 74, 0.4)'
                      : '0 2px 8px rgba(249, 115, 22, 0.4)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {offerCopied ? '✅ Copied!' : t('premiumOfferTag')}
                </button>
              </div>

              {/* Subtitle */}
              <p className="text-sm mb-2" style={{ color: textSecondary }}>{t('premiumSubtitle')}</p>

              {/* Free/Premium limit */}
              <p className="text-xs font-semibold mb-4" style={{ color: '#16a34a' }}>
                {t('freeSalesLimit')}
              </p>

              {/* Feature list */}
              <div className="space-y-2 mb-5">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '14px' }}>✓</span>
                    <span className="text-sm" style={{ color: textPrimary }}>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Get Premium button */}
              <button
                onClick={() => setShowPremiumModal(true)}
                className="w-full py-4 rounded-xl text-base font-bold transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #16a34a, #15803d)',
                  color: '#fff',
                  boxShadow: '0 4px 16px rgba(22, 163, 74, 0.35)',
                }}
              >
                {t('getPremium')}
              </button>
            </div>
          </div>
        )}

        {/* Developer Info */}
        <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: textSecondary }}>
          {t('developerInfo')}
        </p>
        <SectionCard>
          <div
            className="flex items-center justify-between px-4 py-3.5 cursor-pointer active:opacity-70"
            onClick={() => setShowDevModal(true)}
          >
            <div className="flex items-center gap-3">
              <Info size={18} color="#22c55e" />
              <span className="text-sm font-medium" style={{ color: textPrimary }}>{t('developerInfo')}</span>
            </div>
            <ChevronRight size={16} color={textSecondary} />
          </div>
        </SectionCard>

      </div>

      {/* Modals */}
      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
      <DeveloperInfoModal
        isOpen={showDevModal}
        onClose={() => setShowDevModal(false)}
        isDark={isDark}
        t={tFn}
      />
    </div>
  );
}
