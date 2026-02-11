'use client';

import { PresentBox } from './PresentBox';

interface PhotosContainerProps {
  photoUrls: string[];
  isOpen: boolean;
  onPhotoClick: (src: string, alt: string) => void;
  /** When true, photos start already unwrapped (builder preview mode) */
  previewMode?: boolean;
}

export function PhotosContainer({ photoUrls, isOpen, onPhotoClick, previewMode }: PhotosContainerProps) {
  return (
    <div className="photos-container">
      {photoUrls.map((url, i) => (
        <PresentBox
          key={i}
          photoUrl={url}
          index={i}
          isOpen={isOpen}
          onPhotoClick={onPhotoClick}
          previewMode={previewMode}
        />
      ))}
    </div>
  );
}
