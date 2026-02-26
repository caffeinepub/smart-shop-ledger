import React, { useState } from 'react';

// AdMob Configuration (for future mobile app integration)
// App ID: ca-app-pub-1425556101841688~6943692885
// Ad Unit ID: ca-app-pub-1425556101841688/8731417277

interface AdBannerProps {
  className?: string;
}

export default function AdBanner({ className = '' }: AdBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  const isPremium = (() => {
    try { return localStorage.getItem('isPremium') === 'true'; } catch { return false; }
  })();

  if (isPremium || dismissed) return null;

  return (
    <div
      className={`w-full flex items-center justify-between px-3 py-2 ${className}`}
      style={{
        backgroundColor: 'oklch(0.15 0.02 240)',
        borderTop: '1px solid oklch(0.28 0.02 240)',
        height: '56px',
      }}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span
          className="text-xs font-bold px-1.5 py-0.5 rounded shrink-0"
          style={{
            backgroundColor: 'oklch(0.65 0.18 85)',
            color: 'oklch(0.15 0 0)',
            fontSize: '9px',
          }}
        >
          AD
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate" style={{ color: 'oklch(0.85 0.01 240)' }}>
            Advertisement
          </p>
          <p className="truncate" style={{ color: 'oklch(0.55 0.02 240)', fontSize: '10px' }}>
            Upgrade to Premium to remove ads
          </p>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 ml-2 w-6 h-6 flex items-center justify-center rounded-full"
        style={{
          backgroundColor: 'oklch(0.25 0.02 240)',
          color: 'oklch(0.65 0.02 240)',
          fontSize: '14px',
        }}
        aria-label="Close ad"
      >
        ×
      </button>
    </div>
  );
}
