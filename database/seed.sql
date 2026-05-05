-- ============================================================
-- SEED: Dados de demonstração - Prato Honesto
-- Execute APÓS o schema.sql estar criado
-- ============================================================
USE prato_honesto;

-- Limpar dados existentes (ordem: filhos antes dos pais)
DELETE FROM reviews;
DELETE FROM favorites;
DELETE FROM places;
DELETE FROM users;

-- Resetar auto_increment
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE places AUTO_INCREMENT = 1;
ALTER TABLE reviews AUTO_INCREMENT = 1;

-- ============================================================
-- USUÁRIOS FAKE (senha para todos: "senha123")
-- hash bcrypt de "senha123" com 10 rounds
-- ============================================================
INSERT INTO users (name, email, password_hash, role) VALUES
('João da Silva',      'joao@email.com',      '$2b$10$kzFHI1fWKMWMNp7LB3xlUuv6lVxW9h/2tqE1A7BqJq.Ax7A9nxqZG', 'consumer'),
('Maria Oliveira',     'maria@email.com',     '$2b$10$kzFHI1fWKMWMNp7LB3xlUuv6lVxW9h/2tqE1A7BqJq.Ax7A9nxqZG', 'consumer'),
('Carlos Mendes',      'carlos@email.com',    '$2b$10$kzFHI1fWKMWMNp7LB3xlUuv6lVxW9h/2tqE1A7BqJq.Ax7A9nxqZG', 'consumer'),
('Ana Lima',           'ana@email.com',       '$2b$10$kzFHI1fWKMWMNp7LB3xlUuv6lVxW9h/2tqE1A7BqJq.Ax7A9nxqZG', 'consumer'),
('Pedro Souza',        'pedro@email.com',     '$2b$10$kzFHI1fWKMWMNp7LB3xlUuv6lVxW9h/2tqE1A7BqJq.Ax7A9nxqZG', 'consumer'),
('Fernanda Costa',     'fernanda@email.com',  '$2b$10$kzFHI1fWKMWMNp7LB3xlUuv6lVxW9h/2tqE1A7BqJq.Ax7A9nxqZG', 'consumer'),
('Roberto Alves',      'roberto@email.com',   '$2b$10$kzFHI1fWKMWMNp7LB3xlUuv6lVxW9h/2tqE1A7BqJq.Ax7A9nxqZG', 'consumer'),
('Juliana Reis',       'juliana@email.com',   '$2b$10$kzFHI1fWKMWMNp7LB3xlUuv6lVxW9h/2tqE1A7BqJq.Ax7A9nxqZG', 'consumer'),
('Marcos Ferreira',    'marcos@email.com',    '$2b$10$kzFHI1fWKMWMNp7LB3xlUuv6lVxW9h/2tqE1A7BqJq.Ax7A9nxqZG', 'consumer'),
('Patrícia Nunes',     'patricia@email.com',  '$2b$10$kzFHI1fWKMWMNp7LB3xlUuv6lVxW9h/2tqE1A7BqJq.Ax7A9nxqZG', 'consumer'),
('Lucas Barbosa',      'lucas@email.com',     '$2b$10$kzFHI1fWKMWMNp7LB3xlUuv6lVxW9h/2tqE1A7BqJq.Ax7A9nxqZG', 'consumer'),
('Camila Teixeira',    'camila@email.com',    '$2b$10$kzFHI1fWKMWMNp7LB3xlUuv6lVxW9h/2tqE1A7BqJq.Ax7A9nxqZG', 'consumer');

-- ============================================================
-- ESTABELECIMENTOS: todos os 4 tipos
-- ============================================================
INSERT INTO places (name, description, category, price_range, address, average_rating, total_reviews) VALUES

-- MARMITARIAS (3)
('Marmitex da Dona Maria',
 'Comida caseira de verdade, feita com carinho todo dia. Feijão cremoso, arroz soltinho e carnes macias que lembram a casa da vó. Porção generosa que ninguém sai com fome.',
 'marmitaria', '$$', 'Rua Sete de Setembro, 123, Centro - Amparo', 4.8, 128),

('Sabor de Casa - Marmitaria',
 'Especializada em comida mineira com receitas transmitidas de geração em geração. Destaque para o frango ao molho pardo e o tutu de feijão.',
 'marmitaria', '$', 'Av. Brasil, 450, Jardim Novo - Amparo', 4.3, 64),

('Marmita Fit & Gostosa',
 'Marmitas saudáveis e equilibradas nutricionalmente, sem abrir mão do sabor. Ótima opção para quem quer comer bem sem exagerar nas calorias.',
 'marmitaria', '$$$', 'Rua das Flores, 89, Vila Nova - Amparo', 4.6, 42),

