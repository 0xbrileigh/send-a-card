'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ColorPicker } from './ColorPicker';
import { AnimationPicker } from './AnimationPicker';
import { PhotoUploader } from './PhotoUploader';
import { createCard, saveCardPhotos } from '@/app/create/actions';
import { uploadPhoto, validatePhoto } from '@/lib/storage';
import type { CardFormData, AnimationType } from '@/lib/types';
import { MAX_MESSAGE_LENGTH } from '@/lib/types';

interface EditorPanelProps {
  formData: CardFormData;
  onFieldChange: <K extends keyof CardFormData>(key: K, value: CardFormData[K]) => void;
  onPhotosChange: (files: File[]) => void;
  step: number;
  onBack: () => void;
  onNext: () => void;
}

export function EditorPanel({ formData, onFieldChange, onPhotosChange, step, onBack, onNext }: EditorPanelProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!formData.recipientName.trim()) {
      setError('Recipient name is required.');
      return;
    }
    if (!formData.message.trim()) {
      setError('Message is required.');
      return;
    }

    if (formData.includePhotos && formData.photos.length > 0) {
      for (const photo of formData.photos) {
        const err = validatePhoto(photo);
        if (err) {
          setError(err);
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      const result = await createCard({
        recipientName: formData.recipientName,
        occasion: formData.occasion,
        message: formData.message,
        fromName: formData.fromName,
        bgColor: formData.bgColor,
        envelopeColor: formData.envelopeColor,
        accentColor: formData.accentColor,
        textColor: formData.textColor,
        animationType: formData.animationType,
        includePhotos: formData.includePhotos && formData.photos.length > 0,
      });

      if ('error' in result) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }

      if (formData.includePhotos && formData.photos.length > 0) {
        const storagePaths: string[] = [];
        for (let i = 0; i < formData.photos.length; i++) {
          const path = await uploadPhoto(formData.photos[i], result.cardId, i);
          storagePaths.push(path);
        }
        await saveCardPhotos(result.cardId, storagePaths);
      }

      router.push(`/create/success?slug=${result.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Step 3: Just the Create Card button (rendered in the bottom bar of the preview page)
  if (step === 3) {
    return (
      <div>
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-3">
            {error}
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gray-600 hover:bg-gray-700 hover:shadow-lg active:scale-[0.98]'
          }`}
        >
          {isSubmitting ? 'Creating...' : 'Create Card'}
        </button>
      </div>
    );
  }

  const STEP_LABELS = ['Your Message', 'Style & Photos'];

  return (
    <div className="p-6 pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create a Card</h1>
        {/* Step indicator */}
        <div className="flex items-center gap-2 mt-3">
          {STEP_LABELS.map((label, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isDone = step > stepNum;
            return (
              <div key={i} className="flex items-center gap-2">
                {i > 0 && <div className={`w-8 h-0.5 ${isDone ? 'bg-gray-600' : 'bg-gray-200'}`} />}
                <div className="flex items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    isActive ? 'bg-gray-600 text-white' :
                    isDone ? 'bg-gray-200 text-gray-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {isDone ? '✓' : stepNum}
                  </div>
                  <span className={`text-xs font-medium ${isActive ? 'text-gray-700' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Text fields */}
      {step === 1 && (
        <div className="space-y-5">
          {/* Recipient Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Name
            </label>
            <input
              type="text"
              value={formData.recipientName}
              onChange={e => onFieldChange('recipientName', e.target.value)}
              placeholder="e.g. John"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none transition-shadow text-gray-900"
            />
          </div>

          {/* Greeting */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Greeting
            </label>
            <input
              type="text"
              value={formData.occasion}
              onChange={e => onFieldChange('occasion', e.target.value)}
              placeholder="e.g. Dear John,"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none transition-shadow text-gray-900"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={e => {
                if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
                  onFieldChange('message', e.target.value);
                }
              }}
              placeholder="Write your heartfelt message here..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none transition-shadow resize-none text-gray-900"
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {formData.message.length}/{MAX_MESSAGE_LENGTH}
            </div>
          </div>

          {/* From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <input
              type="text"
              value={formData.fromName}
              onChange={e => onFieldChange('fromName', e.target.value)}
              placeholder="e.g. From,"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none transition-shadow text-gray-900"
            />
          </div>

          {/* Next button */}
          <button
            onClick={onNext}
            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gray-600 hover:bg-gray-700 hover:shadow-lg active:scale-[0.98] transition-all"
          >
            Next — Style & Photos
          </button>
        </div>
      )}

      {/* Step 2: Colors, Animation, Photos */}
      {step === 2 && (
        <div className="space-y-5">
          {/* Colors */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Colors</h2>
            <ColorPicker
              label="Background"
              value={formData.bgColor}
              onChange={v => onFieldChange('bgColor', v)}
            />
          </div>

          <hr className="border-gray-200" />

          {/* Animation */}
          <AnimationPicker
            value={formData.animationType}
            onChange={v => onFieldChange('animationType', v as AnimationType)}
          />

          <hr className="border-gray-200" />

          {/* Include Photos Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-700">Include Photos</h2>
              <p className="text-xs text-gray-400 mt-0.5">Add up to 4 photos as gifts</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={formData.includePhotos}
              onClick={() => onFieldChange('includePhotos', !formData.includePhotos)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.includePhotos ? 'bg-gray-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                  formData.includePhotos ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Photo Upload */}
          {formData.includePhotos && (
            <PhotoUploader
              photos={formData.photos}
              onChange={onPhotosChange}
            />
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-gray-600 border border-gray-300 hover:bg-gray-50 transition-all"
            >
              Back
            </button>
            <button
              onClick={onNext}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-gray-600 hover:bg-gray-700 hover:shadow-lg active:scale-[0.98] transition-all"
            >
              Preview Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
