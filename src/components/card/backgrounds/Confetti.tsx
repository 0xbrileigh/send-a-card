'use client';

import { useMemo } from 'react';

const CONFETTI_COUNT = 55;
const CONFETTI_COLORS = ['#ff6b6b', '#ffd700', '#4ecdc4', '#7c5cbf', '#e74c6f'];
const CONFETTI_SHAPES = ['rectangle', 'circle'] as const;

export function Confetti() {
  const pieces = useMemo(() => {
    return Array.from({ length: CONFETTI_COUNT }, (_, i) => {
      const size = Math.random() * 16 + 8; // 8-24px
      const duration = Math.random() * 8 + 4; // 4-12s
      const delay = i < 22
        ? -(Math.random() * duration) // pre-animated so screen isn't empty on load
        : Math.random() * 8;
      const sway = Math.random() * 60 - 30;
      const rotate = Math.random() * 360;
      const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      const shape = CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)];
      // Rectangles are taller than wide for a confetti-strip look
      const width = shape === 'rectangle' ? size * 0.4 : size;
      const height = size;

      return {
        key: i,
        style: {
          left: `${Math.random() * 100}%`,
          top: '-30px',
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: color,
          borderRadius: shape === 'circle' ? '50%' : '2px',
          '--confetti-duration': `${duration.toFixed(1)}s`,
          '--confetti-delay': `${delay.toFixed(1)}s`,
          '--confetti-sway': `${sway.toFixed(0)}px`,
          '--confetti-rotate': `${rotate.toFixed(0)}deg`,
        } as React.CSSProperties,
      };
    });
  }, []);

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map(p => (
        <div key={p.key} className="confetti-piece" style={p.style} />
      ))}
    </div>
  );
}
