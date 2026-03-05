'use client';

import { useRef, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Character } from '@/lib/characters';
import { GitHubMetrics, ScoringBreakdown } from '@/lib/scoring';
import { AIAnalysis } from '@/lib/gemini';
import { HeroData } from '@/app/page';
import PowerMeter from './PowerMeter';
import ShareButton from './ShareButton';
import AchievementBadges from './AchievementBadges';
import CodingStatsPanel from './CodingStatsPanel';
import DevTreasureChest from './DevTreasureChest';

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

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

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
  const heroCardRef = useRef<HTMLDivElement>(null);
  const [heroImgError, setHeroImgError] = useState(false);

  const displayQuote = ai?.personalizedQuote || character.quote;
  const showHeroImage = heroData?.imageUrl && !heroImgError;

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8" ref={cardRef}>
      {/* ── Top stat bar ── */}
      <motion.div
        custom={0}
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between mb-6 px-4 py-3 rounded-2xl border border-white/[0.07] bg-[#0d0d14]/80 backdrop-blur"
      >
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={user.avatar} alt={user.login} className="w-8 h-8 rounded-full border border-white/20" />
          <div>
            <p className="text-xs font-black text-white leading-none">{user.name || user.login}</p>
            <p className="text-[9px] text-white/35 font-mono">@{user.login} · {user.joinYear}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.07] bg-white/[0.03]">
            <span className="text-sm">⭐</span>
            <span className="text-sm font-black text-white tabular-nums">{metrics.stars.toLocaleString()}</span>
            <span className="text-[9px] text-white/30 uppercase tracking-wider">stars</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.07] bg-white/[0.03]">
            <span className="text-sm">🔥</span>
            <span className="text-sm font-black text-white tabular-nums">{metrics.commits.toLocaleString()}</span>
            <span className="text-[9px] text-white/30 uppercase tracking-wider">commits</span>
          </div>
          <a
            href={user.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] px-3 py-1.5 rounded-xl border font-bold transition-all hover:scale-105 hidden sm:block"
            style={{
              color: character.colors.primary,
              borderColor: character.colors.primary + '50',
              backgroundColor: character.colors.primary + '12',
            }}
          >
            GitHub ↗
          </a>
        </div>
      </motion.div>

      {/* ── Main 3-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-start">

        {/* ── LEFT COLUMN: Badges + Treasure ── */}
        <div className="flex flex-col gap-4">
          <motion.div
            custom={1}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            className="game-panel p-5"
            style={{ borderColor: character.colors.primary + '30' }}
          >
            <AchievementBadges metrics={metrics} score={breakdown.total} characterColor={character.colors.primary} />
          </motion.div>
          <motion.div
            custom={3}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            className="game-panel p-5"
            style={{ borderColor: character.colors.secondary + '30' }}
          >
            <DevTreasureChest metrics={metrics} score={breakdown.total} characterColor={character.colors.primary} />
          </motion.div>
        </div>

        {/* ── CENTER COLUMN: Hero Card ── */}
        <motion.div
          custom={2}
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          className="w-full lg:w-[360px] flex-shrink-0"
        >
          <div
            ref={heroCardRef}
            data-hero-card="true"
            className="relative rounded-3xl overflow-hidden border bg-[#0c0c16]"
            style={{
              borderColor: character.colors.primary + '70',
              boxShadow: `0 0 50px ${character.colors.glow}, 0 0 100px ${character.colors.glow}33`,
            }}
          >
        {/* Top color strip */}
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${character.colors.primary}, ${character.colors.secondary}, ${character.colors.primary}, transparent)`,
          }}
        />

        {/* Hero gradient section */}
        <div className={`bg-gradient-to-br ${character.avatar} relative`}>
          <div className="absolute inset-0 bg-black/50" />

          {/* YOU ARE… badge */}
          <div className="relative flex justify-center pt-4 pb-2">
            <span className="text-[9px] font-black tracking-[0.3em] text-white/50 uppercase border border-white/15 rounded-full px-4 py-1 bg-black/30">
              You are…
            </span>
          </div>

          {/* Character avatar */}
          <div className="relative flex justify-center pb-2">
            <motion.div
              className="relative w-32 h-32 rounded-full overflow-hidden border-4 bg-black/40"
              style={{
                borderColor: character.colors.primary,
                boxShadow: `0 0 40px ${character.colors.glow}, 0 0 70px ${character.colors.glow}44`,
              }}
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 16 }}
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
                  <span className="text-7xl">{character.emoji}</span>
                </div>
              )}
              <motion.div
                className="absolute inset-0 rounded-full border-2 pointer-events-none"
                style={{ borderColor: character.colors.primary + '55', borderStyle: 'dashed' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
          </div>

          {/* Universe + power badges */}
          <div className="relative flex justify-center gap-2 pb-4 flex-wrap px-4">
            <span className={`text-[9px] px-2.5 py-1 rounded-full font-black border tracking-widest uppercase ${UNIVERSE_BADGE[character.universe]}`}>
              {heroData?.publisher || character.universe}
            </span>
            <span
              className="text-[9px] px-2.5 py-1 rounded-full font-black border tracking-widest uppercase"
              style={{
                background: character.colors.primary + '25',
                color: character.colors.primary,
                borderColor: character.colors.primary + '60',
              }}
            >
              {powerLabel}
            </span>

          </div>
        </div>

        {/* Hero name + archetype */}
        <div className="px-6 pt-5 pb-2 text-center">
          <motion.h1
            className="text-3xl font-black text-white leading-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {heroData?.apiName || character.name}
          </motion.h1>
          {heroData?.fullName && heroData.fullName !== heroData.apiName && (
            <p className="text-white/30 text-xs mt-0.5">"{heroData.fullName}"</p>
          )}
          <motion.p
            className="mt-1 text-sm font-bold tracking-wide"
            style={{ color: character.colors.primary }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
          >
            {character.archetype}
          </motion.p>
          {heroData?.firstAppearance && (
            <p className="text-white/25 text-[9px] mt-0.5">First appeared: {heroData.firstAppearance}</p>
          )}
        </div>

        {/* Power meter */}
        <div className="px-6 py-4">
          <PowerMeter score={breakdown.total} label="Power Level" animate />
        </div>

        {/* OVER 9000 label */}
        {breakdown.total >= 90 && (
          <motion.p
            className="text-center text-xs font-black tracking-[0.3em] uppercase pb-2"
            style={{ color: character.colors.secondary }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ⚡ Over 9000!
          </motion.p>
        )}

        {/* Quote */}
        <div
          className="mx-4 mb-4 p-4 rounded-2xl border"
          style={{
            borderColor: character.colors.primary + '30',
            background: character.colors.primary + '0a',
          }}
        >
          {ai?.personalizedQuote && (
            <p className="text-[9px] text-violet-400 font-black tracking-widest uppercase mb-1">
              AI Quote for @{user.login}
            </p>
          )}
          <p className="text-white/65 italic text-xs leading-relaxed text-center">
            "{displayQuote.replace(/^"|"$/g, '').trim()}"
          </p>
        </div>

        {/* AI roast */}
        {ai?.roast && (
          <div
            className="mx-4 mb-4 p-3 rounded-2xl border flex gap-2 items-start"
            style={{
              borderColor: '#f97316' + '35',
              background: 'rgba(249,115,22,0.06)',
            }}
          >
            <span className="text-base flex-shrink-0">🔥</span>
            <div>
              <p className="text-[9px] font-black tracking-widest text-orange-400 uppercase mb-0.5">Dev Roast</p>
              <p className="text-white/65 text-xs leading-relaxed">{ai.roast}</p>
            </div>
          </div>
        )}

        {/* Traits row */}
        <div className="px-6 pb-4">
          <p className="text-[9px] tracking-widest text-white/30 uppercase mb-2">Dev Traits</p>
          <div className="flex flex-wrap gap-1.5">
            {character.traits.map((trait) => (
              <span
                key={trait}
                className="px-2.5 py-1 rounded-full text-[9px] font-black border uppercase tracking-wide"
                style={{
                  color: character.colors.primary,
                  borderColor: character.colors.primary + '45',
                  backgroundColor: character.colors.primary + '12',
                }}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* AI match reason */}
        {ai?.matchReason && (
          <div
            className="mx-4 mb-4 p-3 rounded-2xl border flex gap-2 items-start"
            style={{
              borderColor: '#8b5cf6' + '40',
              background: 'rgba(139,92,246,0.07)',
            }}
          >
            <span className="text-base flex-shrink-0">🤖</span>
            <div>
              <p className="text-[9px] font-black tracking-widest text-violet-400 uppercase mb-0.5">AI Analysis</p>
              <p className="text-white/70 text-xs leading-relaxed">{ai.matchReason}</p>
            </div>
          </div>
        )}

        {/* Bottom color strip */}
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${character.colors.secondary}, ${character.colors.primary}, ${character.colors.secondary}, transparent)`,
          }}
        />
          </div>

          {/* Action buttons below center card */}
          <div className="flex gap-3 mt-4">
            <ShareButton
              cardRef={heroCardRef}
              character={character}
              score={breakdown.total}
              username={user.login}
            />
            <button
              onClick={onReset}
              className="flex-1 py-3 rounded-2xl border border-white/10 text-white/55 font-black text-sm hover:bg-white/5 hover:text-white/80 transition-all uppercase tracking-wider"
            >
              ↩ Try Again?
            </button>
          </div>

          {/* Rank badge */}
          <div className="flex justify-center mt-3">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full border"
              style={{ borderColor: character.colors.primary + '35', background: character.colors.primary + '0d' }}
            >
              <span className="text-sm">🏅</span>
              <div>
                <p className="text-[9px] text-white/30 uppercase tracking-widest">Rank</p>
                <p className="text-xs font-black" style={{ color: character.colors.primary }}>
                  Hero #{breakdown.total}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT COLUMN: Stats Panel ── */}
        <div className="flex flex-col gap-4">
          <motion.div
            custom={1}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            className="game-panel p-5"
            style={{ borderColor: character.colors.secondary + '30' }}
          >
            <CodingStatsPanel metrics={metrics} breakdown={breakdown} characterColor={character.colors.primary} />
          </motion.div>

          <motion.div
            custom={3}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            className="game-panel p-5"
            style={{ borderColor: character.colors.primary + '20' }}
          >
            <span className="game-label mb-4 block">Progress</span>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Commit Mastery', score: breakdown.commitScore,   max: 20, color: '#f97316' },
                { label: 'Star Power',     score: breakdown.starScore,     max: 25, color: '#facc15' },
                { label: 'Repo Kingdom',   score: breakdown.repoScore,     max: 20, color: '#22d3ee' },
                { label: 'Language Arts',  score: breakdown.languageScore, max: 10, color: '#c084fc' },
                { label: 'Influence',      score: breakdown.followerScore, max: 15, color: '#4ade80' },
                { label: 'Daily Grind',    score: breakdown.streakScore,   max: 10, color: '#ef4444' },
              ].map((item) => {
                const pct = Math.min((item.score / item.max) * 100, 100);
                const lvl = Math.max(1, Math.ceil((pct / 100) * 14));
                return (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-white/45 uppercase tracking-wide w-[100px] flex-shrink-0">
                      {item.label}
                    </span>
                    <div className="flex gap-[2px] flex-1">
                      {Array.from({ length: 12 }).map((_, j) => (
                        <motion.div
                          key={j}
                          className="h-2 flex-1 rounded-[2px]"
                          initial={{ opacity: 0.08 }}
                          animate={{ opacity: j < Math.round((pct / 100) * 12) ? 1 : 0.1 }}
                          transition={{ delay: j * 0.03 + 0.4 }}
                          style={{
                            background: j < Math.round((pct / 100) * 12) ? item.color : 'rgba(255,255,255,0.05)',
                            boxShadow: j < Math.round((pct / 100) * 12) ? `0 0 3px ${item.color}88` : 'none',
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] font-black w-10 text-right flex-shrink-0" style={{ color: item.color + 'aa' }}>
                      LVL {lvl}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
