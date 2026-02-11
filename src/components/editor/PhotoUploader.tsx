'use client';

import { useRef } from 'react';
import { PhotoSlot } from './PhotoSlot';
import { MAX_PHOTOS } from '@/lib/types';

interface PhotoUploaderProps {
  photos: File[];
  onChange: (files: File[]) => void;
}

export function PhotoUploader({ photos, onChange }: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addIndexRef = useRef<number>(0);

  const handleAddPhoto = (index: number) => {
    addIndexRef.current = index;
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newPhotos = [...photos];
    const idx = addIndexRef.current;

    if (idx < newPhotos.length) {
      // Replace existing
      newPhotos[idx] = file;
    } else {
      // Add new
      newPhotos.push(file);
    }

    onChange(newPhotos);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onChange(newPhotos);
  };

  // Render 4 slots: filled ones show preview, empty ones show placeholder
  const slots = Array.from({ length: MAX_PHOTOS }, (_, i) => ({
    index: i,
    file: photos[i] || null,
  }));

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />
      <div className="grid grid-cols-2 gap-3">
        {slots.map(slot => (
          <PhotoSlot
            key={slot.index}
            index={slot.index}
            file={slot.file}
            onAdd={() => handleAddPhoto(slot.index)}
            onRemove={() => handleRemovePhoto(slot.index)}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">
        JPG, PNG, WebP, or GIF. Max 5MB each.
      </p>
    </div>
  );
}
