require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const userId = '7c8bafc9-95ea-4562-96a4-c7512d5bab9b';

const dataToSeed = [
    {
        place: { name: 'Marmitaria Sabor de Casa', category: 'marmitaria', experience_types: ['Marmita do dia'] },
        review: { rating: 5, comment: 'Melhor custo-benefício. Comida caseira deliciosa e porção generosa.', would_recommend: true }
    },
    {
        place: { name: 'Restaurante Estrela do Sul', category: 'restaurant', experience_types: ['Self-service'] },
        review: { rating: 4, comment: 'Variedade excelente de saladas e carnes. Preço justo.', would_recommend: true }
    },
    {
        place: { name: 'Burger Prime', category: 'snack', experience_types: ['Lanche rápido'] },
        review: { rating: 5, comment: 'Hambúrguer artesanal impecável. Maionese da casa é nota 10.', would_recommend: true }
    },
    {
        place: { name: 'Pastel do Mercado', category: 'pastelaria', experience_types: ['Pastelaria'] },
        review: { rating: 3, comment: 'Pastel crocante e grande, mas poderia ter mais recheio.', would_recommend: true }
    },
    {
        place: { name: 'Cantina Bella Italia', category: 'restaurant', experience_types: ['Comer no local'] },
        review: { rating: 5, comment: 'Massa fresca e molho artesanal fantástico. Perfeito para sábado.', would_recommend: true }
    }
];

async function seed() {
    try {
        console.log('🔄 Iniciando povoamento...');
        for (const item of dataToSeed) {
            // Check if place exists
            let placeId = null;
            const { data: existingPlace } = await supabase.from('places').select('id').eq('name', item.place.name).single();

            if (existingPlace) {
                placeId = existingPlace.id;
            } else {
                // Insert place
                const { data: newPlace, error: placeError } = await supabase.from('places').insert({
                    name: item.place.name,
                    category: item.place.category,
                    experience_types: item.place.experience_types,
                    average_rating: item.review.rating,
                    total_reviews: 1,
                    price_range: '$$'
                }).select().single();

                if (placeError) throw placeError;
                placeId = newPlace.id;
            }

            // Insert review
            const { error: reviewError } = await supabase.from('reviews').insert({
                place_id: placeId,
                user_id: userId,
                rating: item.review.rating,
                comment: item.review.comment,
                would_recommend: item.review.would_recommend
            });

            if (reviewError) {
                if (reviewError.code === '23505') {
                    console.log(`⚠️ Avaliação já existe para ${item.place.name}`);
                } else {
                    throw reviewError;
                }
            } else {
                console.log(`✅ Inserido: ${item.place.name}`);
            }
        }
        console.log('🎉 Povoamento concluído!');
    } catch (err) {
        console.error('❌ Erro:', err);
    }
}

seed();