-- RESTAURANTES (3)
('Restaurante do Zé Bigode',
 'Tradicional restaurante de Amparo com mais de 20 anos de história. Buffet variado com pratos regionais, massas, carnes e sobremesas. O peixe de sexta é um must!',
 'restaurant', '$$', 'Rua XV de Novembro, 210, Centro - Amparo', 4.5, 97),

('Cantina Bella Napoli',
 'O melhor da culinária italiana em Amparo. Massas artesanais, pizzas em forno a lenha e uma carta de vinhos cuidadosamente selecionada. Ambiente romântico e acolhedor.',
 'restaurant', '$$$', 'Rua Dr. Campos Sales, 77, Centro - Amparo', 4.7, 53),

('Churrascaria Gaúcha Pampa',
 'O verdadeiro churrasco estilo gaúcho: rodízio completo com mais de 15 cortes de carne, salada, acompanhamentos e sobremesa inclusa. Prove o costão bovino!',
 'restaurant', '$$$$', 'Av. Jundiaí, 980, Sta. Rita - Amparo', 4.4, 76),

-- LANCHONETES (3)
('Lanches do Zé',
 'O clássico da cidade. Hambúrgueres artesanais no pão brioche, batatas fritas crocantes e milkshakes que fazem fila. O X-Tudo virou lenda na região.',
 'snack', '$', 'Rua Voluntários de Amparo, 34, Centro - Amparo', 4.7, 95),

('Birosca do Baiano',
 'Coxinhas, esfirras e salgados fresquinhos saindo do forno o dia todo. A coxinha de catupiry é simplesmente absurda. Ambiente descontraído, atendimento rápido.',
 'snack', '$', 'Av. Comendador Müller, 156, Jd. Primavera - Amparo', 4.2, 88),

('Smash Burger Amparo',
 'A nova sensação da cidade! Hambúrgueres no estilo smash, com blend próprio de carnes nobres e ingredientes premium. Experimente o "Prato Honesto Burger".',
 'snack', '$$', 'Rua Campos Salles, 320, Vila Nova - Amparo', 4.9, 37),

-- PASTELARIAS (3)
('Pastelaria Boa Vista',
 'Pastel fininho e crocante como deve ser. Mais de 30 sabores entre doces e salgados. O pastel de camarão e o de palmito com catupiry são os campeões de venda.',
 'pastelaria', '$', 'Rua das Palmeiras, 540, Boa Vista - Amparo', 4.5, 113),

('Pastel da Nona',
 'Receita italiana adaptada ao paladar brasileiro pela Nona Carmela. Massa especial e recheios artesanais que não encontra em lugar nenhum.',
 'pastelaria', '$$', 'Rua Conselheiro Carrão, 88, Centro - Amparo', 4.6, 61),

('Pastelão do Mercadão',
 'O gigante da praça! Pastéis enormes com recheio generoso. O pastel de frango com requeijão tem mais de 300g. Ótima opção para quem está com bastante fome.',
 'pastelaria', '$', 'Mercado Municipal, Banca 12 - Amparo', 4.1, 49);


-- ============================================================
-- AVALIAÇÕES FAKE
-- Cada usuário avalia um estabelecimento diferente
-- ============================================================

-- ---- MARMITEX DA DONA MARIA (id=1) ----
INSERT INTO reviews (place_id, user_id, rating, food_quality, cost_benefit, service, would_recommend, comment) VALUES
(1, 1, 5, 5, 5, 5, 1, 'A marmita é muito servida e a comida tem aquele gostinho de comida de vó! O feijão estava maravilhoso. Compensa demais o preço.'),
(1, 2, 5, 5, 4, 5, 1, 'Simplesmente a melhor marmita da cidade. Venho todo dia e nunca me decepciona. A Dona Maria capricha demais!'),
(1, 3, 4, 5, 5, 4, 1, 'Ótima comida, porção bem servida. Às vezes o atendimento demora um pouco na hora do rush mas vale a pena esperar.'),
(1, 4, 5, 5, 5, 5, 1, 'Meu almoço favorito da semana! Frango ao molho com quiabo que ela faz às quartas é uma obra de arte. Recomendo demais!');

-- ---- SABOR DE CASA (id=2) ----
INSERT INTO reviews (place_id, user_id, rating, food_quality, cost_benefit, service, would_recommend, comment) VALUES
(2, 5, 4, 4, 5, 4, 1, 'Preço ótimo, comida saborosa. O tutu de feijão mineiro é incrível. Só achei que a carne estava um pouco seca dessa vez.'),
(2, 6, 5, 5, 5, 4, 1, 'Melhor custo-benefício da região! Por R$18 você tem prato cheio, suco e sobremesa. Uma raridade hoje em dia.'),
(2, 7, 3, 3, 4, 3, 0, 'Gostei da comida mas o local poderia ser mais organizado. Faltou tempero no feijão no dia que fui.');

