const db = require('./db/connection');

(async () => {
  try {
    const [rows] = await db.execute('SELECT customer_id, name, email, password FROM customer LIMIT 5');
    console.log(JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error('QUERY ERROR', err);
  } finally {
    process.exit();
  }
})();
