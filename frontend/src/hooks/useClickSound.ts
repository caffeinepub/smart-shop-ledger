import { useRef, useCallback, useEffect, useState } from 'react';

export function useClickSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const customAudioRef = useRef<HTMLAudioElement | null>(null);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    try {
      const val = localStorage.getItem('soundEnabled');
      return val === null ? true : val === 'true';
    } catch {
      return true;
    }
  });
  const [hasCustomSound, setHasCustomSound] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('customSound');
    } catch {
      return false;
    }
  });

  // Load custom sound from localStorage on mount
  useEffect(() => {
    try {
      const customSound = localStorage.getItem('customSound');
      if (customSound) {
        const audio = new Audio(customSound);
        customAudioRef.current = audio;
        setHasCustomSound(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playDefaultSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.06);
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.08);
    } catch {
      // Silently fail
    }
  }, [getAudioContext]);

  const playSound = useCallback(() => {
    // Check current localStorage value for real-time accuracy
    let enabled = true;
    try {
      const val = localStorage.getItem('soundEnabled');
      enabled = val === null ? true : val === 'true';
    } catch {
      enabled = true;
    }
    if (!enabled) return;

    if (customAudioRef.current) {
      try {
        customAudioRef.current.currentTime = 0;
        customAudioRef.current.play().catch(() => {});
      } catch {
        playDefaultSound();
      }
    } else {
      playDefaultSound();
    }
  }, [playDefaultSound]);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    try {
      localStorage.setItem('soundEnabled', enabled.toString());
    } catch {
      // ignore
    }
  }, []);

  const setCustomSound = useCallback((dataUrl: string) => {
    try {
      localStorage.setItem('customSound', dataUrl);
      const audio = new Audio(dataUrl);
      customAudioRef.current = audio;
      setHasCustomSound(true);
    } catch {
      // ignore
    }
  }, []);

  const resetCustomSound = useCallback(() => {
    try {
      localStorage.removeItem('customSound');
      customAudioRef.current = null;
      setHasCustomSound(false);
    } catch {
      // ignore
    }
  }, []);

  return { playSound, soundEnabled, setSoundEnabled, hasCustomSound, setCustomSound, resetCustomSound };
}
