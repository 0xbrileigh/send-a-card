'use client';

import { useState, useCallback, useMemo } from 'react';
import { PHOTO_PRESETS, PRESENT_COLORS } from '@/lib/types';

interface PresentBoxProps {
  photoUrl: string;
  index: number;
  isOpen: boolean;
  onPhotoClick: (src: string, alt: string) => void;
  /** When true, photos start already unwrapped (builder preview mode) */
  previewMode?: boolean;
}

export function PresentBox({ photoUrl, index, isOpen, onPhotoClick, previewMode }: PresentBoxProps) {
  const [unwrapped, setUnwrapped] = useState(previewMode ?? false);

  const preset = PHOTO_PRESETS[index];
  const colors = PRESENT_COLORS[index % PRESENT_COLORS.length];

  // Random float animation values (stable per-mount)
  const floatValues = useMemo(() => ({
    duration: (3 + Math.random() * 2).toFixed(1),
    delay: (Math.random() * -5).toFixed(1),
  }), []);

  const handleClick = useCallback(() => {
    if (!isOpen) return;
    if (unwrapped) {
      onPhotoClick(photoUrl, `Photo ${index + 1}`);
      return;
    }
    setUnwrapped(true);
  }, [isOpen, unwrapped, photoUrl, index, onPhotoClick]);

  if (!preset) return null;

  const style: Record<string, string> = {
    '--photo-rotate': preset.rotate,
    '--photo-delay': preset.delay,
    '--present-bg': colors.bg,
    '--present-bg-dark': colors.bgDark,
    '--present-ribbon': colors.ribbon,
    '--float-duration': `${floatValues.duration}s`,
    '--float-delay': `${floatValues.delay}s`,
  };

  if (preset.top) style.top = preset.top;
  if (preset.bottom) style.bottom = preset.bottom;
  if (preset.left) style.left = preset.left;
  if ('right' in preset && preset.right) style.right = preset.right;

  return (
    <div
      className={`present-box ${unwrapped ? 'unwrapped' : ''}`}
      data-present={index}
      style={style as React.CSSProperties}
      onClick={handleClick}
    >
      {/* Lid with ribbon and bow */}
      <div className="present-lid">
        <div className="present-ribbon-v-lid" />
        <div className="present-bow">
          <div className="present-bow-knot" />
        </div>
      </div>

      {/* Body with ribbons */}
      <div className="present-body">
        <div className="present-ribbon-h" />
        <div className="present-ribbon-v" />
      </div>

      {/* Photo frame */}
      <div className="photo-frame">
        <img
          src={photoUrl}
          alt={`Photo ${index + 1}`}
          loading="lazy"
        />
      </div>
    </div>
  );
}
