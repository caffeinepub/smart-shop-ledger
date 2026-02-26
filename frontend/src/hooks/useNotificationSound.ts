import { useCallback } from 'react';

const SOUND_KEY = 'soundEnabled';
const CUSTOM_SOUND_KEY = 'customSound';

export function useNotificationSound() {
  const playNotificationSound = useCallback(() => {
    const soundEnabled = localStorage.getItem(SOUND_KEY);
    if (soundEnabled !== 'true') return;

    const customSound = localStorage.getItem(CUSTOM_SOUND_KEY);
    if (customSound) {
      try {
        const audio = new Audio(customSound);
        audio.volume = 0.7;
        audio.play().catch(() => {});
        return;
      } catch {
        // fall through to default
      }
    }

    // Default chime using Web Audio API
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const playTone = (freq: number, startTime: number, duration: number, gainVal: number) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(gainVal, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playTone(880, now, 0.15, 0.4);
      playTone(1100, now + 0.12, 0.15, 0.35);
      playTone(1320, now + 0.24, 0.25, 0.3);

      setTimeout(() => ctx.close(), 1000);
    } catch {
      // Silently fail if Web Audio API not available
    }
  }, []);

  return { playNotificationSound };
}
