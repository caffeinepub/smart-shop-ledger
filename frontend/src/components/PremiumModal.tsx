import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Crown, X, Check, Tag, Zap, Star, Gift } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivate: () => void;
}

const VALID_PROMO_CODES = ['987987', '789789', '2580', '01736026413', '01859040014', 'PREMIUM2024', 'SMART2024'];

const plans = [
  { id: 'monthly', labelEn: 'Monthly', labelBn: 'মাসিক', priceEn: '৳299/month', priceBn: '৳২৯৯/মাস', popular: false },
  { id: 'yearly', labelEn: 'Yearly', labelBn: 'বার্ষিক', priceEn: '৳1999/year', priceBn: '৳১৯৯৯/বছর', popular: true },
  { id: 'lifetime', labelEn: 'Lifetime', labelBn: 'আজীবন', priceEn: '৳4999', priceBn: '৳৪৯৯৯', popular: false },
];

const features = [
  { en: 'Unlimited items (no 199 limit)', bn: 'আনলিমিটেড আইটেম (১৯৯ সীমা নেই)' },
  { en: 'Color categorization for sales', bn: 'বিক্রয়ে রঙ দিয়ে শ্রেণীবিভাগ' },
  { en: 'Task List & Product List access', bn: 'কাজের তালিকা ও পণ্যের তালিকা' },
  { en: '3 exclusive color themes', bn: '৩টি এক্সক্লুসিভ কালার থিম' },
  { en: 'Custom notification sounds', bn: 'কাস্টম নোটিফিকেশন সাউন্ড' },
  { en: 'Data Export (CSV)', bn: 'ডেটা এক্সপোর্ট (CSV)' },
  { en: 'Advanced Statistics', bn: 'অ্যাডভান্সড স্ট্যাটিস্টিক্স' },
];

