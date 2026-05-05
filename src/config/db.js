const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // service_role para bypass de RLS no backend

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ ERRO: SUPABASE_URL ou SUPABASE_SERVICE_KEY não definidos no .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

module.exports = supabase;
