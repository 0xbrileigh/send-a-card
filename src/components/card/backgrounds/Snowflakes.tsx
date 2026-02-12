'use client';

import { useState, useEffect } from 'react';

const SNOWFLAKE_COUNT = 50;
const SNOWFLAKE_CHARS = ['\u2744\uFE0F', '\u2745', '\u2746', '\u00B7', '\u2022'];

interface SnowflakeData {
  key: number;
  char: string;
  style: React.CSSProperties;
}

export function Snowflakes() {
  const [flakes, setFlakes] = useState<SnowflakeData[]>([]);

  useEffect(() => {
    setFlakes(
      Array.from({ length: SNOWFLAKE_COUNT }, (_, i) => {
        const size = Math.random() * 28 + 10;
        const duration = Math.random() * 8 + 6;
        const delay = i < 20
          ? -(Math.random() * duration)
          : Math.random() * 8;
        const sway = Math.random() * 50 - 25;
        const char = SNOWFLAKE_CHARS[Math.floor(Math.random() * SNOWFLAKE_CHARS.length)];

        return {
          key: i,
          char,
          style: {
            left: `${Math.random() * 100}%`,
            top: '-20px',
            '--snow-size': `${size}px`,
            '--snow-duration': `${duration.toFixed(1)}s`,
            '--snow-delay': `${delay.toFixed(1)}s`,
            '--snow-sway': `${sway.toFixed(0)}px`,
          } as React.CSSProperties,
        };
      })
    );
  }, []);

  return (
    <div className="snowflakes-container" aria-hidden="true">
      {flakes.map(f => (
        <div key={f.key} className="snowflake" style={f.style}>
          {f.char}
        </div>
      ))}
    </div>
  );
}