export default function PremiumModal({ isOpen, onClose, onActivate }: PremiumModalProps) {
  const { t, language } = useLanguage();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'plans' | 'promo'>('plans');
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [bubbles, setBubbles] = useState<{ id: number; x: number; size: number; delay: number }[]>([]);
  const isBn = language === 'bn';

  useEffect(() => {
    if (isOpen) {
      const newBubbles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 8 + Math.random() * 16,
        delay: Math.random() * 3,
      }));
      setBubbles(newBubbles);
      setPromoCode('');
      setPromoError('');
      setPromoSuccess(false);
      setShowEmail(false);
    }
  }, [isOpen]);

  const handlePromoSubmit = () => {
    const code = promoCode.trim();
    if (VALID_PROMO_CODES.includes(code)) {
      setPromoSuccess(true);
      setPromoError('');
      localStorage.setItem('premiumActive', 'true');
      localStorage.setItem('premiumActivationDate', Date.now().toString());
      setTimeout(() => {
        onActivate();
        onClose();
      }, 1500);
    } else {
      setPromoError(isBn ? 'অবৈধ প্রমো কোড!' : 'Invalid promo code!');
      setPromoSuccess(false);
    }
  };

  const handleBuy = () => {
    setShowEmail(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md rounded-t-3xl overflow-hidden shadow-2xl ${
          isDark ? 'bg-gray-900' : 'bg-white'
        }`}
        style={{ maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Animated bubbles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {bubbles.map(b => (
            <div
              key={b.id}
              className="absolute rounded-full opacity-10 animate-bubble-float"
              style={{
                left: `${b.x}%`,
                bottom: '-20px',
                width: b.size,
                height: b.size,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                animationDelay: `${b.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 px-5 pt-6 pb-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white"
          >
            <X size={16} />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3 shadow-lg">
              <Crown size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {isBn ? 'প্রিমিয়াম' : 'Premium'}
            </h2>
            <p className="text-amber-100 text-sm">
              {isBn ? 'সব ফিচার আনলক করুন' : 'Unlock all features'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'plans'
                ? 'text-amber-500 border-b-2 border-amber-500'
                : isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {isBn ? 'প্ল্যান' : 'Plans'}
          </button>
          <button
            onClick={() => setActiveTab('promo')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'promo'
                ? 'text-amber-500 border-b-2 border-amber-500'
                : isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <Tag size={14} className="inline mr-1" />
            {isBn ? 'প্রমো কোড' : 'Promo Code'}
          </button>
        </div>

        <div className="px-5 py-4">
          {activeTab === 'plans' ? (
            <>
              {/* Features list */}
              <div className={`rounded-2xl p-4 mb-4 ${isDark ? 'bg-gray-800' : 'bg-amber-50'}`}>
                <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                  {isBn ? 'প্রিমিয়াম সুবিধা' : 'Premium Benefits'}
                </p>
                <div className="space-y-2">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-white" />
                      </div>
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {isBn ? f.bn : f.en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan cards */}
              <div className="space-y-3 mb-4">
                {plans.map(plan => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full rounded-2xl p-4 border-2 transition-all text-left relative ${
                      selectedPlan === plan.id
                        ? 'border-amber-500 bg-amber-500/10'
                        : isDark
                        ? 'border-gray-700 bg-gray-800'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2 right-4 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        {isBn ? 'জনপ্রিয়' : 'Popular'}
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {isBn ? plan.labelBn : plan.labelEn}
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {isBn ? plan.priceBn : plan.priceEn}
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === plan.id ? 'border-amber-500 bg-amber-500' : isDark ? 'border-gray-600' : 'border-gray-300'
                      }`}>
                        {selectedPlan === plan.id && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Buy button */}
              {!showEmail ? (
                <button
                  onClick={handleBuy}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
                >
                  <Zap size={18} className="inline mr-2" />
                  {isBn ? 'এখনই কিনুন' : 'Buy Now'}
                </button>
              ) : (
                <div className={`rounded-2xl p-4 text-center ${isDark ? 'bg-gray-800' : 'bg-amber-50'}`}>
                  <Star size={24} className="text-amber-500 mx-auto mb-2" />
                  <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {isBn ? 'পেমেন্টের জন্য যোগাযোগ করুন:' : 'Contact for payment:'}
                  </p>
                  <p className="text-amber-500 font-bold text-sm">smartshopled@gmail.com</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {isBn ? 'পেমেন্টের পর প্রমো কোড পাবেন' : 'You will receive a promo code after payment'}
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Promo code tab */
            <div className="py-4">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                  <Gift size={28} className="text-amber-500" />
                </div>
                <p className={`text-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {isBn ? 'আপনার প্রমো কোড লিখুন' : 'Enter your promo code'}
                </p>
              </div>

              {promoSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-3">
                    <Check size={32} className="text-white" />
                  </div>
                  <p className="text-green-500 font-bold text-lg">
                    {isBn ? 'প্রিমিয়াম সক্রিয় হয়েছে!' : 'Premium Activated!'}
                  </p>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
                    placeholder={isBn ? 'প্রমো কোড লিখুন...' : 'Enter promo code...'}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-center text-lg font-mono tracking-widest mb-3 outline-none transition-colors ${
                      promoError
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : isDark
                        ? 'border-gray-600 bg-gray-800 text-white'
                        : 'border-gray-300 bg-gray-50 text-gray-900'
                    } focus:border-amber-500`}
                    onKeyDown={e => e.key === 'Enter' && handlePromoSubmit()}
                  />
                  {promoError && (
                    <p className="text-red-500 text-sm text-center mb-3">{promoError}</p>
                  )}
                  <button
                    onClick={handlePromoSubmit}
                    disabled={!promoCode.trim()}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold disabled:opacity-50 active:scale-95 transition-transform"
                  >
                    {isBn ? 'কোড ব্যবহার করুন' : 'Apply Code'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Bottom safe area */}
        <div className="h-4" />
      </div>
    </div>
  );
}
