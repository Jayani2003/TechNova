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

        const columnsToAdd = [
            { name: 'passenger_capacity', sql: 'VARCHAR(50)' },
            { name: 'luggage_capacity', sql: 'VARCHAR(50)' },
            { name: 'best_for', sql: 'VARCHAR(255)' },
            { name: 'comfort_level', sql: 'VARCHAR(100)' },
            { name: 'ac_available', sql: 'BOOLEAN DEFAULT FALSE' },
            { name: 'ideal_trip_types', sql: 'VARCHAR(255)' },
        ];

        const [existingColumns] = await connection.execute(
            `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'vehicle_category'`,
            [process.env.DB_NAME || 'tours']
        );

        const existingNames = new Set(existingColumns.map(col => col.COLUMN_NAME));
        for (const column of columnsToAdd) {
            if (!existingNames.has(column.name)) {
                await connection.execute(
                    `ALTER TABLE vehicle_category ADD COLUMN ${column.name} ${column.sql}`
                );
                console.log(`Added column ${column.name} to vehicle_category.`);
            }
        }

        const [bookingColumns] = await connection.execute(
            `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'booking'`,
            [process.env.DB_NAME || 'tours']
        );

        const bookingNames = new Set(bookingColumns.map(col => col.COLUMN_NAME));
        if (!bookingNames.has('admin_note')) {
            await connection.execute(`ALTER TABLE booking ADD COLUMN admin_note TEXT NULL`);
            console.log('Added column admin_note to booking.');
        }

        console.log('Columns updated successfully.');
        await connection.end();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
