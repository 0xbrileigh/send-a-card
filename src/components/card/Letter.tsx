'use client';

import { memo } from 'react';

interface LetterProps {
  occasion: string;
  message: string;
  fromName: string;
}

export const Letter = memo(function Letter({
  occasion,
  message,
  fromName,
}: LetterProps) {
  return (
    <div className="letter">
      {occasion && <h1 className="occasion">{occasion}</h1>}
      {message && <p className="message">{message}</p>}
      {fromName && <p className="from">{fromName}</p>}
    </div>
  );
});
