const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const apiRoutes = require('./src/routes/api');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express serve arquivos estáticos (Frontend) da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/api', apiRoutes);

// Fallback: qualquer outra rota não encontrada cai no index.html
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Acesse no navegador: http://localhost:${PORT}`);
    console.log(`📦 Supabase URL: ${process.env.SUPABASE_URL ? '✅ Configurado' : '❌ Não configurado!'}`);
});