-- ---- MARMITA FIT (id=3) ----
INSERT INTO reviews (place_id, user_id, rating, food_quality, cost_benefit, service, would_recommend, comment) VALUES
(3, 8, 5, 5, 4, 5, 1, 'Perfeita! Comida saudável, bem temperada e ainda assim com porção generosa. As macros são informadas no cardápio. Amei!'),
(3, 9, 4, 5, 3, 5, 1, 'Comida deliciosa e muito nutritiva. O preço é um pouco salgado mas a qualidade justifica. Ótimo para dieta sem sacrifício.'),
(3, 10, 5, 5, 4, 5, 1, 'Frequento há 3 meses e já perdi 5kg sem abrir mão do sabor. Tudo fresquinho, sem conservantes. Serviço nota 10!');

-- ---- RESTAURANTE DO ZÉ BIGODE (id=4) ----
INSERT INTO reviews (place_id, user_id, rating, food_quality, cost_benefit, service, would_recommend, comment) VALUES
(4, 11, 5, 5, 4, 5, 1, 'Buffet impecável! Variedade enorme de pratos e sempre repondo. A sobremesa caseira é de chorar de boa. Ambiente familiar e aconchegante.'),
(4, 12, 4, 4, 4, 5, 1, 'Ambiente agradável, ótimo para almoço de família. Comida boa, destaque para o lombo suíno e a salada de bacalhau.'),
(4, 1, 5, 5, 3, 4, 1, 'Tradicional e delicioso. O peixe de sexta é lendário mesmo! Um pouco caro mas a qualidade está lá. Lugar especial para celebrar.');

-- ---- CANTINA BELLA NAPOLI (id=5) ----
INSERT INTO reviews (place_id, user_id, rating, food_quality, cost_benefit, service, would_recommend, comment) VALUES
(5, 2, 5, 5, 4, 5, 1, 'A massa artesanal é outra categoria! Carbonara perfeita, não tem nada daquele creme de leite abominável. Autêntico! O tiramisù então... divino.'),
(5, 3, 5, 5, 5, 5, 1, 'Levei minha esposa no aniversário e foi perfeito. Ambiente super romântico, serviço impecável e comida de nível. Pizza na lenha é incrível!'),
(5, 4, 4, 5, 3, 4, 1, 'Comida excepcional, só fica um pouco salgado para o bolso. Mas para uma ocasião especial vale cada centavo. Fettuccine ao funghi é fenomenal.');

-- ---- CHURRASCARIA GAÚCHA PAMPA (id=6) ----
INSERT INTO reviews (place_id, user_id, rating, food_quality, cost_benefit, service, would_recommend, comment) VALUES
(6, 5, 5, 5, 4, 5, 1, 'Simplesmente o melhor churrasco que já comi em Amparo! O costão bovino derrete na boca. Rodízio completo e bem servido. Voltarei sempre!'),
(6, 6, 4, 5, 3, 4, 1, 'Carne de altíssima qualidade, variedade enorme de cortes. Fica um pouco puxado no preço mas vale para ocasiões especiais.'),
(6, 7, 4, 4, 4, 4, 1, 'Boa churrascaria, referência da cidade. O serviço é atencioso e a carne vem no ponto certo. Salada de acompanhamento excelente.');

-- ---- LANCHES DO ZÉ (id=7) ----
INSERT INTO reviews (place_id, user_id, rating, food_quality, cost_benefit, service, would_recommend, comment) VALUES
(7, 8, 5, 5, 5, 5, 1, 'O X-Tudo VIROU LENDA! Hambúrguer artesanal suculento, pão fresquinho e batata crocante. O melhor da cidade sem dúvida. Vai todo final de semana!'),
(7, 9, 5, 5, 5, 5, 1, 'Milkshake de Ovomaltine + X-Bacon = felicidade pura. Preço justo para a qualidade. Atendimento rápido e simpático. Top 1 da cidade!'),
(7, 10, 4, 5, 5, 4, 1, 'Qualidade constante, sempre gostoso. O hambúrguer nunca decepciona. Às vezes a fila está grande mas vale a pena esperar.');

