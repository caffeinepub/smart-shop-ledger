// Click sound hook with Web Audio API tone generation
// Supports custom sound upload/storage via base64 in localStorage
// Sound enable/disable toggle with full localStorage persistence

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

function playBuiltInClick(): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);

    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  } catch {
    // Silently fail if audio context is not available
  }
}

function playCustomSound(base64: string): void {
  try {
    const ctx = getAudioContext();
    const binary = atob(base64.split(',')[1] || base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    ctx.decodeAudioData(bytes.buffer, (buffer) => {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    });
  } catch {
    playBuiltInClick();
  }
}

export function playClickSound(): void {
  const enabled = localStorage.getItem('clickSoundEnabled');
  if (enabled === 'false') return;

  const customSound = localStorage.getItem('customClickSound');
  if (customSound) {
    playCustomSound(customSound);
  } else {
    playBuiltInClick();
  }
}

import { useState, useCallback } from 'react';

export interface UseClickSoundReturn {
  isEnabled: boolean;
  toggleSound: () => void;
  playSound: () => void;
  uploadCustomSound: (file: File) => Promise<void>;
  removeCustomSound: () => void;
  hasCustomSound: boolean;
}

export function useClickSound(): UseClickSoundReturn {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem('clickSoundEnabled');
    return stored !== 'false';
  });

  const [hasCustomSound, setHasCustomSound] = useState<boolean>(() => {
    return !!localStorage.getItem('customClickSound');
  });

  const toggleSound = useCallback(() => {
    setIsEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('clickSoundEnabled', String(next));
      return next;
    });
  }, []);

  const playSound = useCallback(() => {
    playClickSound();
  }, []);

  const uploadCustomSound = useCallback(async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (base64) {
          localStorage.setItem('customClickSound', base64);
          setHasCustomSound(true);
          resolve();
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, []);

  const removeCustomSound = useCallback(() => {
    localStorage.removeItem('customClickSound');
    setHasCustomSound(false);
  }, []);

  return {
    isEnabled,
    toggleSound,
    playSound,
    uploadCustomSound,
    removeCustomSound,
    hasCustomSound,
  };
}
