import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2500;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setFadeOut(true);
        setTimeout(onComplete, 400);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-50 transition-opacity duration-400 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d2137 40%, #0a2e1a 100%)' }}
    >
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 animate-pulse"
          style={{ background: 'radial-gradient(circle, #22c55e, transparent)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full opacity-10 animate-pulse"
          style={{ background: 'radial-gradient(circle, #16a34a, transparent)', animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full opacity-5 animate-pulse"
          style={{ background: 'radial-gradient(circle, #4ade80, transparent)', animationDelay: '0.5s' }} />
      </div>

      {/* Logo Container */}
      <div className="relative flex flex-col items-center mb-8">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ background: 'radial-gradient(circle, #22c55e, transparent)', width: '160px', height: '160px', top: '-10px', left: '-10px' }} />

        {/* Main logo circle */}
        <div
          className="relative w-36 h-36 rounded-full flex items-center justify-center shadow-2xl animate-pulse"
          style={{
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%)',
            boxShadow: '0 0 40px rgba(34, 197, 94, 0.5), 0 0 80px rgba(34, 197, 94, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}
        >
          {/* Inner logo design - Shop + Ledger icon */}
          <div className="flex flex-col items-center justify-center">
            {/* Shop roof */}
            <div className="relative mb-1">
              <svg width="72" height="64" viewBox="0 0 72 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Shop building */}
                <rect x="8" y="28" width="56" height="32" rx="2" fill="rgba(255,255,255,0.95)" />
                {/* Roof/awning */}
                <path d="M4 28 L36 8 L68 28 Z" fill="rgba(255,255,255,0.85)" />
                {/* Door */}
                <rect x="28" y="40" width="16" height="20" rx="2" fill="#15803d" />
                {/* Windows */}
                <rect x="12" y="34" width="12" height="10" rx="1" fill="#15803d" />
                <rect x="48" y="34" width="12" height="10" rx="1" fill="#15803d" />
                {/* Ledger lines on building */}
                <line x1="12" y1="50" x2="24" y2="50" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="12" y1="54" x2="24" y2="54" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="48" y1="50" x2="60" y2="50" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="48" y1="54" x2="60" y2="54" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
                {/* Star on roof */}
                <circle cx="36" cy="16" r="4" fill="#fbbf24" />
                <path d="M36 12 L37.2 15.2 L40.5 15.2 L37.9 17.2 L38.9 20.5 L36 18.5 L33.1 20.5 L34.1 17.2 L31.5 15.2 L34.8 15.2 Z" fill="#f59e0b" />
              </svg>
            </div>
          </div>
        </div>

        {/* SSL Badge */}
        <div
          className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center text-xs font-black shadow-lg"
          style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#1a1a1a' }}
        >
          SSL
        </div>
      </div>

      {/* App Name */}
      <div className="text-center mb-2">
        <h1
          className="text-3xl font-black tracking-widest mb-1"
          style={{
            color: '#ffffff',
            textShadow: '0 0 20px rgba(34, 197, 94, 0.6)',
            letterSpacing: '0.15em'
          }}
        >
          SMART SHOP
        </h1>
        <h1
          className="text-3xl font-black tracking-widest"
          style={{
            background: 'linear-gradient(90deg, #22c55e, #4ade80, #22c55e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.15em'
          }}
        >
          LEDGER
        </h1>
      </div>

      {/* Tagline */}
      <p className="text-sm mb-12 tracking-wider" style={{ color: 'rgba(134, 239, 172, 0.7)' }}>
        স্মার্ট শপ লেজার
      </p>

      {/* Progress bar */}
      <div className="w-64 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #16a34a, #22c55e, #4ade80)'
          }}
        />
      </div>

      {/* Version */}
      <p className="mt-4 text-xs" style={{ color: 'rgba(134, 239, 172, 0.4)' }}>v2.0.0</p>
    </div>
  );
}
