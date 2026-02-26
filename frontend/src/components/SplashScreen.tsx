import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
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

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0e1a] z-50">
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="relative">
          <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl animate-pulse">
            <img
              src="/assets/generated/app-logo.dim_256x256.png"
              alt="Smart Shop Ledger Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* App Name */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white tracking-widest uppercase">
            SMART SHOP LEDGER
          </h1>
          <p className="text-amber-400 text-base font-semibold mt-1 tracking-wide">
            Smart Shop Ledger
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mt-4">
          <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-500 text-xs text-center mt-2">Loading...</p>
        </div>
      </div>
    </div>
  );
}
