'use client';

import { useState } from 'react';
import { EditorPanel } from '@/components/editor/EditorPanel';
import { CardPreview } from '@/components/preview/CardPreview';
import type { CardFormData } from '@/lib/types';
import { DEFAULT_CARD } from '@/lib/types';

export default function CreatePage() {
  const [formData, setFormData] = useState<CardFormData>({ ...DEFAULT_CARD });
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [step, setStep] = useState(1); // 1 = text, 2 = style, 3 = preview

  const updateField = <K extends keyof CardFormData>(
    key: K,
    value: CardFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handlePhotosChange = (files: File[]) => {
    setFormData(prev => ({ ...prev, photos: files }));
    const urls = files.map(f => URL.createObjectURL(f));
    photoPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setPhotoPreviewUrls(urls);
  };

  // Step 3: Full-screen preview with Create Card button
  if (step === 3) {
    return (
      <div className="h-dvh flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm z-10">
          <button
            onClick={() => setStep(2)}
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <span className="text-sm text-gray-400">Step 3 of 3 — Preview</span>
          <div className="w-16" /> {/* spacer */}
        </div>

        {/* Preview — fills space between top and bottom bars, scrolls if needed */}
        <div className="flex-1 min-h-0 overflow-auto">
          <CardPreview
            formData={formData}
            photoPreviewUrls={photoPreviewUrls}
          />
        </div>

        {/* Bottom bar with Create button — always visible */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-10">
          <EditorPanel
            formData={formData}
            onFieldChange={updateField}
            onPhotosChange={handlePhotosChange}
            step={3}
            onBack={() => setStep(2)}
            onNext={() => {}}
          />
        </div>
      </div>
    );
  }

  // Steps 1 and 2: Side-by-side editor + preview
  return (
    <div className="min-h-dvh flex flex-col lg:flex-row">
      {/* Editor Panel — left side on desktop, top on mobile */}
      <div className="lg:w-[480px] lg:min-w-[480px] lg:max-h-dvh lg:overflow-y-auto bg-white border-b lg:border-b-0 lg:border-r border-gray-200 shadow-sm">
        <EditorPanel
          formData={formData}
          onFieldChange={updateField}
          onPhotosChange={handlePhotosChange}
          step={step}
          onBack={() => setStep(step - 1)}
          onNext={() => setStep(step + 1)}
        />
      </div>

      {/* Preview Panel — right side on desktop, bottom on mobile */}
      <div className="flex-1 min-h-[50vh] lg:min-h-dvh">
        <CardPreview
          formData={formData}
          photoPreviewUrls={photoPreviewUrls}
        />
      </div>
    </div>
  );
}
