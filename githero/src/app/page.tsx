'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import StarfieldBackground from '@/components/StarfieldBackground';
import LandingHero from '@/components/LandingHero';
import ScanningAnimation from '@/components/ScanningAnimation';
import ResultCard from '@/components/ResultCard';
import { Character } from '@/lib/characters';
import { GitHubMetrics, ScoringBreakdown } from '@/lib/scoring';
import { AIAnalysis } from '@/lib/gemini';

type Phase = 'landing' | 'scanning' | 'result' | 'error';

export interface HeroData {
  imageUrl: string;
  publisher: string;
  fullName: string;
  firstAppearance: string;
  apiName: string;
}

interface ResultData {
  user: {
    login: string;
    name: string;
    avatar: string;
    bio: string;
    profileUrl: string;
    joinYear: number;
  };
  character: Character;
  metrics: GitHubMetrics;
  breakdown: ScoringBreakdown;
  powerLabel: string;
  heroData: HeroData | null;
  ai: AIAnalysis | null;
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>('landing');
  const [username, setUsername] = useState('');
  const [result, setResult] = useState<ResultData | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleScan(user: string) {
    setUsername(user);
    setPhase('scanning');
    setErrorMsg('');

    try {
      const res = await fetch(`/api/analyze?username=${encodeURIComponent(user)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed.');
      }

      await new Promise((r) => setTimeout(r, 3200));

      setResult(data);
      setPhase('result');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setErrorMsg(msg);
      setPhase('error');
    }
  }

  function handleReset() {
    setPhase('landing');
    setResult(null);
    setUsername('');
    setErrorMsg('');
  }

  return (
    <main className="relative min-h-screen bg-[#08080f] text-white overflow-x-hidden">
      <StarfieldBackground />
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 font-black text-lg tracking-tight text-white hover:text-cyan-400 transition-colors"
        >
          <span className="text-xl">🦸</span>
          <span>GitHub Hero</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/30 font-mono hidden sm:block">powered by github api</span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        </div>
      </nav>
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {phase === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LandingHero onSubmit={handleScan} isLoading={false} />
            </motion.div>
          )}
          {phase === 'scanning' && (
            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
              <ScanningAnimation username={username} />
            </motion.div>
          )}
          {phase === 'result' && result && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-6">
              <ResultCard
                user={result.user}
                character={result.character}
                metrics={result.metrics}
                breakdown={result.breakdown}
                powerLabel={result.powerLabel}
                heroData={result.heroData}
                ai={result.ai}
                onReset={handleReset}
              />
            </motion.div>
          )}
          {phase === 'error' && (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-6 px-6 text-center">
              <span className="text-6xl">💀</span>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">Analysis Failed</h2>
                <p className="text-white/50 max-w-sm">{errorMsg}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleScan(username)}
                  className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
                  Retry
                </button>
                <button onClick={handleReset}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold hover:opacity-90 transition-all">
                  Go Back
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}


