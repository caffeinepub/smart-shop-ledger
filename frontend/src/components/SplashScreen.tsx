import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const { t } = useLanguage();

  useEffect(() => {
    console.log('[SplashScreen] Initialized at', new Date().toISOString());
    
    const timer = setTimeout(() => {
      console.log('[SplashScreen] Timeout completed at', new Date().toISOString());
      onComplete();
    }, 2500);

    return () => {
      console.log('[SplashScreen] Cleanup');
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/80">
      <div className="animate-scale-in space-y-8 text-center">
        {/* Logo */}
        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-3xl bg-white/10 p-6 shadow-2xl backdrop-blur-sm">
          <img 
            src="/assets/generated/shop-logo.dim_512x512.png" 
            alt="Bangla Bazar Logo" 
            className="h-full w-full object-contain"
          />
        </div>

        {/* App Name */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            {t('appName')}
          </h1>
          
          {/* Tagline with improved design */}
          <p className="animate-fade-in text-lg font-medium tracking-wide text-white/90 drop-shadow-md" style={{ animationDelay: '0.3s' }}>
            {t('appTagline')}
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex justify-center">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-full origin-left animate-pulse bg-white/80" />
          </div>
        </div>
      </div>
    </div>
  );
}
