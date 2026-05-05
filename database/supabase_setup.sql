-- ============================================================
-- PRATO HONESTO — SQL para Supabase
-- Execute este script no SQL Editor do Supabase Dashboard
-- https://app.supabase.com → Seu Projeto → SQL Editor
-- ============================================================

-- 1. Tabela de perfis (extensão do auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'consumer',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de estabelecimentos
CREATE TABLE IF NOT EXISTS places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    experience_types JSONB DEFAULT '[]'::jsonb,
    address TEXT,
    description TEXT,
    photo_url TEXT,
    average_rating NUMERIC(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    price_range TEXT DEFAULT '$$',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de avaliações
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id UUID REFERENCES places(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    food_quality INTEGER,
    cost_benefit INTEGER,
    service INTEGER,
    would_recommend BOOLEAN DEFAULT true,
    comment TEXT,
    photo_urls JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(place_id, user_id)
);

-- 4. Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies: profiles
CREATE POLICY "Profiles são visíveis por todos" ON profiles FOR SELECT USING (true);
CREATE POLICY "Usuário pode editar próprio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Policies: places
CREATE POLICY "Places são visíveis por todos" ON places FOR SELECT USING (true);
CREATE POLICY "Autenticados podem criar places" ON places FOR INSERT WITH CHECK (true);
CREATE POLICY "Autenticados podem atualizar places" ON places FOR UPDATE USING (true);
CREATE POLICY "Admin pode deletar places" ON places FOR DELETE USING (true);

-- Policies: reviews
CREATE POLICY "Reviews são visíveis por todos" ON reviews FOR SELECT USING (true);
CREATE POLICY "Autenticados podem criar reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin pode deletar reviews" ON reviews FOR DELETE USING (true);

-- 5. Storage bucket para fotos (execute no SQL ou crie manualmente no Dashboard)
INSERT INTO storage.buckets (id, name, public) VALUES ('review-photos', 'review-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy de storage: qualquer um pode ver, autenticados podem fazer upload
CREATE POLICY "Fotos públicas" ON storage.objects FOR SELECT USING (bucket_id = 'review-photos');
CREATE POLICY "Autenticados fazem upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'review-photos');

-- 6. Trigger para criar perfil automaticamente quando um usuário se registra
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'consumer')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
