'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SCAN_MESSAGES = [
  { text: 'Connecting to GitHub API...', icon: '🔌' },
  { text: 'Pulling commit history...', icon: '📊' },
  { text: 'Counting stars & reputation...', icon: '⭐' },
  { text: 'Measuring coding aura...', icon: '✨' },
  { text: 'Analyzing language mastery...', icon: '🔬' },
  { text: 'Scanning contribution streak...', icon: '🔥' },
  { text: 'Comparing with legendary devs...', icon: '⚡' },
  { text: 'Consulting the GitHub oracle...', icon: '🔮' },
  { text: 'Calculating power level...', icon: '💥' },
  { text: 'Determining your hero identity...', icon: '🦸' },
];

export default function ScanningAnimation({ username }: { username: string }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, SCAN_MESSAGES.length - 1));
    }, 700);

    const dotsInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 400);

    return () => {
      clearInterval(msgInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex flex-col items-center justify-center gap-8 py-16 px-6"
    >
      {/* Central scanner orb */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Outer spinning ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{ borderTopColor: 'rgba(34,211,238,0.9)', boxShadow: '0 0 20px rgba(34,211,238,0.4)' }}
        />
        {/* Middle ring */}
        <motion.div
          className="absolute inset-3 rounded-full border border-purple-400/30"
          animate={{ rotate: -360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          style={{ borderTopColor: 'rgba(192,132,252,0.8)' }}
        />
        {/* Inner ring */}
        <motion.div
          className="absolute inset-6 rounded-full border border-pink-400/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          style={{ borderTopColor: 'rgba(244,114,182,0.7)' }}
        />
        {/* Center emoji */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-4xl z-10"
        >
          🔍
        </motion.div>

        {/* Scan line sweep */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, rgba(34,211,238,0.3) 30deg, transparent 60deg)',
          }}
        />
      </div>

      {/* Username being scanned */}
      <div className="text-center">
        <p className="text-white/50 text-sm tracking-widest uppercase mb-1">Scanning</p>
        <motion.h2
          className="text-2xl font-black text-white"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          @{username}
        </motion.h2>
      </div>

      {/* Messages */}
      <div className="h-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={msgIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 text-cyan-300 font-mono text-sm"
          >
            <span className="text-xl">{SCAN_MESSAGES[msgIndex]?.icon}</span>
            <span>{SCAN_MESSAGES[msgIndex]?.text}{dots}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(((msgIndex + 1) / SCAN_MESSAGES.length) * 100, 90)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Floating data particles */}
      <div className="flex gap-3 flex-wrap justify-center max-w-xs">
        {['commits', 'stars', 'repos', 'streak', 'languages', 'followers'].map((item, i) => (
          <motion.span
            key={item}
            className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10 font-mono text-white/40"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 1, 0.4], scale: 1 }}
            transition={{ delay: i * 0.3, duration: 0.5 }}
          >
            {item}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
