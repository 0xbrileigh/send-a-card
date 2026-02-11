'use client';

import type { AnimationType } from '@/lib/types';

interface AnimationPickerProps {
  value: AnimationType;
  onChange: (value: AnimationType) => void;
}

const OPTIONS: { value: AnimationType; label: string; icon: string }[] = [
  { value: 'none', label: 'None', icon: '✕' },
  { value: 'confetti', label: 'Confetti', icon: '🎊' },
  { value: 'hearts', label: 'Hearts', icon: '💕' },
  { value: 'snowflakes', label: 'Snow', icon: '❄️' },
];

export function AnimationPicker({ value, onChange }: AnimationPickerProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-2">Background Animation</h2>
      <div className="flex gap-2">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border transition-all text-sm ${
              value === opt.value
                ? 'border-gray-600 bg-gray-100 text-gray-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            <span className="text-lg">{opt.icon}</span>
            <span className="text-xs font-medium">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