-- ---- BIROSCA DO BAIANO (id=8) ----
INSERT INTO reviews (place_id, user_id, rating, food_quality, cost_benefit, service, would_recommend, comment) VALUES
(8, 11, 4, 4, 5, 4, 1, 'A coxinha de catupiry é ABSURDA de boa! Saindo quentinha do forno, massa fininha e muito recheio. Preço imbatível. Lugar pequeno mas animado.'),
(8, 12, 4, 4, 5, 4, 1, 'Ótimo para um lanche rápido. Salgados sempre frescos, nunca fico na dúvida se está fresco ou não. Barato e gostoso, o que mais quero!'),
(8, 1, 3, 3, 4, 3, 0, 'Coxinha boa mas o ambiente poderia ser melhor. Às vezes está um pouco cheio e sem lugar para sentar. Serviço precisa melhorar no horário de pico.');

-- ---- SMASH BURGER AMPARO (id=9) ----
INSERT INTO reviews (place_id, user_id, rating, food_quality, cost_benefit, service, would_recommend, comment) VALUES
(9, 2, 5, 5, 4, 5, 1, 'Finalmente um smash burger de verdade em Amparo! A crosta caramelizada da carne é perfeita. O "Prato Honesto Burger" com queijo americano e pickle é irresistível!'),
(9, 3, 5, 5, 5, 5, 1, 'Melhor hambúrguer que já comi na vida. Blend proprío de carnes nobres, pão de brioche macio e ingredientes top. Abriu faz pouco e já é referência!'),
(9, 4, 5, 5, 4, 5, 1, 'Incrível! O smash é executado com perfeição. Batata frita crocante e milkshake de doce de leite que é uma loucura. Voltei 3 vezes na mesma semana!');

-- ---- PASTELARIA BOA VISTA (id=10) ----
INSERT INTO reviews (place_id, user_id, rating, food_quality, cost_benefit, service, would_recommend, comment) VALUES
(10, 5, 5, 5, 5, 4, 1, 'Pastel na chapa, fininho e crocante do jeitinho que eu gosto! O de camarão com cream cheese é meu favorito. Sempre fresco, nunca deixou de impressionar.'),
(10, 6, 4, 4, 5, 4, 1, 'Ótimo pastel, variedade enorme. Gosto muito do de palmito e do doce de banana com canela. Preço justo, atendimento rápido. Recomendo!'),
(10, 7, 5, 5, 5, 5, 1, 'O melhor pastel da cidade na minha opinião! Massa leve, recheio generoso e sempre bem esticado. Nunca vi um pastel ruim aqui. Parabéns!');

-- ---- PASTEL DA NONA (id=11) ----
INSERT INTO reviews (place_id, user_id, rating, food_quality, cost_benefit, service, would_recommend, comment) VALUES
(11, 8, 5, 5, 4, 5, 1, 'A Nona Carmela é genial! A massa especial da família faz toda a diferença. O pastel de ricota com espinafre é como comer na Itália. Experiência única!'),
(11, 9, 5, 5, 4, 5, 1, 'Lugar maravilhoso! Cada detalhe é pensado com carinho. O recheio artesanal é feito fresh diariamente. Meu preferido é o de frango com pesto. Amei!'),
(11, 10, 4, 5, 3, 4, 1, 'Qualidade premium, claramente artesanal e feito com amor. Um pouco mais caro que o convencional mas justifica totalmente pela qualidade dos ingredientes.');

-- ---- PASTELÃO DO MERCADÃO (id=12) ----
INSERT INTO reviews (place_id, user_id, rating, food_quality, cost_benefit, service, would_recommend, comment) VALUES
(12, 11, 4, 4, 5, 3, 1, 'GIGANTE! O pastel de frango com requeijão tem 300g de puro prazer. Por R$12 você come bem e fica satisfeito até a janta. Ambiente de mercado, rústico mas gostoso.'),
(12, 12, 4, 4, 5, 4, 1, 'Ótima pedida para quem está com fome de verdade! Pastel grande, recheio generoso e preço honesto. O de carne com ovo é clássico e delicioso.'),
(12, 1, 4, 4, 5, 3, 1, 'O tamanho mesmo impressiona! Um pastel por dia alimenta civilizações. Sabor bom, bem temperado. Atendimento poderia ser mais ágil mas o produto compensa.');


-- ============================================================
-- ATUALIZAR MÉDIAS (recalcular com base nas reviews inseridas)
-- ============================================================
UPDATE places p
SET 
    average_rating = (SELECT ROUND(AVG(r.rating), 2) FROM reviews r WHERE r.place_id = p.id),
    total_reviews  = (SELECT COUNT(*) FROM reviews r WHERE r.place_id = p.id)
WHERE id IN (1,2,3,4,5,6,7,8,9,10,11,12);
