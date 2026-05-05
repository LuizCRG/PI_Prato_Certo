const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runSetup() {
    console.log("Iniciando a configuração do Banco de Dados...");
    
    let connection;
    try {
        // Conecta sem especificar banco para poder criá-lo
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
            multipleStatements: true // Permite executar múltiplos comandos SQL de uma vez
        });
        
        console.log("✅ Conectado ao MySQL com sucesso.");

        // Ler arquivo schema.sql
        const schemaPath = path.join(__dirname, '../../database/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        console.log("Executando scripts de criação...");
        await connection.query(schema);

        console.log("✅ Banco de dados 'prato_honesto' e tabelas criados com sucesso!");
        
        // Mock rápido para inserir 1 usuário e 1 restaurante para verificação (opcional)
        const [rows] = await connection.query("SELECT COUNT(*) as total FROM prato_honesto.places");
        if(rows[0].total === 0) {
            console.log("Adicionando dados de exemplo...");
            await connection.query(`
                USE prato_honesto;
                INSERT INTO places (name, description, category, price_range, address, average_rating, total_reviews)
                VALUES ('Marmitex da Dona Maria', 'Comida caseira maravilhosa!', 'marmitaria', '$$', 'Rua Central, 123', 4.8, 128);
            `);
            console.log("✅ Dados inseridos.");
        }

    } catch (err) {
        console.error("❌ Erro durante o setup:");
        console.error(err.message);
        console.log("\n-> Verifique se o MySQL no seu XAMPP está ligado (clicou em 'Start'?).");
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
}

runSetup();
