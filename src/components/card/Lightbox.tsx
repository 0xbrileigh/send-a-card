'use client';

import { useEffect, useCallback } from 'react';

interface LightboxProps {
  src: string | null;
  alt: string;
  onClose: () => void;
}

export function Lightbox({ src, alt, onClose }: LightboxProps) {
  const isActive = src !== null;

  // Close on Escape
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isActive) {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [isActive, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isActive]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('lightbox') || target.classList.contains('lightbox-close')) {
      onClose();
    }
  }, [onClose]);

  return (
    <div
      className={`lightbox ${isActive ? 'active' : ''}`}
      aria-hidden={!isActive}
      role="dialog"
      aria-label="Enlarged photo viewer"
      onClick={handleBackdropClick}
    >
      <button className="lightbox-close" aria-label="Close photo viewer">
        &times;
      </button>
      {src && (
        <img className="lightbox-img" src={src} alt={alt || 'Photo'} />
      )}
      <span className="lightbox-hint">Tap anywhere to close</span>
    </div>
  );
}
