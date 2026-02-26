import React from 'react';
import { X, Code2, User, Info, ExternalLink } from 'lucide-react';

interface DeveloperInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  t: (key: string) => string;
}

const DeveloperInfoModal: React.FC<DeveloperInfoModalProps> = ({ isOpen, onClose, isDark, t }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl flex flex-col"
        style={{
          backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
          maxHeight: '80vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b rounded-t-2xl"
          style={{ borderColor: isDark ? '#333' : '#e5e7eb' }}
        >
          <div className="flex items-center gap-2">
            <Code2 size={20} style={{ color: '#006A4E' }} />
            <span className="font-bold text-lg" style={{ color: isDark ? '#fff' : '#111' }}>
              Developer Info
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full"
            style={{ color: isDark ? '#aaa' : '#666' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Developer Info */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: isDark ? '#0f3460' : '#f0fdf4' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <User size={18} style={{ color: '#006A4E' }} />
              <span className="font-bold" style={{ color: isDark ? '#fff' : '#111' }}>
                Developer
              </span>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-xs" style={{ color: isDark ? '#aaa' : '#666' }}>Name</span>
                <p className="font-bold text-base" style={{ color: isDark ? '#fff' : '#111' }}>
                  MD JAHID HASAN RUBEL
                </p>
              </div>
              <div>
                <span className="text-xs" style={{ color: isDark ? '#aaa' : '#666' }}>Role</span>
                <p className="font-semibold" style={{ color: isDark ? '#e0e0e0' : '#333' }}>
                  Full Stack Developer
                </p>
              </div>
            </div>
          </div>

          {/* App Info */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: isDark ? '#16213e' : '#f8fafc' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Info size={18} style={{ color: '#006A4E' }} />
              <span className="font-bold" style={{ color: isDark ? '#fff' : '#111' }}>
                App Information
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: isDark ? '#aaa' : '#666' }}>App Name</span>
                <span className="text-sm font-semibold" style={{ color: isDark ? '#fff' : '#111' }}>
                  Smart Shop Ledger
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: isDark ? '#aaa' : '#666' }}>Version</span>
                <span className="text-sm font-semibold" style={{ color: isDark ? '#fff' : '#111' }}>
                  1.0.0
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: isDark ? '#aaa' : '#666' }}>Platform</span>
                <span className="text-sm font-semibold" style={{ color: isDark ? '#fff' : '#111' }}>
                  Web / PWA
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: isDark ? '#aaa' : '#666' }}>Built With</span>
                <span className="text-sm font-semibold" style={{ color: isDark ? '#fff' : '#111' }}>
                  React + ICP
                </span>
              </div>
            </div>
          </div>

          {/* About */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: isDark ? '#16213e' : '#f8fafc' }}
          >
            <p className="text-sm leading-relaxed" style={{ color: isDark ? '#ccc' : '#555' }}>
              Smart Shop Ledger is a comprehensive business management app designed for small shop owners in Bangladesh. 
              Track sales, manage inventory, and grow your business with ease.
            </p>
          </div>
        </div>

        {/* Sticky Footer */}
        <div
          className="p-4 border-t rounded-b-2xl"
          style={{ borderColor: isDark ? '#333' : '#e5e7eb' }}
        >
          <a
            href="https://fb.openinapp.co/khncs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white"
            style={{ backgroundColor: '#1877F2' }}
          >
            <ExternalLink size={18} />
            Facebook Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default DeveloperInfoModal;
