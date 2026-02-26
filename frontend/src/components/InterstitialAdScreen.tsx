import React, { useEffect, useState } from 'react';

// AdMob Configuration (for future mobile app integration)
// App ID: ca-app-pub-1425556101841688~6943692885
// Ad Unit ID: ca-app-pub-1425556101841688/8731417277

interface InterstitialAdScreenProps {
  onComplete: () => void;
}

export default function InterstitialAdScreen({ onComplete }: InterstitialAdScreenProps) {
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);

  const isPremium = (() => {
    try { return localStorage.getItem('isPremium') === 'true'; } catch { return false; }
  })();

  useEffect(() => {
    // Premium users: show briefly then auto-close
    if (isPremium) {
      const t = setTimeout(onComplete, 1500);
      return () => clearTimeout(t);
    }

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPremium, onComplete]);

  if (isPremium) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'oklch(0.12 0.02 240)' }}>
        <div className="text-center">
          <img src="/assets/generated/app-logo.dim_256x256.png" alt="Logo" className="w-20 h-20 mx-auto mb-4 rounded-2xl" />
          <p style={{ color: 'oklch(0.75 0.18 85)' }} className="font-bold text-lg">Premium Active ✓</p>
          <p style={{ color: 'oklch(0.65 0.02 240)' }} className="text-sm mt-1">Loading your shop...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6" style={{ backgroundColor: 'oklch(0.10 0.02 240)' }}>
      {/* Ad label */}
      <div className="absolute top-4 left-4">
        <span
          className="text-xs font-bold px-2 py-1 rounded"
          style={{ backgroundColor: 'oklch(0.65 0.18 85)', color: 'oklch(0.15 0 0)' }}
        >
          ADVERTISEMENT
        </span>
      </div>

      {/* Close button */}
      <div className="absolute top-4 right-4">
        {canClose ? (
          <button
            onClick={onComplete}
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
            style={{ backgroundColor: 'oklch(0.25 0.02 240)', color: 'oklch(0.90 0.01 240)' }}
          >
            ✕
          </button>
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
            style={{ backgroundColor: 'oklch(0.22 0.02 240)', color: 'oklch(0.65 0.02 240)' }}
          >
            {countdown}
          </div>
        )}
      </div>

      {/* Ad content */}
      <div
        className="w-full max-w-sm rounded-3xl p-8 text-center"
        style={{ backgroundColor: 'oklch(0.18 0.02 240)', border: '1px solid oklch(0.28 0.02 240)' }}
      >
        <img
          src="/assets/generated/app-logo.dim_256x256.png"
          alt="দোকান ম্যানেজার"
          className="w-24 h-24 mx-auto mb-4 rounded-2xl"
        />
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'oklch(0.95 0.01 240)' }}>
          দোকান ম্যানেজার
        </h2>
        <p className="text-sm mb-4" style={{ color: 'oklch(0.65 0.02 240)' }}>
          Smart Shop Ledger — আপনার দোকানের সেরা সঙ্গী
        </p>
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ backgroundColor: 'oklch(0.22 0.02 240)' }}
        >
          <p className="text-xs font-medium" style={{ color: 'oklch(0.75 0.18 85)' }}>
            ✨ Premium-এ আপগ্রেড করুন
          </p>
          <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.02 240)' }}>
            বিজ্ঞাপন ছাড়া ব্যবহার করুন
          </p>
        </div>
        <p className="text-xs" style={{ color: 'oklch(0.45 0.02 240)' }}>
          {canClose ? 'বন্ধ করতে ✕ চাপুন' : `${countdown} সেকেন্ড পরে বন্ধ করা যাবে`}
        </p>
      </div>
    </div>
  );
}
