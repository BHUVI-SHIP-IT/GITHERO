'use client';

import { motion } from 'framer-motion';
import { ScoringBreakdown, GitHubMetrics } from '@/lib/scoring';

interface CodingStatsPanelProps {
  metrics: GitHubMetrics;
  breakdown: ScoringBreakdown;
  characterColor: string;
}

export default function CodingStatsPanel({ metrics, breakdown, characterColor }: CodingStatsPanelProps) {
  const stats = [
    {
      label: 'Commit Power',
      value: breakdown.commitScore,
      max: 20,
      icon: '💻',
      rawValue: metrics.commits,
      rawSuffix: ' commits',
      color: '#f97316',
    },
    {
      label: 'Repository Skill',
      value: breakdown.repoScore,
      max: 20,
      icon: '📦',
      rawValue: metrics.repos,
      rawSuffix: ' repos',
      color: '#22d3ee',
    },
    {
      label: 'Star Reputation',
      value: breakdown.starScore,
      max: 25,
      icon: '⭐',
      rawValue: metrics.stars,
      rawSuffix: ' stars',
      color: '#facc15',
    },
    {
      label: 'Language Mastery',
      value: breakdown.languageScore,
      max: 10,
      icon: '🌐',
      rawValue: metrics.languages.length,
      rawSuffix: ' langs',
      color: '#c084fc',
    },
    {
      label: 'Open Source Aura',
      value: breakdown.followerScore,
      max: 15,
      icon: '🌍',
      rawValue: metrics.followers,
      rawSuffix: ' followers',
      color: '#4ade80',
    },
    {
      label: 'Streak Intensity',
      value: breakdown.streakScore,
      max: 10,
      icon: '🔥',
      rawValue: metrics.streak,
      rawSuffix: 'd streak',
      color: '#ef4444',
    },
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <span className="game-label">Coding Stats</span>
        <span className="text-[9px] font-bold text-white/25 uppercase tracking-widest">Skill Breakdown</span>
      </div>

      <div className="flex flex-col gap-3">
        {stats.map((stat, i) => {
          const pct = Math.min((stat.value / stat.max) * 100, 100);
          const lvl = Math.ceil((pct / 100) * 10);
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: 'easeOut' }}
              className="flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm leading-none">{stat.icon}</span>
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-wide">{stat.label}</span>
                </div>
                <span
                  className="text-[9px] font-black tracking-widest uppercase"
                  style={{ color: stat.color + 'aa' }}
                >
                  LVL {lvl}
                </span>
              </div>

              {/* Segmented bar like the reference image */}
              <div className="flex gap-[2px] items-center">
                {Array.from({ length: 14 }).map((_, j) => {
                  const filled = j < Math.round((pct / 100) * 14);
                  return (
                    <motion.div
                      key={j}
                      className="h-2.5 flex-1 rounded-[2px]"
                      initial={{ opacity: 0.08, scaleY: 0.5 }}
                      animate={{
                        opacity: filled ? 1 : 0.1,
                        scaleY: 1,
                      }}
                      transition={{ delay: i * 0.07 + j * 0.025 + 0.2 }}
                      style={{
                        background: filled ? stat.color : 'rgba(255,255,255,0.06)',
                        boxShadow: filled ? `0 0 4px ${stat.color}99` : 'none',
                      }}
                    />
                  );
                })}
                <span
                  className="ml-2 text-[10px] font-black tabular-nums w-7 text-right"
                  style={{ color: stat.color }}
                >
                  {stat.rawValue.toLocaleString()}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Top language pills */}
      {metrics.languages.length > 0 && (
        <div className="mt-auto pt-2 border-t border-white/[0.06]">
          <span className="text-[9px] text-white/25 uppercase tracking-widest font-bold mb-2 block">Languages Used</span>
          <div className="flex flex-wrap gap-1.5">
            {metrics.languages.slice(0, 6).map((lang) => (
              <span
                key={lang}
                className="text-[9px] px-2 py-0.5 rounded-md border border-white/10 bg-white/[0.04] text-white/55 font-mono font-bold"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
