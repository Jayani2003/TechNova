const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '1234',
            database: process.env.DB_NAME || 'tours'
        });

        console.log('Connected to database.');

        await connection.execute(`
            ALTER TABLE vehicle_category
            MODIFY COLUMN passenger_capacity VARCHAR(50),
            MODIFY COLUMN luggage_capacity VARCHAR(50);
        `);

        console.log('Columns modified successfully.');
        await connection.end();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
