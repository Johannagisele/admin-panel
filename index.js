const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Para recibir JSON

// Servir archivos estáticos desde '../frontend'
app.use(express.static(path.join(__dirname, '../frontend')));
console.log('🛣️  Serviendo estáticos desde:', path.join(__dirname, '../frontend'));

// Rutas de productos
const productosRoutes = require('./routes/productos');
app.use('/api/productos', productosRoutes);

// Rutas de pagos
const pagosRoutes = require('./routes/pagos');
app.use('/api/pagos', pagosRoutes);

// Levantar servidor
const PORT = 3000;
console.log('Intentando levantar el servidor...');

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de errores no detectados
process.on('uncaughtException', function (err) {
    console.error('🛑 Error no detectado:', err);
});

