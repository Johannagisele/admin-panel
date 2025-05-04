const conexion = require('./db/conexion');

conexion.connect((err) => {
    if (err) {
        console.error('❌ Error al conectar con MySQL desde testConexion.js:', err);
    } else {
        console.log('✅ Conexión exitosa a MySQL desde testConexion.js');
    }
    conexion.end(); // Cierra la conexión luego de probar
});

