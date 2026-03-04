'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getPowerColor } from '@/lib/scoring';

interface PowerMeterProps {
  score: number;
  label: string;
  animate?: boolean;
}

export default function PowerMeter({ score, label, animate = true }: PowerMeterProps) {
  const [displayed, setDisplayed] = useState(animate ? 0 : score);
  const color = getPowerColor(score);

  useEffect(() => {
    if (!animate) return;
    let current = 0;
    const step = Math.max(1, Math.floor(score / 60));
    const interval = setInterval(() => {
      current = Math.min(current + step, score);
      setDisplayed(current);
      if (current >= score) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [score, animate]);

  const segments = 20;
  const filled = Math.round((displayed / 100) * segments);

  return (
    <div className="w-full">
      {/* Label row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color }}>
          {label}
        </span>
        <span
          className="text-2xl font-black tabular-nums"
          style={{ color, textShadow: `0 0 20px ${color}` }}
        >
          {displayed}
          <span className="text-sm text-white/40 font-normal"> / 100</span>
        </span>
      </div>

      {/* Bar */}
      <div className="relative h-5 rounded-full bg-white/5 border border-white/10 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${displayed}%` }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          style={{
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 12px ${color}, 0 0 30px ${color}55`,
          }}
        />
        {/* Scanline shimmer */}
        <motion.div
          className="absolute inset-y-0 w-8 rounded-full opacity-60"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          }}
          animate={{ left: ['-10%', '110%'] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1.5, ease: 'easeInOut' }}
        />
      </div>

      {/* Segment dots */}
      <div className="flex gap-1 mt-2">
        {Array.from({ length: segments }).map((_, i) => (
          <motion.div
            key={i}
            className="h-1.5 rounded-full flex-1"
            initial={{ opacity: 0.1 }}
            animate={{ opacity: i < filled ? 1 : 0.12 }}
            transition={{ delay: animate ? i * 0.04 : 0, duration: 0.3 }}
            style={{
              backgroundColor: i < filled ? color : 'rgba(255,255,255,0.1)',
              boxShadow: i < filled ? `0 0 6px ${color}` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
