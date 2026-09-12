-- =========================================================
-- Gadget Board - Doraemon-Themed Collaborative Idea Board
-- Supabase Schema Migration & Sample Seed Data
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Wishes Table
CREATE TABLE IF NOT EXISTS public.wishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'granted')),
    image_url TEXT,
    creator_id VARCHAR(100) NOT NULL,
    creator_name VARCHAR(100) NOT NULL,
    creator_avatar VARCHAR(255),
    upvotes_count INTEGER NOT NULL DEFAULT 0,
    granted_gadget_name VARCHAR(150),
    granted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Upvotes Table (ensures 1 vote per user, toggleable)
CREATE TABLE IF NOT EXISTS public.wish_upvotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wish_id UUID NOT NULL REFERENCES public.wishes(id) ON DELETE CASCADE,
    user_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_wish_upvote UNIQUE(wish_id, user_id)
);

-- 3. Comments & Gadget Solutions Table
CREATE TABLE IF NOT EXISTS public.wish_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wish_id UUID NOT NULL REFERENCES public.wishes(id) ON DELETE CASCADE,
    user_id VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_avatar VARCHAR(255),
    content TEXT NOT NULL,
    is_gadget_solution BOOLEAN NOT NULL DEFAULT false,
    gadget_name VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for lightning-fast lookups and sorting
CREATE INDEX IF NOT EXISTS idx_wishes_category ON public.wishes(category);
CREATE INDEX IF NOT EXISTS idx_wishes_status ON public.wishes(status);
CREATE INDEX IF NOT EXISTS idx_wishes_upvotes ON public.wishes(upvotes_count DESC);
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON public.wishes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wish_upvotes_wish_user ON public.wish_upvotes(wish_id, user_id);
CREATE INDEX IF NOT EXISTS idx_wish_comments_wish ON public.wish_comments(wish_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wish_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wish_comments ENABLE ROW LEVEL SECURITY;

-- Public policies allowing read and collaborative usage
CREATE POLICY "Public can read wishes" ON public.wishes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert wishes" ON public.wishes FOR INSERT WITH CHECK (true);
CREATE POLICY "Creators can update their wishes" ON public.wishes FOR UPDATE USING (true);
CREATE POLICY "Creators can delete their wishes" ON public.wishes FOR DELETE USING (true);

CREATE POLICY "Public can read upvotes" ON public.wish_upvotes FOR SELECT USING (true);
CREATE POLICY "Anyone can upvote" ON public.wish_upvotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can remove their upvotes" ON public.wish_upvotes FOR DELETE USING (true);

CREATE POLICY "Public can read comments" ON public.wish_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert comments" ON public.wish_comments FOR INSERT WITH CHECK (true);

-- Enable Realtime Broadcasts on tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.wishes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wish_upvotes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wish_comments;

-- =========================================================
-- Sample Seed Data
-- =========================================================

-- Clear existing data if re-running
DELETE FROM public.wish_comments;
DELETE FROM public.wish_upvotes;
DELETE FROM public.wishes;

-- Insert iconic, imaginative wishes
INSERT INTO public.wishes (id, title, description, category, status, image_url, creator_id, creator_name, creator_avatar, upvotes_count, granted_gadget_name, granted_at)
VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Skip the Morning Traffic Rush Completely',
    'I wake up late almost every day and end up running in panic to make it to class before the bell rings. Can we have a door that opens directly into the hallway?',
    'Travel & Time',
    'open',
    'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80',
    'user-nobita',
    'Nobita N.',
    'nobita',
    14,
    NULL,
    NULL
),
(
    '22222222-2222-2222-2222-222222222222',
    'Instant Memorization for Math and History Formulas',
    'Studying 40 pages of dates and trigonometry formulas the night before the final test is impossible. I wish I could just press notes onto toast and eat it!',
    'Study & School',
    'open',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
    'user-nobita',
    'Nobita N.',
    'nobita',
    21,
    NULL,
    NULL
),
(
    '33333333-3333-3333-3333-333333333333',
    'Restore My Grandmother''s Antique Clock',
    'My grandmother has a beautiful antique pendulum clock that stopped ticking thirty years ago. Watchmakers say the parts are no longer made. I wish we could rewind its physical condition to like-new!',
    'Daily Life',
    'granted',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    'user-shizuka',
    'Shizuka M.',
    'shizuka',
    35,
    'Time Cloth (Furoshiki)',
    NOW() - INTERVAL '2 days'
),
(
    '44444444-4444-4444-4444-444444444444',
    'Breeze Through the Sky on Pleasant Afternoons',
    'Walking through crowded sidewalks is exhausting. Imagine strapping a tiny gentle propeller to your hat and cruising over the rooftops with the wind in your face!',
    'Travel & Time',
    'open',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    'user-suneo',
    'Suneo H.',
    'suneo',
    18,
    NULL,
    NULL
),
(
    '55555555-5555-5555-5555-555555555555',
    'An Endless Tray of Fresh Sweet Bean Pastries',
    'Whenever we buy a box of warm red bean pancakes, they vanish in 2 minutes flat! There should be a device that doubles whatever food you put in front of it every few minutes.',
    'Food & Dorayaki',
    'granted',
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    'user-doraemon',
    'Doraemon (Host)',
    'doraemon',
    42,
    'Multiplying Liquid & Mirror',
    NOW() - INTERVAL '1 day'
),
(
    '66666666-6666-6666-6666-666666666666',
    'Speak Any Language Instantly While Traveling',
    'I want to converse fluently with people all around the world without spending 5 years with grammar flashcards. A sweet jelly candy that translates instantly when you swallow it!',
    'Secret Gadgets',
    'open',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
    'user-gian',
    'Takeshi "Gian" G.',
    'gian',
    27,
    NULL,
    NULL
),
(
    '77777777-7777-7777-7777-777777777777',
    'Miniaturize Camping Gear to Fit into a Keychain',
    'Tents, sleeping bags, and cooking stoves take up so much trunk space. We need a flashlight that shrinks physical objects when illuminated with soft yellow light!',
    'Secret Gadgets',
    'open',
    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
    'user-shizuka',
    'Shizuka M.',
    'shizuka',
    19,
    NULL,
    NULL
);

