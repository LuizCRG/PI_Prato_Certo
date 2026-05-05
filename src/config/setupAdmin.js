const db = require('./db');
const bcrypt = require('bcrypt');

async function setupAdmin() {
    try {
        console.log('🔄 Alterando a coluna role na tabela users para aceitar admin...');
        await db.query("ALTER TABLE users MODIFY COLUMN role ENUM('consumer', 'business', 'admin') NOT NULL DEFAULT 'consumer'");

        const email = 'residentgamerlc@gmail.com';
        const password = 'pi2026univesp';
        const name = 'Admin Master';

        // Check if admin already exists
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            console.log('✅ Administrador já existe no banco de dados. Atualizando permissão para admin...');
            await db.query("UPDATE users SET role = 'admin' WHERE email = ?", [email]);
        } else {
            console.log('🔄 Criando conta de administrador...');
            const hash = await bcrypt.hash(password, 10);
            await db.query(
                "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')",
                [name, email, hash]
            );
            console.log('✅ Conta de administrador criada com sucesso!');
        }
    } catch (error) {
        console.error('❌ Erro durante o setup do admin:', error);
    } finally {
        process.exit();
    }
}

setupAdmin();
