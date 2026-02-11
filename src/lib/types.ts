export interface Card {
  id: string;
  slug: string;
  recipient_name: string;
  occasion: string;
  message: string;
  from_name: string;
  bg_color: string;
  envelope_color: string;
  accent_color: string;
  text_color: string;
  animation_type: AnimationType;
  include_photos: boolean;
  created_at: string;
}

export interface CardPhoto {
  id: string;
  card_id: string;
  storage_path: string;
  position: number;
  created_at: string;
}

export interface CardWithPhotos extends Card {
  photos: CardPhoto[];
  photo_urls: string[]; // resolved public URLs
}

export type AnimationType = 'none' | 'confetti' | 'hearts' | 'snowflakes';

export type EnvelopeState = 'back' | 'front' | 'open';

export interface CardFormData {
  recipientName: string;
  occasion: string;
  message: string;
  fromName: string;
  bgColor: string;
  envelopeColor: string;
  accentColor: string;
  textColor: string;
  animationType: AnimationType;
  includePhotos: boolean;
  photos: File[];
}

// Default values for the card builder form
export const DEFAULT_CARD: CardFormData = {
  recipientName: '',
  occasion: '',
  message: '',
  fromName: '',
  bgColor: '#6b9f76',
  envelopeColor: '#f5e6d3',
  accentColor: '#c4956a',
  textColor: '#000000',
  animationType: 'none',
  includePhotos: false,
  photos: [],
};

// Photo position presets (mirrors the prototype's PHOTO_PRESETS)
export const PHOTO_PRESETS = [
  { top: '-8%', left: '-58%', rotate: 'rotate(-8deg)', delay: '0.9s' },
  { top: '-4%', right: '-58%', rotate: 'rotate(5.5deg)', delay: '1.1s' },
  { bottom: '-6%', left: '-52%', rotate: 'rotate(-3deg)', delay: '1.3s' },
  { bottom: '-6%', right: '-52%', rotate: 'rotate(6deg)', delay: '1.5s' },
];

// Present box color presets
export const PRESENT_COLORS = [
  { bg: '#e74c6f', bgDark: '#c43558', ribbon: '#ffd700' },
  { bg: '#4ecdc4', bgDark: '#38b2a9', ribbon: '#ff6b6b' },
  { bg: '#7c5cbf', bgDark: '#6344a3', ribbon: '#ffd700' },
  { bg: '#e8a838', bgDark: '#c98b20', ribbon: '#ff6b6b' },
];

export const MAX_PHOTOS = 4;
export const MAX_MESSAGE_LENGTH = 500;
export const MAX_PHOTO_SIZE_MB = 5;
export const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;
