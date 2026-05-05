const express = require('express');
const router = express.Router();
const supabase = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// ============================================================
// HELPER: Verificar token JWT do usuário logado
// ============================================================
async function verifyUser(req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];

    // Cria cliente temporário com o token do usuário para verificar autenticidade
    const userClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data: { user }, error } = await userClient.auth.getUser(token);

    if (error || !user) return null;
    return user;
}

// ============================================================
// UPLOAD LOCAL (fallback se Supabase Storage não estiver configurado)
// ============================================================
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, 'review_' + Date.now() + '_' + Math.round(Math.random() * 1000) + ext);
    }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ============================================================
// UPLOAD PARA SUPABASE STORAGE
// ============================================================
async function uploadToStorage(file, bucket = 'review-photos') {
    try {
        const ext = path.extname(file.originalname);
        const prefix = bucket === 'avatars' ? 'avatar_' : 'review_';
        const filename = prefix + Date.now() + '_' + Math.round(Math.random() * 1000) + ext;
        const fileBuffer = fs.readFileSync(file.path);

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filename, fileBuffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (error) {
            console.warn(`⚠️ Supabase Storage (${bucket}) falhou, usando upload local:`, error.message);
            return '/uploads/' + path.basename(file.path);
        }

        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filename);
        return urlData.publicUrl;
    } catch (err) {
        console.warn('⚠️ Erro no upload, usando local:', err.message);
        return '/uploads/' + path.basename(file.path);
    }
}

// ============================================================
// ROTAS DE ESTABELECIMENTOS (PLACES)
// ============================================================

// Listar todos os lugares
router.get('/places', async (req, res) => {
    try {
        const { search, category, sort } = req.query;
        let query = supabase.from('places').select('*');

        if (search) query = query.ilike('name', `%${search}%`);
        if (category) query = query.eq('category', category);
        if (sort === 'rating') query = query.order('average_rating', { ascending: false });
        else query = query.order('created_at', { ascending: false });

        const { data, error } = await query;
        if (error) throw error;
        res.json(data || []);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar estabelecimentos.' });
    }
});

// Top 4 de cada categoria (destaques)
router.get('/places/highlights', async (req, res) => {
    try {
        const categories = ['marmitaria', 'restaurant', 'snack', 'pastelaria'];
        const result = {};

        await Promise.all(categories.map(async cat => {
            const { data } = await supabase
                .from('places')
                .select('*')
                .eq('category', cat)
                .order('average_rating', { ascending: false })
                .order('total_reviews', { ascending: false })
                .limit(4);
            result[cat] = data || [];
        }));

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar destaques.' });
    }
});

// Detalhes de um local específico
router.get('/places/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('places')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error || !data) return res.status(404).json({ error: 'Lugar não encontrado.' });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar detalhes do estabelecimento.' });
    }
});

// Listar avaliações de um local
router.get('/places/:id/reviews', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select(`
                *,
                profiles:user_id (
                    name,
                    avatar_url
                )
            `)
            .eq('place_id', req.params.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Formata o resultado para manter compatibilidade com o frontend
        const reviews = (data || []).map(r => ({
            ...r,
            user_name: r.profiles?.name || 'Usuário',
            avatar_url: r.profiles?.avatar_url || null
        }));

        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar as avaliações.' });
    }
});

