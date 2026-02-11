import { createClient } from './supabase';
import { MAX_PHOTO_SIZE_BYTES } from './types';

const BUCKET = 'card-photos';
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function validatePhoto(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only JPG, PNG, WebP, and GIF images are allowed.';
  }
  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    return 'Photo must be under 5MB.';
  }
  return null;
}

export async function uploadPhoto(
  file: File,
  cardId: string,
  position: number
): Promise<string> {
  const supabase = createClient();

  // Determine file extension
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${cardId}/${position}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload photo: ${error.message}`);
  }

  return path;
}

export function getPhotoPublicUrl(storagePath: string): string {
  const supabase = createClient();
  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);
  return data.publicUrl;
}
