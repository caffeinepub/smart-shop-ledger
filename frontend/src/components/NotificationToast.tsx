import React, { useEffect, useState } from 'react';

interface NotificationToastProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ visible, message, onDismiss }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [visible]);

  if (!visible && !show) return null;

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed',
        top: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: 'calc(100% - 32px)',
        maxWidth: '420px',
        animation: visible ? 'notifSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'notifSlideOut 0.25s ease-in forwards',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          background: 'rgba(28, 28, 30, 0.97)',
          borderRadius: '16px',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* App Logo */}
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            overflow: 'hidden',
            flexShrink: 0,
            background: '#1a1a2e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/assets/generated/app-logo.dim_80x80.png"
            alt="App Logo"
            style={{ width: '44px', height: '44px', objectFit: 'cover' }}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '13px',
              letterSpacing: '0.01em',
              marginBottom: '2px',
              fontFamily: 'inherit',
            }}
          >
            Smart Shop Ledger
          </div>
          <div
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: '13px',
              fontWeight: '400',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: 'inherit',
            }}
          >
            {message}
          </div>
        </div>

        {/* Time indicator */}
        <div
          style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '11px',
            flexShrink: 0,
            alignSelf: 'flex-start',
            marginTop: '2px',
          }}
        >
          now
        </div>
      </div>

      <style>{`
        @keyframes notifSlideIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-100%) scale(0.9); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1);   }
        }
        @keyframes notifSlideOut {
          from { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1);   }
          to   { opacity: 0; transform: translateX(-50%) translateY(-80%) scale(0.95); }
        }
      `}</style>
    </div>
  );
};

export default NotificationToast;
