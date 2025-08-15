import pool from "./src/config/database.js";

(async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('Database connection successful:', result.rows[0]);
    } catch (error) {
        console.error('Database connection error:', error);
    } finally {
        await pool.end(); // Close the pool
    }
})();
