'use client';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const PRESETS: Record<string, string[]> = {
  Background: ['#6b9f76', '#12a4e0', '#e74c6f', '#7c5cbf', '#e8a838', '#2c3e50'],
  Text: ['#000000', '#5a3e2b', '#333333', '#1a1a2e', '#2c3e50', '#4a4a4a'],
};

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const swatches = PRESETS[label] || PRESETS.Background;

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-1.5">
        {swatches.map(color => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
              value === color ? 'border-gray-800 scale-110' : 'border-gray-200'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`${label} color ${color}`}
          />
        ))}
        {/* Custom color input */}
        <label className="relative w-6 h-6 rounded-full border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400 transition-colors overflow-hidden">
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">+</span>
        </label>
      </div>
    </div>
  );
}
