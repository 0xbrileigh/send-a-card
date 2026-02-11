'use client';

import { useMemo } from 'react';

interface PhotoSlotProps {
  index: number;
  file: File | null;
  onAdd: () => void;
  onRemove: () => void;
}

export function PhotoSlot({ index, file, onAdd, onRemove }: PhotoSlotProps) {
  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  if (file && previewUrl) {
    return (
      <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt={`Photo ${index + 1}`}
          className="w-full h-full object-cover"
        />
        {/* Remove button overlay */}
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
          aria-label={`Remove photo ${index + 1}`}
        >
          &times;
        </button>
        {/* Replace on click */}
        <button
          type="button"
          onClick={onAdd}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label={`Replace photo ${index + 1}`}
        />
      </div>
    );
  }

  // Empty placeholder slot
  return (
    <button
      type="button"
      onClick={onAdd}
      className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-[#6b9f76] hover:bg-[#6b9f76]/5 transition-colors cursor-pointer"
    >
      {/* Placeholder icon */}
      <svg width="40" height="40" viewBox="0 0 120 120" fill="none" className="text-gray-300">
        <rect width="120" height="120" rx="8" fill="currentColor" fillOpacity="0.2"/>
        <circle cx="45" cy="42" r="10" fill="currentColor" fillOpacity="0.4"/>
        <path d="M20 85 L50 55 L70 75 L85 60 L100 80 V95 C100 97.2 98.2 99 96 99 H24 C21.8 99 20 97.2 20 95 Z" fill="currentColor" fillOpacity="0.4"/>
      </svg>
      <span className="text-xs text-gray-400 font-medium">Add Photo</span>
    </button>
  );
}
