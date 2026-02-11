'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';
import { nanoid } from 'nanoid';
import type { AnimationType } from '@/lib/types';

interface CreateCardInput {
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
}

type CreateCardResult =
  | { slug: string; cardId: string }
  | { error: string };

export async function createCard(input: CreateCardInput): Promise<CreateCardResult> {
  // Server-side validation
  if (!input.recipientName.trim()) {
    return { error: 'Recipient name is required.' };
  }
  if (!input.message.trim()) {
    return { error: 'Message is required.' };
  }
  if (input.message.length > 500) {
    return { error: 'Message is too long (max 500 characters).' };
  }

  const supabase = await createServerSupabaseClient();
  const slug = nanoid(10);

  const { data, error } = await supabase
    .from('cards')
    .insert({
      slug,
      recipient_name: input.recipientName.trim(),
      occasion: input.occasion.trim(),
      message: input.message.trim(),
      from_name: input.fromName.trim(),
      bg_color: input.bgColor,
      envelope_color: input.envelopeColor,
      accent_color: input.accentColor,
      text_color: input.textColor,
      animation_type: input.animationType,
      include_photos: input.includePhotos,
    })
    .select('id, slug')
    .single();

  if (error) {
    console.error('Error creating card:', error);
    return { error: 'Failed to create card. Please try again.' };
  }

  return { slug: data.slug, cardId: data.id };
}

export async function saveCardPhotos(cardId: string, storagePaths: string[]) {
  const supabase = await createServerSupabaseClient();

  const rows = storagePaths.map((path, i) => ({
    card_id: cardId,
    storage_path: path,
    position: i,
  }));

  const { error } = await supabase
    .from('card_photos')
    .insert(rows);

  if (error) {
    console.error('Error saving card photos:', error);
    throw new Error('Failed to save photo references.');
  }
}
