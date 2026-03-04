'use client';

import { useRef, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Character } from '@/lib/characters';
import { GitHubMetrics, ScoringBreakdown } from '@/lib/scoring';
import { AIAnalysis } from '@/lib/gemini';
import { HeroData } from '@/app/page';
import PowerMeter from './PowerMeter';
import ShareButton from './ShareButton';

interface UserData {
  login: string;
  name: string;
  avatar: string;
  bio: string;
  profileUrl: string;
  joinYear: number;
}

interface ResultCardProps {
  user: UserData;
  character: Character;
  metrics: GitHubMetrics;
  breakdown: ScoringBreakdown;
  powerLabel: string;
  heroData: HeroData | null;
  ai: AIAnalysis | null;
  onReset: () => void;
}

const UNIVERSE_BADGE: Record<string, string> = {
  Marvel: 'bg-red-600/80 text-white border-red-500',
  DC: 'bg-blue-700/80 text-white border-blue-500',
  Anime: 'bg-purple-700/80 text-white border-purple-500',
};

const STAT_ITEMS = [
  { key: 'repos',     label: 'Repos',     icon: '📦', max: 150,  color: '#22d3ee' },
  { key: 'stars',     label: 'Stars',     icon: '⭐', max: 500,  color: '#facc15' },
  { key: 'followers', label: 'Followers', icon: '👥', max: 500,  color: '#4ade80' },
  { key: 'commits',   label: 'Commits',   icon: '💻', max: 3000, color: '#f97316' },
  { key: 'streak',    label: 'Streak',    icon: '🔥', max: 30,   color: '#ef4444' },
  { key: 'languages', label: 'Languages', icon: '🌐', max: 15,   color: '#c084fc' },
] as const;

