import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { EnvelopeScene } from '@/components/card/EnvelopeScene';
import type { Card, CardPhoto, AnimationType } from '@/lib/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: card } = await supabase
    .from('cards')
    .select('recipient_name, from_name')
    .eq('slug', slug)
    .single();

  if (!card) {
    return { title: 'Card Not Found' };
  }

  return {
    title: `You've Got Mail${card.from_name ? ` from ${card.from_name}` : ''}`,
    description: `A card for ${card.recipient_name}`,
  };
}

export default async function CardPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  // Fetch card
  const { data: card, error } = await supabase
    .from('cards')
    .select('*')
    .eq('slug', slug)
    .single<Card>();

  if (error || !card) {
    notFound();
  }

  // Fetch photos if the card includes them
  let photoUrls: string[] = [];
  if (card.include_photos) {
    const { data: photos } = await supabase
      .from('card_photos')
      .select('*')
      .eq('card_id', card.id)
      .order('position', { ascending: true })
      .returns<CardPhoto[]>();

    if (photos && photos.length > 0) {
      photoUrls = photos.map(p => {
        const { data } = supabase.storage
          .from('card-photos')
          .getPublicUrl(p.storage_path);
        return data.publicUrl;
      });
    }
  }

  return (
    <EnvelopeScene
      recipientName={card.recipient_name}
      occasion={card.occasion}
      message={card.message}
      fromName={card.from_name}
      bgColor={card.bg_color}
      envelopeColor={card.envelope_color}
      accentColor={card.accent_color}
      textColor={card.text_color}
      animationType={card.animation_type as AnimationType}
      includePhotos={card.include_photos}
      photoUrls={photoUrls}
    />
  );
}
