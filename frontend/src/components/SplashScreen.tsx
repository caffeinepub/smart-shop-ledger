import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on next frame to ensure it's visible
    const frameId = requestAnimationFrame(() => {
      setVisible(true);
    });

    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frameId);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/80">
      <div
        className="space-y-8 text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.8)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        }}
      >
        {/* Logo */}
        <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-3xl bg-white/10 p-4 shadow-2xl backdrop-blur-sm">
          <img
            src="/assets/generated/app-logo.dim_512x512.png"
            alt="Smart Shop Ledger Logo"
            className="h-full w-full object-contain"
          />
        </div>

        {/* App Name */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            {t('appName')}
          </h1>
          <p
            className="text-lg font-medium tracking-wide text-white/90 drop-shadow-md"
            style={{
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.6s ease-out 0.3s',
            }}
          >
            {t('appTagline')}
          </p>
        </div>

        {/* Loading bar */}
        <div className="flex justify-center">
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white/80"
              style={{
                width: visible ? '100%' : '0%',
                transition: 'width 2.2s ease-in-out',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
