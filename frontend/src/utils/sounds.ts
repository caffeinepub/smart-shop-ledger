// Sound utility using Web Audio API
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.3,
  delay = 0
): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);

    gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + delay + duration);
  } catch (e) {
    // Silently fail
  }
}

export function playWhoosh(): void {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start();
  } catch (e) {
    // Silently fail
  }
}

export function playSoftClick(): void {
  playTone(800, 0.08, 'sine', 0.15);
}

export function playBell(): void {
  playTone(880, 0.5, 'sine', 0.3);
  playTone(1100, 0.4, 'sine', 0.2, 0.1);
  playTone(1320, 0.6, 'sine', 0.25, 0.2);
}

export function playCashRegister(): void {
  playTone(1200, 0.1, 'square', 0.2);
  playTone(1600, 0.15, 'square', 0.15, 0.1);
  playTone(2000, 0.2, 'sine', 0.2, 0.2);
}

export function playBubblePop(): void {
  playTone(600, 0.1, 'sine', 0.3);
  playTone(900, 0.15, 'sine', 0.25, 0.05);
}
