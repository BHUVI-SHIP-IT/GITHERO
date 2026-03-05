'use client';

import { motion } from 'framer-motion';
import { GitHubMetrics } from '@/lib/scoring';

interface Badge {
  id: string;
  icon: string;
  label: string;
  desc: string;
  unlocked: boolean;
  color: string;
}

function getBadges(metrics: GitHubMetrics, score: number): Badge[] {
  return [
    {
      id: 'streak',
      icon: '🔥',
      label: '100 Day Streak',
      desc: `${metrics.streak}d streak`,
      unlocked: metrics.streak >= 5,
      color: '#ef4444',
    },
    {
      id: 'speed',
      icon: '⚡',
      label: 'Speed Coder',
      desc: `${metrics.commits.toLocaleString()} commits`,
      unlocked: metrics.commits >= 200,
      color: '#facc15',
    },
    {
      id: 'slayer',
      icon: '🧠',
      label: 'Bug Slayer',
      desc: 'High commit volume',
      unlocked: metrics.commits >= 500,
      color: '#22d3ee',
    },
    {
      id: 'repos',
      icon: '🚀',
      label: 'Repo Creator',
      desc: `${metrics.repos} repos`,
      unlocked: metrics.repos >= 15,
      color: '#4ade80',
    },
    {
      id: 'oss',
      icon: '🌍',
      label: 'Open Source Hero',
      desc: `${metrics.stars} stars`,
      unlocked: metrics.stars >= 50,
      color: '#f97316',
    },
    {
      id: 'polyglot',
      icon: '🌐',
      label: 'Polyglot',
      desc: `${metrics.languages.length} languages`,
      unlocked: metrics.languages.length >= 5,
      color: '#c084fc',
    },
    {
      id: 'legend',
      icon: '🏆',
      label: 'Elite Dev',
      desc: `Power ${score}/100`,
      unlocked: score >= 75,
      color: '#fbbf24',
    },
    {
      id: 'influencer',
      icon: '👑',
      label: 'Code Influencer',
      desc: `${metrics.followers} followers`,
      unlocked: metrics.followers >= 50,
      color: '#e879f9',
    },
  ];
}

interface AchievementBadgesProps {
  metrics: GitHubMetrics;
  score: number;
  characterColor: string;
}

export default function AchievementBadges({ metrics, score }: AchievementBadgesProps) {
  const badges = getBadges(metrics, score);
  const unlocked = badges.filter((b) => b.unlocked).length;

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <span className="game-label">Dev Badges</span>
        <span className="text-[10px] font-black text-white/35 tracking-wider">
          {unlocked}/{badges.length}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 260, damping: 20 }}
            className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
              badge.unlocked
                ? 'bg-white/[0.05]'
                : 'bg-white/[0.015] opacity-30 grayscale'
            }`}
            style={badge.unlocked ? { borderColor: badge.color + '55' } : { borderColor: 'rgba(255,255,255,0.06)' }}
            whileHover={badge.unlocked ? { scale: 1.06, borderColor: badge.color + '99' } : {}}
          >
            {/* Background glow */}
            {badge.unlocked && (
              <div
                className="absolute inset-0 rounded-xl opacity-[0.08] pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 20%, ${badge.color}, transparent 70%)` }}
              />
            )}

            {/* Icon */}
            <span
              className="text-[1.6rem] leading-none relative z-10"
              style={badge.unlocked ? { filter: `drop-shadow(0 0 10px ${badge.color}cc)` } : {}}
            >
              {badge.icon}
            </span>

            {/* Label */}
            <span className="text-[9px] font-black text-white/80 leading-tight tracking-wide uppercase relative z-10">
              {badge.label}
            </span>

            {/* Desc */}
            <span className="text-[8px] text-white/35 relative z-10">{badge.desc}</span>

            {/* Unlock tick */}
            {badge.unlocked && (
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#080810]"
                style={{ background: badge.color }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.06 + 0.25, type: 'spring' }}
              >
                <span className="text-[7px] font-black text-black leading-none">✓</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Unlock progress bar */}
      <div className="mt-auto">
        <div className="flex justify-between mb-1">
          <span className="text-[9px] text-white/25 font-bold uppercase tracking-widest">Badge Progress</span>
          <span className="text-[9px] text-white/25 font-bold">{Math.round((unlocked / badges.length) * 100)}%</span>
        </div>
        <div className="flex gap-[3px]">
          {badges.map((b, i) => (
            <motion.div
              key={b.id}
              className="h-1.5 flex-1 rounded-sm"
              initial={{ opacity: 0.08 }}
              animate={{ opacity: b.unlocked ? 1 : 0.1 }}
              transition={{ delay: i * 0.06 + 0.5 }}
              style={{ background: b.unlocked ? b.color : 'rgba(255,255,255,0.08)' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
