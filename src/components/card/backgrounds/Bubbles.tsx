'use client';

import { useMemo } from 'react';

const BUBBLE_COUNT = 30;

export function Bubbles() {
  const bubbles = useMemo(() => {
    return Array.from({ length: BUBBLE_COUNT }, (_, i) => {
      const size = Math.random() * 70 + 10;
      const duration = Math.random() * 9 + 6;
      const delay = i < 10
        ? -(Math.random() * duration)
        : Math.random() * 8;
      const sway = Math.random() * 80 - 40;

      return {
        key: i,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${Math.random() * 100}%`,
          bottom: `-${size}px`,
          '--bubble-duration': `${duration.toFixed(1)}s`,
          '--bubble-delay': `${delay.toFixed(1)}s`,
          '--bubble-sway': `${sway.toFixed(0)}px`,
        } as React.CSSProperties,
      };
    });
  }, []);

  return (
    <div className="bubbles-container" aria-hidden="true">
      {bubbles.map(b => (
        <div key={b.key} className="bubble" style={b.style} />
      ))}
    </div>
  );
}
