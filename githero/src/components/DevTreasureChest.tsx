'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitHubMetrics } from '@/lib/scoring';

interface DevTreasureChestProps {
  metrics: GitHubMetrics;
  score: number;
  characterColor: string;
}

export default function DevTreasureChest({ metrics, score, characterColor }: DevTreasureChestProps) {
  const [opened, setOpened] = useState(false);

  const loot = [
    { icon: '📦', label: `+${metrics.repos} repositories discovered`, color: '#22d3ee' },
    { icon: '💻', label: `+${metrics.commits.toLocaleString()} commits forged`, color: '#f97316' },
    { icon: '🌐', label: `+${metrics.languages.length} languages unlocked`, color: '#c084fc' },
    { icon: '⭐', label: `+${metrics.stars} stars earned`, color: '#facc15' },
    { icon: '👥', label: `+${metrics.followers} followers recruited`, color: '#4ade80' },
    { icon: '🔥', label: `${metrics.streak}-day coding streak`, color: '#ef4444' },
    { icon: '🏆', label: `Power Level: ${score}/100`, color: characterColor },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="game-label">🎁 Dev Treasure Chest</span>

      {/* Chest */}
      <motion.button
        onClick={() => setOpened(true)}
        disabled={opened}
        className="relative group cursor-pointer disabled:cursor-default select-none"
        whileHover={!opened ? { scale: 1.05 } : {}}
        whileTap={!opened ? { scale: 0.95 } : {}}
      >
        {/* Outer glow ring when not opened */}
        {!opened && (
          <motion.div
            className="absolute -inset-3 rounded-2xl opacity-40 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${characterColor}55, transparent 70%)` }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <div
          className="relative w-24 h-20 rounded-xl border-2 flex flex-col items-center justify-center overflow-hidden"
          style={{
            borderColor: opened ? '#fbbf24aa' : characterColor + '99',
            background: opened
              ? 'linear-gradient(135deg, #2a1800, #1a0f00)'
              : 'linear-gradient(135deg, #1a0a2e, #0f0620)',
            boxShadow: opened ? '0 0 20px #fbbf2466' : `0 0 20px ${characterColor}55`,
          }}
        >
          {/* Lid */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[42%] rounded-t-xl flex items-center justify-center border-b-2"
            style={{
              background: opened
                ? 'linear-gradient(180deg, #7c3a00, #4a2200)'
                : 'linear-gradient(180deg, #1e1040, #120830)',
              borderColor: opened ? '#fbbf2488' : characterColor + '55',
            }}
            animate={{ rotateX: opened ? -110 : 0, originY: '100%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <span className="text-xl">{opened ? '✨' : '🔒'}</span>
          </motion.div>

          {/* Body */}
          <div className="absolute bottom-0 left-0 right-0 h-[60%] rounded-b-xl flex items-center justify-center">
            <span className="text-2xl mt-2">{opened ? '💰' : '📦'}</span>
          </div>
        </div>

        {!opened && (
          <p className="text-[9px] text-white/35 tracking-widest uppercase font-bold mt-2 text-center">
            Click to open
          </p>
        )}
      </motion.button>

      {/* Loot items */}
      <AnimatePresence>
        {opened && (
          <motion.div
            className="w-full flex flex-col gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {loot.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 200, damping: 18 }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl border bg-white/[0.03]"
                style={{ borderColor: item.color + '35' }}
              >
                <span
                  className="text-base leading-none"
                  style={{ filter: `drop-shadow(0 0 6px ${item.color}cc)` }}
                >
                  {item.icon}
                </span>
                <span className="text-xs font-bold text-white/70">{item.label}</span>
                <motion.span
                  className="ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-md"
                  style={{ background: item.color + '30', color: item.color }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.08 + 0.2 }}
                >
                  +XP
                </motion.span>
              </motion.div>
            ))}

            {/* Sparkle burst */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: loot.length * 0.08 + 0.1 }}
              className="text-center text-[10px] font-black tracking-widest uppercase mt-1"
              style={{ color: characterColor }}
            >
              ✨ All loot collected!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