// ============================================================
// CRIAR LUGAR + AVALIAÇÃO (fluxo unificado)
// ============================================================
router.post('/submit', upload.array('photos', 5), async (req, res) => {
    try {
        // 1. Verificar autenticação
        const user = await verifyUser(req);
        if (!user) return res.status(401).json({ error: 'Você precisa estar logado para enviar uma avaliação.' });

        const {
            place_name, category, address, experience_types,
            rating, would_recommend, comment,
            food_quality, cost_benefit, service
        } = req.body;

        // 2. Validações
        if (!place_name || !place_name.trim()) return res.status(400).json({ error: 'Nome do lugar é obrigatório.' });
        if (!category) return res.status(400).json({ error: 'Categoria é obrigatória.' });
        if (!rating) return res.status(400).json({ error: 'Nota é obrigatória.' });

        // 3. Upload de fotos
        let photoPaths = [];
        if (req.files && req.files.length > 0) {
            photoPaths = await Promise.all(req.files.map(f => uploadToStorage(f)));
        }

        // 4. Criar o estabelecimento
        const { data: placeData, error: placeError } = await supabase
            .from('places')
            .insert({
                name: place_name.trim(),
                category,
                user_id: user.id, // Rastrear quem sugeriu
                status: 'approved', // Por padrão aprovado para este projeto simples
                address: address || null,
                experience_types: experience_types ? JSON.parse(experience_types) : [],
                photo_url: photoPaths[0] || null,
                average_rating: parseFloat(rating),
                total_reviews: 1
            })
            .select()
            .single();

        if (placeError) throw placeError;

        // 5. Criar a avaliação vinculada ao lugar + usuário
        const { error: reviewError } = await supabase
            .from('reviews')
            .insert({
                place_id: placeData.id,
                user_id: user.id,
                rating: parseInt(rating),
                food_quality: food_quality ? parseInt(food_quality) : null,
                cost_benefit: cost_benefit ? parseInt(cost_benefit) : null,
                service: service ? parseInt(service) : null,
                would_recommend: would_recommend === '1' || would_recommend === 'true',
                comment: comment || null,
                photo_urls: photoPaths
            });

        if (reviewError) throw reviewError;

        res.status(201).json({
            message: 'Avaliação publicada com sucesso!',
            place: placeData
        });
    } catch (err) {
        console.error('Erro no submit:', err);
        res.status(500).json({ error: err.message || 'Erro ao enviar avaliação.' });
    }
});

// Criar avaliação em um lugar já existente (página de detalhes)
router.post('/places/:id/reviews', upload.array('photos', 5), async (req, res) => {
    try {
        const user = await verifyUser(req);
        if (!user) return res.status(401).json({ error: 'Você precisa estar logado para avaliar.' });

        const placeId = req.params.id;
        const { rating, comment, food_quality, cost_benefit, service, would_recommend } = req.body;

        if (!rating) return res.status(400).json({ error: 'Nota é obrigatória.' });

        // Upload fotos
        let photoPaths = [];
        if (req.files && req.files.length > 0) {
            photoPaths = await Promise.all(req.files.map(f => uploadToStorage(f)));
        }

        const { error: reviewError } = await supabase
            .from('reviews')
            .insert({
                place_id: placeId,
                user_id: user.id,
                rating: parseInt(rating),
                food_quality: food_quality ? parseInt(food_quality) : null,
                cost_benefit: cost_benefit ? parseInt(cost_benefit) : null,
                service: service ? parseInt(service) : null,
                would_recommend: would_recommend === '1' || would_recommend === 'true',
                comment: comment || null,
                photo_urls: photoPaths
            });

        if (reviewError) {
            if (reviewError.code === '23505') {
                return res.status(400).json({ error: 'Você já avaliou este estabelecimento.' });
            }
            throw reviewError;
        }

        // Recalcular médias
        const { data: reviews } = await supabase
            .from('reviews')
            .select('rating')
            .eq('place_id', placeId);

        if (reviews && reviews.length > 0) {
            const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
            await supabase
                .from('places')
                .update({
                    average_rating: Math.round(avg * 100) / 100,
                    total_reviews: reviews.length
                })
                .eq('id', placeId);
        }

        res.status(201).json({ message: 'Avaliação adicionada com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Erro ao criar avaliação.' });
    }
});

// ============================================================
// DELETAR ESTABELECIMENTO (Admin)
// ============================================================
router.delete('/places/:id', async (req, res) => {
    try {
        const user = await verifyUser(req);
        if (!user) return res.status(401).json({ error: 'Não autorizado.' });

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profile || profile.role !== 'admin') return res.status(403).json({ error: 'Acesso negado.' });

        const { error } = await supabase.from('places').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ message: 'Estabelecimento removido com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar o estabelecimento.' });
    }
});

// DELETAR AVALIAÇÃO (Admin)
router.delete('/reviews/:id', async (req, res) => {
    try {
        const user = await verifyUser(req);
        if (!user) return res.status(401).json({ error: 'Não autorizado.' });

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profile || profile.role !== 'admin') return res.status(403).json({ error: 'Acesso negado.' });

        const { data: review } = await supabase
            .from('reviews')
            .select('place_id')
            .eq('id', req.params.id)
            .single();

        if (!review) return res.status(404).json({ error: 'Avaliação não encontrada.' });

        await supabase.from('reviews').delete().eq('id', req.params.id);

        // Recalcular médias
        const { data: reviews } = await supabase
            .from('reviews')
            .select('rating')
            .eq('place_id', review.place_id);

        const avg = reviews && reviews.length > 0
            ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
            : 0;

        await supabase.from('places').update({
            average_rating: Math.round(avg * 100) / 100,
            total_reviews: reviews ? reviews.length : 0
        }).eq('id', review.place_id);

        res.json({ message: 'Avaliação removida com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar a avaliação.' });
    }
});

