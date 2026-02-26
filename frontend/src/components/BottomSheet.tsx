import React, { useEffect, useRef } from 'react';
import { playWhoosh, playSoftClick } from '../utils/sounds';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ open, onClose, children, title }) => {
  const hasPlayedOpen = useRef(false);

  useEffect(() => {
    if (open && !hasPlayedOpen.current) {
      playWhoosh();
      hasPlayedOpen.current = true;
    }
    if (!open) {
      hasPlayedOpen.current = false;
    }
  }, [open]);

  const handleClose = () => {
    playSoftClick();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      {/* Sheet */}
      <div
        className="relative w-full rounded-t-3xl bg-gray-900 border-t border-gray-700 shadow-2xl animate-slide-up"
        style={{ height: '80vh', maxHeight: '80vh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-gray-600" />
        </div>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600"
            >
              ✕
            </button>
          </div>
        )}
        {/* Content */}
        <div className="overflow-y-auto h-full pb-16">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
