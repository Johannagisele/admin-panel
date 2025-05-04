const mysql = require('mysql2/promise'); // ← cambio importante

// Crea un pool de conexiones con promesas
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '8698',
    database: 'the_roxy',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificamos la conexión con async/await
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión exitosa al pool de MySQL');
        connection.release();
    } catch (err) {
        console.error('❌ Error al conectar con MySQL:', err);
    }
})();

module.exports = pool;

