'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  dx: number;
  dy: number;
}

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    const stars: Star[] = [];
    const NUM_STARS = 180;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createStar(): Star {
      return {
        x: Math.random() * (canvas?.width ?? window.innerWidth),
        y: Math.random() * (canvas?.height ?? window.innerHeight),
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.7 + 0.1,
        speed: Math.random() * 0.4 + 0.05,
        dx: (Math.random() - 0.5) * 0.2,
        dy: Math.random() * 0.3 + 0.05,
      };
    }

    resize();
    for (let i = 0; i < NUM_STARS; i++) stars.push(createStar());

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.fill();

        s.x += s.dx;
        s.y += s.speed;
        s.alpha += (Math.random() - 0.5) * 0.02;
        s.alpha = Math.max(0.05, Math.min(0.9, s.alpha));

        if (s.y > canvas.height) {
          s.y = 0;
          s.x = Math.random() * canvas.width;
        }
        if (s.x < 0 || s.x > canvas.width) s.dx *= -1;
      });

      animFrameId = requestAnimationFrame(draw);
    }

    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
