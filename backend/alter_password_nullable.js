const db = require('./db/connection');

async function run() {
  try {
    console.log('Altering user table to make password_hash nullable...');
    await db.execute('ALTER TABLE user MODIFY password_hash VARCHAR(255) NULL');
    console.log('Successfully altered user table.');
  } catch (err) {
    console.error('Error altering table:', err);
  } finally {
    process.exit();
  }
}

run();
