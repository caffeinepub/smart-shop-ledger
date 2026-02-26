import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePremiumStatus } from '../hooks/usePremiumStatus';
import CongratulationsAnimation from './CongratulationsAnimation';
import { Mail, X } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VALID_PROMO_CODES = ['987987', '789789'];
const VALID_PURCHASE_CODE = 'RUBELBOSS987';
const CONTACT_EMAIL = 'mdjahidhasanrubel73@gmail.com';

export default function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const { t } = useLanguage();
  const { checkAndEnforceExpiry } = usePremiumStatus();
  const [activeTab, setActiveTab] = useState<'promo' | 'purchase'>('promo');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [emailCopied, setEmailCopied] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [trialMessage, setTrialMessage] = useState('');

  if (!isOpen) return null;

  const trialUsed = localStorage.getItem('trialUsed') === 'true';

  const activatePremiumLocally = () => {
    localStorage.setItem('isPremium', 'true');
    localStorage.setItem('premiumActivatedAt', Date.now().toString());
    checkAndEnforceExpiry();
  };

  const handleActivate = () => {
    setError('');
    const trimmed = code.trim();

    if (activeTab === 'promo') {
      if (VALID_PROMO_CODES.includes(trimmed)) {
        activatePremiumLocally();
        setShowCongrats(true);
      } else {
        setError(t('invalidCode'));
      }
    } else {
      if (trimmed === VALID_PURCHASE_CODE) {
        activatePremiumLocally();
        setShowCongrats(true);
      } else {
        setError(t('invalidCode'));
      }
    }
  };

  const handleEmailClick = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch {
      // fallback
    }
    window.location.href = `mailto:${CONTACT_EMAIL}`;
  };

  const handleTrial = () => {
    if (trialUsed) {
      setTrialMessage(t('trialUsed'));
      return;
    }
    localStorage.setItem('trialUsed', 'true');
    localStorage.setItem('isPremium', 'true');
    localStorage.setItem('premiumActivatedAt', Date.now().toString());
    setTrialMessage(t('trialSuccess'));
    // Remove premium after 1 minute
    setTimeout(() => {
      localStorage.removeItem('isPremium');
      localStorage.removeItem('premiumActivatedAt');
    }, 60000);
    setTimeout(() => {
      onClose();
    }, 2000);
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

  if (showCongrats) {
    return (
      <CongratulationsAnimation
        onDismiss={() => {
          setShowCongrats(false);
          onClose();
        }}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl overflow-y-auto"
        style={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          maxHeight: '92vh',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👑</span>
            <h2 className="text-2xl font-bold" style={{ color: '#fbbf24' }}>
              {t('premiumModalTitle')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pb-6">
          {/* Subtitle */}
          <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {t('premiumModalSubtitle')}
          </p>

          {/* Feature list */}
          <div className="mb-4 space-y-2">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <span style={{ color: '#fbbf24', fontSize: '16px', fontWeight: 'bold' }}>✓</span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>{feature}</span>
              </div>
            ))}
          </div>

          {/* Info box */}
          <div
            className="rounded-xl p-3 mb-5 text-sm"
            style={{
              background: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.5,
            }}
          >
            {t('premiumInfoBox')}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => { setActiveTab('promo'); setError(''); setCode(''); }}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: activeTab === 'promo' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255,255,255,0.05)',
                border: activeTab === 'promo' ? '2px solid #fbbf24' : '2px solid rgba(255,255,255,0.1)',
                color: activeTab === 'promo' ? '#fbbf24' : 'rgba(255,255,255,0.6)',
              }}
            >
              {t('promoCodeTab')}
            </button>
            <button
              onClick={() => { setActiveTab('purchase'); setError(''); setCode(''); }}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: activeTab === 'purchase' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255,255,255,0.05)',
                border: activeTab === 'purchase' ? '2px solid #fbbf24' : '2px solid rgba(255,255,255,0.1)',
                color: activeTab === 'purchase' ? '#fbbf24' : 'rgba(255,255,255,0.6)',
              }}
            >
              {t('purchaseCodeTab')}
            </button>
          </div>

          {/* Code input */}
          <input
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(''); }}
            placeholder={t('enterCode')}
            className="w-full rounded-xl px-4 py-3 text-sm mb-3 outline-none"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
          />

          {/* Error */}
          {error && (
            <p className="text-sm mb-3 text-center" style={{ color: '#f87171' }}>{error}</p>
          )}

          {/* Activate button */}
          <button
            onClick={handleActivate}
            className="w-full py-4 rounded-xl text-base font-bold mb-4 transition-transform active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4)',
            }}
          >
            {t('activate')}
          </button>

          {/* Trial button */}
          <button
            onClick={handleTrial}
            disabled={trialUsed}
            className="w-full py-3 rounded-xl text-sm font-semibold mb-3 transition-all"
            style={{
              background: trialUsed ? 'rgba(255,255,255,0.05)' : 'rgba(34, 197, 94, 0.15)',
              border: trialUsed ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(34, 197, 94, 0.4)',
              color: trialUsed ? 'rgba(255,255,255,0.3)' : '#4ade80',
              cursor: trialUsed ? 'not-allowed' : 'pointer',
            }}
          >
            {trialUsed ? t('trialUsed') : t('trialButton')}
          </button>

          {/* Trial message */}
          {trialMessage && (
            <p className="text-sm mb-3 text-center" style={{ color: '#4ade80' }}>{trialMessage}</p>
          )}

          {/* Email contact */}
          <button
            onClick={handleEmailClick}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: emailCopied ? '#4ade80' : 'rgba(255,255,255,0.6)',
            }}
          >
            <Mail size={16} />
            <span>{emailCopied ? t('emailCopied') : t('contactEmail')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
