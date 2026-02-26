import React, { useEffect, useRef } from 'react';
import { usePremiumStatus } from '../hooks/usePremiumStatus';

const AD_CLIENT = 'ca-app-pub-1425556101841688';
const AD_SLOT = '7582793038';

const AdMobBanner: React.FC = () => {
  const { isActive } = usePremiumStatus();
  const initialized = useRef(false);

  useEffect(() => {
    if (isActive || initialized.current) return;
    initialized.current = true;
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
      (window as any).adsbygoogle = adsbygoogle;
    } catch (e) {
      // Silently fail
    }
  }, [isActive]);

  if (isActive) return null;

  return (
    <div className="w-full flex justify-center items-center bg-gray-900/80 border-t border-gray-800 py-1 min-h-[60px]">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '60px' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOT}
        data-ad-format="banner"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdMobBanner;
