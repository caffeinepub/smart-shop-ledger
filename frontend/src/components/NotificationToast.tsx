import { useEffect, useState } from 'react';

interface NotificationToastProps {
  message: string;
  isVisible: boolean;
  onDismiss: () => void;
}

export default function NotificationToast({ message, isVisible, onDismiss }: NotificationToastProps) {
  const [animState, setAnimState] = useState<'entering' | 'visible' | 'leaving'>('entering');

  useEffect(() => {
    if (isVisible) {
      setAnimState('entering');
      const visibleTimer = setTimeout(() => setAnimState('visible'), 50);
      const leaveTimer = setTimeout(() => setAnimState('leaving'), 2700);
      const dismissTimer = setTimeout(() => onDismiss(), 3000);
      return () => {
        clearTimeout(visibleTimer);
        clearTimeout(leaveTimer);
        clearTimeout(dismissTimer);
      };
    }
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  const handleClick = () => {
    setAnimState('leaving');
    setTimeout(onDismiss, 300);
  };

  const translateY = animState === 'entering' ? '-100%' : animState === 'leaving' ? '-100%' : '0%';
  const opacity = animState === 'visible' ? 1 : 0;

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: `translateX(-50%) translateY(${translateY})`,
        opacity,
        transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
        zIndex: 9999,
        cursor: 'pointer',
        maxWidth: '340px',
        width: 'calc(100vw - 32px)',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.97) 0%, rgba(20, 40, 25, 0.97) 100%)',
          borderRadius: '16px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(34, 197, 94, 0.3), 0 0 20px rgba(34, 197, 94, 0.15)',
          border: '1px solid rgba(34, 197, 94, 0.25)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 12px rgba(34, 197, 94, 0.4)',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 72 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="28" width="56" height="32" rx="2" fill="rgba(255,255,255,0.95)" />
            <path d="M4 28 L36 8 L68 28 Z" fill="rgba(255,255,255,0.85)" />
            <rect x="28" y="40" width="16" height="20" rx="2" fill="#15803d" />
            <rect x="12" y="34" width="12" height="10" rx="1" fill="#15803d" />
            <rect x="48" y="34" width="12" height="10" rx="1" fill="#15803d" />
          </svg>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span style={{ color: '#4ade80', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Smart Shop Ledger
            </span>
            <span style={{ color: 'rgba(134, 239, 172, 0.5)', fontSize: '10px' }}>•</span>
            <span style={{ color: 'rgba(134, 239, 172, 0.5)', fontSize: '10px' }}>এখনই</span>
          </div>
          <p style={{ color: '#ffffff', fontSize: '13px', fontWeight: 500, lineHeight: 1.4, margin: 0 }}>
            {message}
          </p>
        </div>

        {/* Success indicator */}
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(34, 197, 94, 0.2)',
            border: '1.5px solid rgba(34, 197, 94, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
    </div>
  );
}
