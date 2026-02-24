import { useEffect, useState } from 'react';
import { Clock, X } from 'lucide-react';
import { useTimerNotification } from '../hooks/useTimerNotification';
import { useLanguage } from '../contexts/LanguageContext';

interface TimerData {
  targetTime: number;
  startTime: number;
  duration: number;
}

interface TimerDisplayProps {
  onClick: () => void;
  onTimerComplete?: () => void;
}

export default function TimerDisplay({ onClick, onTimerComplete }: TimerDisplayProps) {
  const { t } = useLanguage();
  const { showNotification } = useTimerNotification();
  const [timerData, setTimerData] = useState<TimerData | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Load timer data from localStorage
    const loadTimerData = () => {
      try {
        const data = localStorage.getItem('timerData');
        if (data) {
          const parsed: TimerData = JSON.parse(data);
          setTimerData(parsed);
        }
      } catch (error) {
        console.error('Error loading timer data:', error);
      }
    };

    loadTimerData();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'timerData') {
        loadTimerData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!timerData) {
      setRemainingTime(0);
      return;
    }

    const updateRemainingTime = () => {
      const now = Date.now();
      const remaining = Math.max(0, timerData.targetTime - now);
      setRemainingTime(remaining);

      if (remaining === 0 && timerData.targetTime > 0) {
        // Timer completed
        showNotification();
        localStorage.removeItem('timerData');
        setTimerData(null);
        if (onTimerComplete) {
          onTimerComplete();
        }
      }
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [timerData, showNotification, onTimerComplete]);

  const handleClearTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem('timerData');
    setTimerData(null);
    setRemainingTime(0);
  };

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${seconds}s`;
    }
  };

  if (!timerData || remainingTime === 0) {
    return null;
  }

  const progress = ((timerData.duration - remainingTime) / timerData.duration) * 100;

  return (
    <div
      className="relative mx-auto cursor-pointer transition-all duration-300 ease-out"
      style={{
        width: isExpanded ? '280px' : '200px',
      }}
      onClick={onClick}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="relative overflow-hidden rounded-full bg-black px-6 py-3 shadow-lg">
        {/* Progress bar background */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />

        {/* Content */}
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">{formatTime(remainingTime)}</span>
          </div>

          {isExpanded && (
            <button
              onClick={handleClearTimer}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
            >
              <X className="h-3 w-3 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Pulsing indicator */}
      <div className="absolute -right-1 -top-1 h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
      </div>
    </div>
  );
}