export default function ResultCard({
  user,
  character,
  metrics,
  breakdown,
  powerLabel,
  heroData,
  ai,
  onReset,
}: ResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [heroImgError, setHeroImgError] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const langCount = Array.isArray(metrics.languages) ? metrics.languages.length : 0;
  const displayQuote = ai?.personalizedQuote || character.quote;
  const showHeroImage = heroData?.imageUrl && !heroImgError;

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div
        ref={cardRef}
        className="relative rounded-3xl overflow-hidden border bg-[#0c0c14]"
        style={{
          borderColor: character.colors.primary + '60',
          boxShadow: `0 0 40px ${character.colors.glow}, 0 0 80px ${character.colors.glow}44`,
        }}
      >
        {/* Header glow strip */}
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${character.colors.primary}, ${character.colors.secondary}, ${character.colors.primary}, transparent)`,
          }}
        />

        {/* Hero section */}
        <div className={`bg-gradient-to-br ${character.avatar} relative`}>
          <div className="absolute inset-0 bg-black/55" />
          <motion.div
            variants={itemVariants}
            className="relative flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8"
          >
            {/* Character avatar — real image from Superhero API or emoji fallback */}
            <div
              className="relative flex-shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 bg-black/40"
              style={{
                borderColor: character.colors.primary,
                boxShadow: `0 0 30px ${character.colors.glow}`,
              }}
            >
              {showHeroImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={heroData!.imageUrl}
                  alt={character.name}
                  className="w-full h-full object-cover"
                  onError={() => setHeroImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl sm:text-7xl">{character.emoji}</span>
                </div>
              )}
              {/* Orbit ring */}
              <motion.div
                className="absolute inset-0 rounded-full border pointer-events-none"
                style={{ borderColor: character.colors.primary + '50' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            {/* Character info */}
            <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold border tracking-widest ${UNIVERSE_BADGE[character.universe]}`}
                >
                  {heroData?.publisher || character.universe.toUpperCase()}
                </span>
                <span className="text-xs px-3 py-1 rounded-full font-bold border tracking-widest bg-white/10 text-white/70 border-white/20">
                  {powerLabel}
                </span>
                {ai && (
                  <span className="text-xs px-3 py-1 rounded-full font-bold border tracking-widest bg-violet-500/20 text-violet-300 border-violet-500/40">
                    ✨ AI Analyzed
                  </span>
                )}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                {heroData?.apiName || character.name}
              </h2>
              {heroData?.fullName && heroData.fullName !== heroData.apiName && (
                <p className="text-white/40 text-sm">"{heroData.fullName}"</p>
              )}
              <p className="font-bold tracking-wide" style={{ color: character.colors.primary }}>
                {character.archetype}
              </p>
              {heroData?.firstAppearance && (
                <p className="text-white/30 text-xs">First appeared: {heroData.firstAppearance}</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Power meter */}
          <motion.div variants={itemVariants}>
            <PowerMeter score={breakdown.total} label="Developer Power Level" animate />
          </motion.div>

          {/* AI Match Reason — shown only if AI is available */}
          {ai?.matchReason && (
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-4 sm:p-5 border relative overflow-hidden"
              style={{
                borderColor: '#8b5cf6' + '50',
                background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(192,132,252,0.05))',
              }}
            >
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-sm">
                  🤖
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-1">
                    AI Match Analysis
                  </p>
                  <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                    {ai.matchReason}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Description (static) */}
          {!ai?.matchReason && (
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-4 sm:p-5 border bg-white/[0.03]"
              style={{ borderColor: character.colors.primary + '30' }}
            >
              <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                {character.description}
              </p>
            </motion.div>
          )}

          {/* Quote — AI-generated or static */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl p-4 sm:p-5 border"
            style={{
              borderColor: character.colors.secondary + '40',
              backgroundColor: character.colors.primary + '10',
            }}
          >
            <div className="flex gap-3">
              <span className="text-2xl flex-shrink-0">💬</span>
              <div>
                {ai?.personalizedQuote && (
                  <p className="text-xs text-violet-400 font-bold tracking-widest uppercase mb-1">
                    AI Quote — Personalized for @{user.login}
                  </p>
                )}
                <p className="text-white/70 italic text-sm sm:text-base leading-relaxed">
                  {displayQuote}
                </p>
              </div>
            </div>
          </motion.div>

          {/* AI Developer Roast */}
          {ai?.roast && (
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-4 sm:p-5 border"
              style={{
                borderColor: '#f97316' + '40',
                background: 'linear-gradient(135deg, rgba(249,115,22,0.07), rgba(251,191,36,0.05))',
              }}
            >
              <div className="flex gap-3 items-start">
                <span className="text-2xl flex-shrink-0 mt-0.5">🔥</span>
                <div>
                  <p className="text-xs font-bold tracking-widest text-orange-400 uppercase mb-1">
                    Developer Roast
                  </p>
                  <p className="text-white/75 text-sm sm:text-base leading-relaxed">
                    {ai.roast}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Traits */}
          <motion.div variants={itemVariants}>
            <p className="text-xs tracking-widest text-white/40 uppercase mb-3">Dev Traits</p>
            <div className="flex flex-wrap gap-2">
              {character.traits.map((trait) => (
                <span
                  key={trait}
                  className="px-3 py-1.5 rounded-full text-xs font-bold border"
                  style={{
                    color: character.colors.primary,
                    borderColor: character.colors.primary + '50',
                    backgroundColor: character.colors.primary + '15',
                  }}
                >
                  {trait}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="border-t border-white/10" />

          {/* GitHub Stats */}
          <motion.div variants={itemVariants}>
            <p className="text-xs tracking-widest text-white/40 uppercase mb-4">GitHub Stats</p>
            <div className="grid grid-cols-3 gap-3">
              {STAT_ITEMS.map((s) => {
                const val =
                  s.key === 'languages'
                    ? langCount
                    : (metrics[s.key as keyof typeof metrics] as number);
                const pct = Math.min(((val ?? 0) / s.max) * 100, 100);
                return (
                  <div
                    key={s.key}
                    className="rounded-xl p-3 border bg-white/[0.03] relative overflow-hidden flex flex-col gap-1.5"
                    style={{ borderColor: s.color + '35' }}
                  >
                    {/* Subtle glow bg */}
                    <div
                      className="absolute inset-0 opacity-[0.06] pointer-events-none"
                      style={{ background: `radial-gradient(circle at 30% 30%, ${s.color}, transparent 70%)` }}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-lg leading-none">{s.icon}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: s.color + 'aa' }}>
                        {s.label}
                      </span>
                    </div>
                    <div className="text-xl font-black text-white leading-none">
                      {(val ?? 0).toLocaleString()}
                    </div>
                    {/* Progress bar */}
                    <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${pct}%`, background: s.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Top languages */}
          {Array.isArray(metrics.languages) && metrics.languages.length > 0 && (
            <motion.div variants={itemVariants}>
              <p className="text-xs tracking-widest text-white/40 uppercase mb-3">Top Languages</p>
              <div className="flex flex-wrap gap-2">
                {metrics.languages.slice(0, 8).map((lang) => (
                  <span
                    key={lang}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono border border-white/10 bg-white/5 text-white/70"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* User profile link */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.02]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatar}
              alt={user.login}
              className="w-12 h-12 rounded-full border-2"
              style={{ borderColor: character.colors.primary + '60' }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white truncate">{user.name}</p>
              <p className="text-white/40 text-sm truncate">
                @{user.login} • Joined {user.joinYear}
              </p>
              {user.bio && (
                <p className="text-white/50 text-xs truncate mt-0.5">{user.bio}</p>
              )}
            </div>
            <a
              href={user.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-xs px-3 py-2 rounded-xl border font-bold transition-all hover:scale-105"
              style={{
                color: character.colors.primary,
                borderColor: character.colors.primary + '50',
                backgroundColor: character.colors.primary + '15',
              }}
            >
              GitHub ↗
            </a>
          </motion.div>

          {/* Action buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
            <ShareButton
              cardRef={cardRef}
              character={character}
              score={breakdown.total}
              username={user.login}
            />
            <button
              onClick={onReset}
              className="flex-1 py-3 rounded-2xl border border-white/10 text-white/60 font-bold text-sm hover:bg-white/5 hover:text-white/80 transition-all"
            >
              ↩ Scan Another
            </button>
          </motion.div>
        </div>

        {/* Bottom glow strip */}
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${character.colors.secondary}, ${character.colors.primary}, ${character.colors.secondary}, transparent)`,
          }}
        />
      </div>
    </motion.div>
  );
}
