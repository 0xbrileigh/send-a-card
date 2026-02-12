'use client';

import { useState, useEffect } from 'react';

const HEART_COUNT = 40;
const HEART_CHARS = ['❤️'];

interface HeartData {
  key: number;
  char: string;
  style: React.CSSProperties;
}

export function Hearts() {
  const [hearts, setHearts] = useState<HeartData[]>([]);

  useEffect(() => {
    setHearts(
      Array.from({ length: HEART_COUNT }, (_, i) => {
        const size = Math.random() * 34 + 14;
        const duration = Math.random() * 9 + 6;
        const delay = i < 15
          ? -(Math.random() * duration)
          : Math.random() * 8;
        const sway = Math.random() * 60 - 30;
        const rotate = Math.random() * 40 - 20;
        const char = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];

        return {
          key: i,
          char,
          style: {
            left: `${Math.random() * 100}%`,
            bottom: `-${size + 10}px`,
            '--heart-size': `${size}px`,
            '--heart-duration': `${duration.toFixed(1)}s`,
            '--heart-delay': `${delay.toFixed(1)}s`,
            '--heart-sway': `${sway.toFixed(0)}px`,
            '--heart-rotate': `${rotate.toFixed(0)}deg`,
          } as React.CSSProperties,
        };
      })
    );
  }, []);

  return (
    <div className="hearts-container" aria-hidden="true">
      {hearts.map(h => (
        <div key={h.key} className="heart" style={h.style}>
          {h.char}
        </div>
      ))}
    </div>
  );
}
