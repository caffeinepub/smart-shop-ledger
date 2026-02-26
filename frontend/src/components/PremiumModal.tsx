import React, { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePremiumStatus } from '../hooks/usePremiumStatus';
import { Crown, X, Copy, Check, Mail } from 'lucide-react';
import { playBubblePop, playBell } from '../utils/sounds';
import CongratulationsAnimation from './CongratulationsAnimation';

interface PremiumModalProps {
  onClose: () => void;
  onActivate?: () => void;
}

const OWNER_EMAIL = 'smartshopled@gmail.com';

const PLANS = [
  {
    id: 'monthly',
    nameEn: 'Monthly',
    nameBn: 'মাসিক',
    price: '৳199',
    duration: '1 মাস',
    features: ['সীমাহীন বিক্রয়', 'ক্যামেরা ফিচার', 'প্রিমিয়াম সাপোর্ট'],
    popular: false,
  },
  {
    id: 'yearly',
    nameEn: 'Yearly',
    nameBn: 'বার্ষিক',
    price: '৳999',
    duration: '1 বছর',
    features: ['সীমাহীন বিক্রয়', 'ক্যামেরা ফিচার', 'প্রিমিয়াম সাপোর্ট', 'সর্বোচ্চ সাশ্রয়'],
    popular: true,
  },
  {
    id: 'lifetime',
    nameEn: 'Lifetime',
    nameBn: 'আজীবন',
    price: '৳1999',
    duration: 'আজীবন',
    features: ['সীমাহীন বিক্রয়', 'ক্যামেরা ফিচার', 'প্রিমিয়াম সাপোর্ট', 'সব আপডেট বিনামূল্যে'],
    popular: false,
  },
];

