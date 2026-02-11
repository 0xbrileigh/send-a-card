-- =============================================
-- Card Builder Database Schema
-- =============================================

-- Cards table
CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  recipient_name TEXT NOT NULL,
  occasion TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  from_name TEXT NOT NULL DEFAULT '',
  bg_color TEXT NOT NULL DEFAULT '#6b9f76',
  envelope_color TEXT NOT NULL DEFAULT '#e8d5b7',
  accent_color TEXT NOT NULL DEFAULT '#c4956a',
  text_color TEXT NOT NULL DEFAULT '#000000',
  animation_type TEXT NOT NULL DEFAULT 'none'
    CHECK (animation_type IN ('none', 'bubbles', 'confetti', 'hearts', 'snowflakes')),
  include_photos BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Card photos table
CREATE TABLE IF NOT EXISTS card_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  position INT NOT NULL CHECK (position >= 0 AND position <= 3),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_cards_slug ON cards(slug);

-- Index for photo lookups by card
CREATE INDEX IF NOT EXISTS idx_card_photos_card_id ON card_photos(card_id);

-- =============================================
-- Row Level Security
-- =============================================
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_photos ENABLE ROW LEVEL SECURITY;

-- Anyone can view cards (needed for shareable links)
CREATE POLICY "Cards are viewable by everyone"
  ON cards FOR SELECT
  USING (true);

-- Anyone can create cards (no account needed)
CREATE POLICY "Anyone can create cards"
  ON cards FOR INSERT
  WITH CHECK (true);

-- Anyone can view card photos
CREATE POLICY "Card photos are viewable by everyone"
  ON card_photos FOR SELECT
  USING (true);

-- Anyone can add photos to cards
CREATE POLICY "Anyone can add card photos"
  ON card_photos FOR INSERT
  WITH CHECK (true);

-- =============================================
-- Storage bucket (run in Supabase dashboard SQL editor)
-- =============================================
-- Note: Storage bucket creation is typically done via the dashboard or API.
-- The following is for reference:
--
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('card-photos', 'card-photos', true);
--
-- CREATE POLICY "Anyone can upload card photos"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'card-photos');
--
-- CREATE POLICY "Anyone can view card photos"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'card-photos');
