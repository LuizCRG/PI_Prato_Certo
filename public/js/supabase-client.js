/**
 * supabase-client.js
 * Cliente Supabase para o frontend.
 * Este arquivo expõe window.supabaseClient para ser usado por app.js e outras páginas.
 * 
 * IMPORTANTE: Substitua os valores abaixo pelos do seu projeto.
 * Vá em: https://app.supabase.com → Seu Projeto → Settings → API
 */

// Carrega o SDK via CDN
const SUPABASE_URL = 'https://kgbwwdnasqpxmlurjuna.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CBvCBxAIxKFKrFHcbCgNJQ_bHTcAUIi';

// Cria e expõe o cliente globalmente
// O SDK é carregado via CDN no HTML (via <script src="...">)
document.addEventListener('DOMContentLoaded', () => {
    if (window.supabase && !window.supabaseClient) {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase client inicializado');
    }
});