// ============================================================
// AUTH — Registro e Login (delegado ao Supabase Auth)
// ============================================================

// Registro (cria usuário no Supabase Auth + perfil)
router.post('/auth/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    try {
        // Criar usuário no Supabase Auth (service_role ignora email confirmation)
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // auto-confirma
            user_metadata: { name, role: role || 'consumer' }
        });

        if (authError) {
            if (authError.message.includes('already registered') || authError.code === 'email_exists') {
                return res.status(400).json({ error: 'E-mail já cadastrado.' });
            }
            throw authError;
        }

        const userId = authData.user.id;

        // Criar perfil público
        await supabase.from('profiles').upsert({
            id: userId,
            name,
            role: role || 'consumer',
            avatar_url: null
        });

        res.status(201).json({ message: 'Conta criada com sucesso!', userId });
    } catch (err) {
        console.error('Erro no registro:', err);
        res.status(500).json({ error: err.message || 'Erro ao criar conta.' });
    }
});

// Login (valida e retorna token de sessão)
router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Usa o anon key para simular o login do cliente
        const anonClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
        const { data, error } = await anonClient.auth.signInWithPassword({ email, password });

        if (error || !data.user) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
        }

        if (!data.session) {
            console.error('⚠️ Login bem-sucedido mas sem sessão. Verifique se a confirmação de e-mail é obrigatória no painel do Supabase.');
            return res.status(401).json({ error: 'Login realizado, mas a sessão não pôde ser criada. Verifique se seu e-mail foi confirmado.' });
        }

        // Buscar perfil
        const { data: profile } = await supabase
            .from('profiles')
            .select('name, avatar_url, role')
            .eq('id', data.user.id)
            .single();

        const user = {
            id: data.user.id,
            email: data.user.email,
            name: profile?.name || data.user.user_metadata?.name || email.split('@')[0],
            role: profile?.role || 'consumer',
            avatar_url: profile?.avatar_url || null
        };

        res.json({
            message: 'Login realizado com sucesso!',
            user,
            session: {
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token
            }
        });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ error: 'Erro interno no servidor ao realizar o login.' });
    }
});

// Stats do usuário
router.get('/users/:id/stats', async (req, res) => {
    try {
        const { count, error } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', req.params.id);

        if (error) throw error;
        
        // Buscar também sugestões aprovadas
        const { count: suggestionsCount } = await supabase
            .from('places')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', req.params.id);

        res.json({ 
            reviewsCount: count || 0,
            suggestionsApproved: suggestionsCount || 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar stats do usuário.' });
    }
});

// Listar avaliações de um usuário específico
router.get('/users/:id/reviews', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select(`
                *,
                places:place_id (
                    name
                )
            `)
            .eq('user_id', req.params.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const reviews = (data || []).map(r => ({
            ...r,
            place_name: r.places?.name || 'Local Desconhecido'
        }));

        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar avaliações do usuário.' });
    }
});

// Listar sugestões de um usuário específico
router.get('/users/:id/suggestions', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('places')
            .select('*')
            .eq('user_id', req.params.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data || []);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar sugestões do usuário.' });
    }
});

// Atualizar avatar do usuário
router.post('/users/:id/avatar', upload.single('avatar'), async (req, res) => {
    try {
        const user = await verifyUser(req);
        if (!user || user.id !== req.params.id) {
            return res.status(401).json({ error: 'Não autorizado.' });
        }

        if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada.' });

        const avatarUrl = await uploadToStorage(req.file, 'avatars');

        const { error } = await supabase
            .from('profiles')
            .update({ avatar_url: avatarUrl })
            .eq('id', user.id);

        if (error) throw error;

        res.json({ message: 'Avatar atualizado com sucesso!', avatar_url: avatarUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar avatar.' });
    }
});

// Atualizar nome do usuário
router.put('/users/:id', async (req, res) => {
    try {
        const user = await verifyUser(req);
        if (!user || user.id !== req.params.id) return res.status(401).json({ error: 'Não autorizado.' });

        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Nome é obrigatório.' });

        const { error } = await supabase
            .from('profiles')
            .update({ name })
            .eq('id', user.id);

        if (error) throw error;
        res.json({ message: 'Perfil atualizado!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar perfil.' });
    }
});

module.exports = router;
