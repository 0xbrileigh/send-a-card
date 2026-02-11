'use client';

import { EnvelopeScene } from '@/components/card/EnvelopeScene';
import type { CardFormData } from '@/lib/types';

interface CardPreviewProps {
  formData: CardFormData;
  photoPreviewUrls: string[];
}

export function CardPreview({ formData, photoPreviewUrls }: CardPreviewProps) {
  return (
    <div className="w-full h-full overflow-auto">
      <EnvelopeScene
        recipientName={formData.recipientName || 'John'}
        occasion={formData.occasion || 'Dear John,'}
        message={formData.message || 'Your message will appear here...'}
        fromName={formData.fromName || 'From,'}
        bgColor={formData.bgColor}
        envelopeColor={formData.envelopeColor}
        accentColor={formData.accentColor}
        textColor={formData.textColor}
        animationType={formData.animationType}
        includePhotos={formData.includePhotos && photoPreviewUrls.length > 0}
        photoUrls={photoPreviewUrls}
        initialState="open"
      />
    </div>
  );
}
