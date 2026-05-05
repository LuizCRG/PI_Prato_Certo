-- Adicionar rastreamento de sugestões à tabela de locais
ALTER TABLE public.places 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Garantir que o bucket de avatares existe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Policies para o bucket de avatares
CREATE POLICY "Avatares públicos" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Usuários fazem upload do próprio avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Usuários atualizam próprio avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
