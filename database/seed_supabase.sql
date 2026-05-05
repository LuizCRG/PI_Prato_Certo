-- ============================================================
-- SEED: Dados de Demonstração (Supabase / PostgreSQL)
-- Prato Honesto
-- ============================================================

-- Nota: Certifique-se de que a tabela 'places' e 'reviews' existem
-- E que os usuários fictícios já existam no Auth do Supabase ou 
-- use IDs de usuários reais se estiver testando em um projeto ativo.

-- 1. Limpar dados anteriores (Opcional - use com cautela)
-- TRUNCATE public.reviews CASCADE;
-- TRUNCATE public.places CASCADE;

-- 2. Inserir Estabelecimentos com cobertura de tipos de serviço
-- Tipos: Marmita, Self-service, Lanche rápido, Pastelaria, Delivery, Comer no local
INSERT INTO public.places (name, category, experience_types, address, description, photo_url, average_rating, total_reviews, price_range) VALUES
('Marmitex da Dona Maria', 'marmitaria', '["Marmita", "Delivery"]'::jsonb, 'Rua Sete de Setembro, 123, Centro', 'Comida caseira deliciosa e muito bem servida.', 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80', 4.8, 1, '$$'),
('Buffet Sabor & Cia', 'restaurant', '["Self-service", "Comer no local"]'::jsonb, 'Av. Brasil, 450, Jardim Novo', 'Variedade incrível de pratos quentes e saladas no buffet.', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80', 4.5, 1, '$$'),
('Speedy Burger', 'snack', '["Lanche rápido", "Delivery"]'::jsonb, 'Rua XV de Novembro, 210, Centro', 'O hambúrguer mais rápido e suculento da cidade.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', 4.9, 1, '$$'),
('Pastelaria do Japão', 'pastelaria', '["Pastelaria", "Comer no local"]'::jsonb, 'Mercado Municipal, Banca 12', 'Pastel crocante e sequinho com recheio generoso.', 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80', 4.7, 1, '$'),
('Restaurante Vista Alegre', 'restaurant', '["Comer no local", "Self-service"]'::jsonb, 'Estrada das Palmeiras, 540', 'Ambiente familiar com a melhor parmegiana da região.', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80', 4.4, 1, '$$$'),
('Cantina da Nonna', 'restaurant', '["Comer no local", "Delivery"]'::jsonb, 'Rua Dr. Campos Sales, 77', 'Massas artesanais feitas com receitas de família.', 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=800&q=80', 4.6, 1, '$$');

-- 3. Inserir Avaliações Fictícias
-- Nota: user_id precisa ser um UUID válido de um usuário no auth.users
-- Como não sabemos os UUIDs reais, este script funcionará após substituir por IDs reais
-- ou você pode rodar isso em um ambiente onde possa ignorar a FK temporariamente (não recomendado no Supabase).

/*
-- EXEMPLO DE INSERÇÃO (Descomente e substitua [USER_ID] por um UUID real)
INSERT INTO public.reviews (place_id, user_id, rating, food_quality, cost_benefit, service, would_recommend, comment)
SELECT id, '[USER_ID]', 5, 5, 5, 5, true, 'Experiência fantástica! Comida maravilhosa e preço justo.'
FROM public.places WHERE name = 'Marmitex da Dona Maria';

INSERT INTO public.reviews (place_id, user_id, rating, food_quality, cost_benefit, service, would_recommend, comment)
SELECT id, '[USER_ID]', 4, 4, 5, 4, true, 'O buffet é muito variado, mas o lugar estava um pouco cheio.'
FROM public.places WHERE name = 'Buffet Sabor & Cia';
*/
