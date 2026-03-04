'use client';

import { useState, FormEvent } from 'react';
import { motion, Variants } from 'framer-motion';

interface LandingHeroProps {
  onSubmit: (username: string) => void;
  isLoading?: boolean;
}

const HERO_CHARS = [
  { emoji: '🤖', label: 'Iron Man',  color: '#ef4444' },
  { emoji: '🦇', label: 'Batman',    color: '#facc15' },
  { emoji: '♟️', label: 'Aizen',     color: '#c084fc' },
  { emoji: '⚔️', label: 'Levi',      color: '#2dd4bf' },
  { emoji: '🍥', label: 'Naruto',    color: '#f97316' },
  { emoji: '🛡️', label: 'Cap',       color: '#3b82f6' },
  { emoji: '🕷️', label: 'Spidey',    color: '#dc2626' },
  { emoji: '⚡', label: 'Goku',      color: '#facc15' },
];

const STEPS = [
  { icon: '🔍', text: 'Enter username' },
  { icon: '⚙️', text: 'AI scans your GitHub' },
  { icon: '🦸', text: 'Get your hero match' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export default function LandingHero({ onSubmit, isLoading }: LandingHeroProps) {
  const [input, setInput] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const username = input.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
    if (username) onSubmit(username);
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-16 relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-2xl w-full text-center">

        {/* Badge */}
        <motion.div variants={itemVariants}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-300 text-xs font-bold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse inline-block" />
            GitHub Profile Analyzer
          </span>
        </motion.div>

        {/* Title */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tight">
            Find Your
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              GitHub Hero
            </span>
          </h1>
          <p className="text-white/45 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            Drop any GitHub username — we'll analyze your code, crunch the stats, and reveal which legendary hero you are.
          </p>
        </motion.div>

        {/* How it works */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 sm:gap-4">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-base">{step.icon}</span>
                <span className="text-xs text-white/40 hidden sm:block">{step.text}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-6 sm:w-10 h-px bg-white/10" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Input form */}
        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="w-full"
        >
          <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 font-mono text-sm select-none">
                github.com/
              </span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="torvalds"
                className="w-full pl-[6.5rem] pr-4 py-3.5 rounded-xl bg-transparent text-white placeholder-white/20 font-mono text-base outline-none focus:bg-white/[0.04] transition-all"
                disabled={isLoading}
                autoFocus
              />
            </div>
            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 rounded-xl font-black text-sm sm:text-base bg-gradient-to-r from-cyan-500 to-violet-500 text-white disabled:opacity-35 disabled:cursor-not-allowed transition-all whitespace-nowrap shrink-0"
              style={{ boxShadow: '0 0 28px rgba(139,92,246,0.45), 0 0 56px rgba(34,211,238,0.2)' }}
            >
              {isLoading ? '⏳ Scanning...' : '⚡ Reveal Hero'}
            </motion.button>
          </div>
        </motion.form>

        {/* Quick-try examples */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 flex-wrap justify-center">
          <span className="text-xs text-white/25">Try:</span>
          {['torvalds', 'gaearon', 'sindresorhus', 'tj'].map((name) => (
            <button
              key={name}
              onClick={() => { setInput(name); onSubmit(name); }}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/8 text-white/35 hover:text-white/65 hover:border-white/20 transition-all font-mono"
            >
              @{name}
            </button>
          ))}
        </motion.div>

        {/* Hero character grid */}
        <motion.div variants={itemVariants} className="w-full">
          <p className="text-[10px] text-white/20 tracking-[0.2em] uppercase mb-4">Which hero are you?</p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {HERO_CHARS.map((char, i) => (
              <motion.div
                key={char.emoji}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border bg-white/[0.025] cursor-default"
                style={{ borderColor: char.color + '30' }}
                whileHover={{ scale: 1.08, borderColor: char.color + '80' }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
              >
                <span
                  className="text-2xl"
                  style={{ filter: `drop-shadow(0 0 6px ${char.color}88)` }}
                >
                  {char.emoji}
                </span>
                <span
                  className="text-[9px] font-bold hidden sm:block tracking-wide"
                  style={{ color: char.color + '99' }}
                >
                  {char.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
