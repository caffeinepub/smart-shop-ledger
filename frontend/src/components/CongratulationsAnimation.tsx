import React, { useEffect, useRef } from 'react';
import { playBell } from '../utils/sounds';

interface CongratulationsAnimationProps {
  onDismiss: () => void;
}

const CongratulationsAnimation: React.FC<CongratulationsAnimationProps> = ({ onDismiss }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    playBell();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      color: string; size: number; alpha: number;
    }> = [];

    const colors = ['#FFD700', '#22C55E', '#3B82F6', '#EF4444', '#A855F7', '#F97316'];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        alpha: 1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.alpha -= 0.008;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (particles.some(p => p.alpha > 0)) {
        animId = requestAnimationFrame(animate);
      }
    };
    animId = requestAnimationFrame(animate);

    const timer = setTimeout(onDismiss, 3500);
    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(timer);
    };
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="relative z-10 text-center animate-bounce pointer-events-auto">
        <div className="bg-gray-900/90 backdrop-blur-md rounded-3xl px-8 py-6 border border-yellow-500/50 shadow-2xl shadow-yellow-500/20">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-1">অভিনন্দন!</h2>
          <p className="text-green-400 font-semibold">প্রিমিয়াম সক্রিয় হয়েছে!</p>
          <p className="text-gray-400 text-sm mt-2">আপনি এখন সব প্রিমিয়াম সুবিধা পাবেন</p>
          <button
            onClick={onDismiss}
            className="mt-4 bg-yellow-500 text-black font-bold rounded-xl px-6 py-2 hover:bg-yellow-400 transition-colors"
          >
            ধন্যবাদ! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default CongratulationsAnimation;
