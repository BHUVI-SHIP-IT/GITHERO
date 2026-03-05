'use client';

import { useState, RefObject } from 'react';
import { Character } from '@/lib/characters';

interface ShareButtonProps {
  cardRef: RefObject<HTMLDivElement | null>;
  character: Character;
  score: number;
  username: string;
}

async function srcToDataUrl(src: string): Promise<string> {
  const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(src)}`;
  const res = await fetch(proxyUrl);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function ShareButton({ cardRef, character, score, username }: ShareButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function handleShare() {
    setStatus('loading');

    try {
      const { toPng } = await import('html-to-image');
      const el = cardRef.current!;

      // Replace all cross-origin img srcs with data URLs to avoid canvas taint
      const imgs = Array.from(el.querySelectorAll('img')) as HTMLImageElement[];
      const origSrcs = imgs.map((img) => img.src);

      await Promise.all(
        imgs.map(async (img) => {
          try {
            if (img.src && img.src.startsWith('http')) {
              img.src = await srcToDataUrl(img.src);
            }
          } catch {
            // keep original src if proxy fails
          }
        })
      );

      const dataUrl = await toPng(el, {
        cacheBust: true,
        backgroundColor: '#0c0c16',
        pixelRatio: 2,
        skipFonts: false,
        filter: (node) => node.tagName !== 'SCRIPT',
      });

      // Restore original srcs
      imgs.forEach((img, i) => { img.src = origSrcs[i]; });

      const link = document.createElement('a');
      link.download = `github-hero-${username}-${character.id}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setStatus('done');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('Share error:', err instanceof Error ? err.message : err);
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
