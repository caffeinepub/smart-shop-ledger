import { useEffect } from 'react';
import { useCamera } from '../camera/useCamera';
import { X, Camera, AlertCircle } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export default function CameraModal({ isOpen, onClose, onCapture }: CameraModalProps) {
  const {
    isActive,
    isSupported,
    error,
    isLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'environment',
    quality: 0.9,
    format: 'image/jpeg',
  });

  useEffect(() => {
    if (isOpen) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleCapture = async () => {
    const file = await capturePhoto();
    if (file) {
      onCapture(file);
      stopCamera();
      onClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="relative w-full max-w-sm mx-4 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
          <h3 className="text-white font-semibold text-base">📷 Take Photo</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Camera Preview */}
        <div className="relative w-full bg-black" style={{ aspectRatio: '4/3', minHeight: '240px' }}>
          {isSupported === false && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-center p-4">
              <AlertCircle className="text-red-400 mb-2" size={32} />
              <p className="text-red-400 text-sm">Camera not supported in this browser</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-center p-4">
              <AlertCircle className="text-red-400 mb-2" size={32} />
              <p className="text-red-400 text-sm">{error.message}</p>
              <button
                onClick={() => startCamera()}
                className="mt-3 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {isLoading && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">Starting camera...</p>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            style={{ display: isActive ? 'block' : 'none' }}
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 p-4 bg-gray-800">
          <button
            onClick={handleCapture}
            disabled={!isActive || isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-lg"
          >
            <Camera size={20} />
            Capture
          </button>
        </div>
      </div>
    </div>
  );
}
