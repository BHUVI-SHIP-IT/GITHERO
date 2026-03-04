'use client';

import { useState, RefObject } from 'react';
import { Character } from '@/lib/characters';

interface ShareButtonProps {
  cardRef: RefObject<HTMLDivElement | null>;
  character: Character;
  score: number;
  username: string;
}

export default function ShareButton({ cardRef, character, score, username }: ShareButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function handleShare() {
    setStatus('loading');

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current!, {
        backgroundColor: '#0a0a0f',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `github-hero-${username}-${character.id}.png`;
      link.href = dataUrl;
      link.click();
      setStatus('done');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  const labels: Record<typeof status, string> = {
    idle: '📸  Save Result Card',
    loading: '⏳  Generating...',
    done: '✅  Saved!',
    error: '❌  Try Again',
  };

  return (
    <button
      onClick={handleShare}
      disabled={status === 'loading'}
      className="flex-1 py-3 rounded-2xl font-black text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      style={{
        background: `linear-gradient(135deg, ${character.colors.primary}, ${character.colors.secondary})`,
        color: '#000',
        boxShadow: status === 'idle' ? `0 0 20px ${character.colors.glow}` : 'none',
      }}
    >
      {labels[status]}
    </button>
  );
}