-- Insert Sample Upvotes
INSERT INTO public.wish_upvotes (wish_id, user_id)
VALUES
('11111111-1111-1111-1111-111111111111', 'user-nobita'),
('11111111-1111-1111-1111-111111111111', 'user-shizuka'),
('22222222-2222-2222-2222-222222222222', 'user-nobita'),
('22222222-2222-2222-2222-222222222222', 'user-gian'),
('33333333-3333-3333-3333-333333333333', 'user-shizuka'),
('33333333-3333-3333-3333-333333333333', 'user-doraemon'),
('44444444-4444-4444-4444-444444444444', 'user-suneo'),
('55555555-5555-5555-5555-555555555555', 'user-doraemon'),
('66666666-6666-6666-6666-666666666666', 'user-gian'),
('77777777-7777-7777-7777-777777777777', 'user-shizuka');

-- Insert Sample Gadget Solution Comments
INSERT INTO public.wish_comments (wish_id, user_id, user_name, user_avatar, content, is_gadget_solution, gadget_name)
VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'user-doraemon',
    'Doraemon (Host)',
    'doraemon',
    'I reached into the fourth-dimensional pocket and pulled out the Dokodemo Door (Anywhere Door)! Just turn the knob while thinking of your destination.',
    true,
    'Anywhere Door (Dokodemo Door)'
),
(
    '11111111-1111-1111-1111-111111111111',
    'user-shizuka',
    'Shizuka M.',
    'shizuka',
    'Make sure Nobita doesn''t open it while someone is taking an afternoon bath! 🌸',
    false,
    NULL
),
(
    '22222222-2222-2222-2222-222222222222',
    'user-doraemon',
    'Doraemon (Host)',
    'doraemon',
    'Here is Memory Bread (Anki-pan)! Press a slice onto your textbook page and eat it. But remember, if your stomach gets upset, the memories vanish!',
    true,
    'Memory Bread (Anki-pan)'
),
(
    '33333333-3333-3333-3333-333333333333',
    'user-doraemon',
    'Doraemon (Host)',
    'doraemon',
    'Wish officially granted! We wrapped the clock in the red side of the Time Furoshiki (Time Cloth). Within 5 minutes, the gears shone like brand new.',
    true,
    'Time Furoshiki'
),
(
    '55555555-5555-5555-5555-555555555555',
    'user-nobita',
    'Nobita N.',
    'nobita',
    'Doraemon ate 30 dorayaki by himself after using the multiplying mirror! His belly was so round he could hardly walk!',
    false,
    NULL
);
