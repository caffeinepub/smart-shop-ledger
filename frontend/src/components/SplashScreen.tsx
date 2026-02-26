import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation shortly after mount
    const showTimer = setTimeout(() => setVisible(true), 50);

    const duration = 2500;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);
      if (currentStep >= steps) {
        clearInterval(timer);
        onComplete();
      }
    }, interval);

    return () => {
      clearInterval(timer);
      clearTimeout(showTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0e1a] z-50 overflow-hidden">
      {/* Background glow effect */}
      <div
        className="absolute w-72 h-72 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #d97706, transparent)' }}
      />

      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* App Name Text Animation */}
        <div
          className="text-center transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.92)',
          }}
        >
          <h1
            className="text-4xl font-extrabold tracking-widest uppercase"
            style={{ color: '#f59e0b', letterSpacing: '0.15em' }}
          >
            SMART SHOP
          </h1>
          <h1
            className="text-4xl font-extrabold tracking-widest uppercase"
            style={{
              color: '#ffffff',
              letterSpacing: '0.15em',
              transitionDelay: '100ms',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.7s ease-out 0.1s, transform 0.7s ease-out 0.1s',
            }}
          >
            LEDGER
          </h1>
        </div>

        {/* Bengali subtitle */}
        <div
          className="transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: '250ms',
          }}
        >
          <p
            className="text-base font-semibold tracking-wide"
            style={{ color: '#fbbf24' }}
          >
            স্মার্ট শপ লেজার
          </p>
        </div>

        {/* Decorative line */}
        <div
          className="transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            width: visible ? '160px' : '0px',
            transitionDelay: '350ms',
          }}
        >
          <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-40" />
        </div>

        {/* Progress Bar */}
        <div
          className="w-64 transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transitionDelay: '400ms',
          }}
        >
          <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-75 ease-linear"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #d97706, #fbbf24)',
              }}
            />
          </div>
          <p className="text-gray-500 text-xs text-center mt-2">Loading...</p>
        </div>
      </div>
    </div>
  );
}