interface Bubble {
  id: number;
  x: number;
  size: number;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, onActivate }) => {
  const { language } = useLanguage();
  const { isActive, expiryDate } = usePremiumStatus();
  const [activeTab, setActiveTab] = useState<'promo' | 'purchase'>('purchase');
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showEmailFor, setShowEmailFor] = useState<string | null>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const bubbleIdRef = useRef(0);

  const isBn = language === 'bn';

  const triggerBubbles = () => {
    playBubblePop();
    const newBubbles: Bubble[] = Array.from({ length: 8 }, () => ({
      id: bubbleIdRef.current++,
      x: Math.random() * 80 + 10,
      size: Math.random() * 16 + 8,
    }));
    setBubbles(prev => [...prev, ...newBubbles]);
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => !newBubbles.find(nb => nb.id === b.id)));
    }, 1500);
  };

  const handleBuyClick = (planId: string) => {
    triggerBubbles();
    setShowEmailFor(showEmailFor === planId ? null : planId);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(OWNER_EMAIL);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  };

  const handlePromoSubmit = () => {
    const validCodes = ['PREMIUM2024', 'SMARTSHOP', 'JAHID2024', '987987', '789789', 'RUBELBOSS987'];
    if (validCodes.includes(promoCode.trim().toUpperCase()) || validCodes.includes(promoCode.trim())) {
      localStorage.setItem('isPremium', 'true');
      localStorage.setItem('premiumActivatedAt', Date.now().toString());
      setPromoSuccess(true);
      setPromoError('');
      playBell();
      setTimeout(() => {
        setShowCongrats(true);
      }, 300);
    } else {
      setPromoError(isBn ? 'অবৈধ কোড। আবার চেষ্টা করুন।' : 'Invalid code. Please try again.');
    }
  };

  const handleCongratsClose = () => {
    setShowCongrats(false);
    onActivate?.();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md bg-gray-900 rounded-t-3xl sm:rounded-3xl border border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Bubble animation container */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {bubbles.map(b => (
              <div
                key={b.id}
                className="absolute bottom-0 rounded-full bg-yellow-400/30 border border-yellow-400/50 animate-bubble-float"
                style={{
                  left: `${b.x}%`,
                  width: b.size,
                  height: b.size,
                }}
              />
            ))}
          </div>

          {/* Header */}
          <div className="relative bg-gradient-to-r from-yellow-700 to-yellow-600 px-5 py-5">
            <button onClick={onClose} className="absolute top-4 right-4 text-yellow-200 hover:text-white">
              <X size={20} />
            </button>
            <div className="flex items-center gap-3">
              <Crown size={28} className="text-yellow-300" />
              <div>
                <h2 className="text-white text-xl font-bold">{isBn ? 'প্রিমিয়াম' : 'Premium'}</h2>
                <p className="text-yellow-200 text-sm">{isBn ? 'সব ফিচার আনলক করুন' : 'Unlock all features'}</p>
              </div>
            </div>
            {isActive && expiryDate && (
              <div className="mt-3 bg-yellow-800/50 rounded-xl px-3 py-2">
                <p className="text-yellow-200 text-xs">
                  ✅ {isBn ? 'প্রিমিয়াম সক্রিয়' : 'Premium Active'} · {isBn ? 'মেয়াদ' : 'Expires'}: {expiryDate.toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('purchase')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'purchase' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'
              }`}
            >
              {isBn ? 'প্ল্যান কিনুন' : 'Buy Plan'}
            </button>
            <button
              onClick={() => setActiveTab('promo')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'promo' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'
              }`}
            >
              {isBn ? 'প্রমো কোড' : 'Promo Code'}
            </button>
          </div>

          <div className="px-5 py-5">
            {activeTab === 'purchase' && (
              <div className="space-y-4">
                {PLANS.map(plan => (
                  <div key={plan.id}>
                    {/* BUY Button above each plan */}
                    <button
                      onClick={() => handleBuyClick(plan.id)}
                      className="w-full mb-2 relative overflow-hidden bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold py-2.5 rounded-xl hover:from-yellow-400 hover:to-yellow-300 transition-all active:scale-95 shadow-lg shadow-yellow-500/20"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Mail size={16} />
                        BUY — {isBn ? plan.nameBn : plan.nameEn}
                      </span>
                    </button>

                    {/* Email reveal */}
                    {showEmailFor === plan.id && (
                      <div className="mb-3 bg-gray-800 border border-yellow-600/40 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">{isBn ? 'যোগাযোগ করুন:' : 'Contact:'}</p>
                          <p className="text-yellow-300 font-mono text-sm">{OWNER_EMAIL}</p>
                        </div>
                        <button
                          onClick={handleCopyEmail}
                          className="flex items-center gap-1.5 bg-yellow-600/20 border border-yellow-600/40 text-yellow-400 rounded-lg px-3 py-1.5 text-xs hover:bg-yellow-600/40"
                        >
                          {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
                          {copiedEmail ? (isBn ? 'কপি!' : 'Copied!') : (isBn ? 'কপি' : 'Copy')}
                        </button>
                      </div>
                    )}

                    {/* Plan card */}
                    <div className={`relative rounded-2xl border p-4 ${
                      plan.popular
                        ? 'border-yellow-500 bg-yellow-900/20'
                        : 'border-gray-700 bg-gray-800/50'
                    }`}>
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                          {isBn ? 'সবচেয়ে জনপ্রিয়' : 'Most Popular'}
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-white font-bold">{isBn ? plan.nameBn : plan.nameEn}</h3>
                          <p className="text-gray-400 text-xs">{plan.duration}</p>
                        </div>
                        <span className="text-yellow-400 font-bold text-xl">{plan.price}</span>
                      </div>
                      <ul className="space-y-1.5">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                            <span className="text-green-400 text-xs">✓</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'promo' && (
              <div>
                <p className="text-gray-400 text-sm mb-4">
                  {isBn ? 'প্রমো কোড লিখুন' : 'Enter your promo code'}
                </p>
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handlePromoSubmit()}
                  placeholder={isBn ? 'কোড লিখুন...' : 'Enter code...'}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white mb-3 focus:outline-none focus:border-yellow-500"
                />
                {promoError && <p className="text-red-400 text-sm mb-3">{promoError}</p>}
                {promoSuccess && (
                  <p className="text-green-400 text-sm mb-3">
                    ✅ {isBn ? 'কোড সক্রিয় হয়েছে!' : 'Code activated!'}
                  </p>
                )}
                <button
                  onClick={handlePromoSubmit}
                  className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl transition-colors"
                >
                  {isBn ? 'কোড সক্রিয় করুন' : 'Activate Code'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCongrats && <CongratulationsAnimation onDismiss={handleCongratsClose} />}
    </>
  );
};

export default PremiumModal;
