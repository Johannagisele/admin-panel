const express = require('express');
const router = express.Router();
const pool = require('../db/conexion');

// Obtener todos los pagos
router.get('/', async (req, res) => {
    try {
        const [pagos] = await pool.query(`
            SELECT pagos.id, pagos.fecha, pagos.monto, pagos.metodo_pago, pagos.estado, usuarios.nombre AS nombre_usuario
            FROM pagos
            JOIN usuarios ON pagos.usuario_id = usuarios.id
        `);
        res.json(pagos);
    } catch (error) {
        console.error('❌ Error al obtener pagos:', error);
        res.status(500).json({ error: 'Error al obtener pagos' });
    }
});

// Agregar un nuevo pago
router.post('/', async (req, res) => {
    try {
        const { monto, metodo_pago, usuario_id, estado } = req.body;
        const sql = 'INSERT INTO pagos (monto, metodo_pago, usuario_id, estado) VALUES (?, ?, ?, ?)';
        const [resultado] = await pool.query(sql, [monto, metodo_pago, usuario_id, estado]);

        res.status(201).json({ mensaje: 'Pago agregado correctamente', id: resultado.insertId });
    } catch (err) {
        console.error('❌ Error al agregar pago:', err);
        res.status(500).json({ error: 'Error al agregar pago' });
    }
});

// Actualizar un pago
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const sql = 'UPDATE pagos SET estado = ? WHERE id = ?';
        await pool.query(sql, [estado, id]);

        res.json({ mensaje: 'Pago actualizado correctamente' });
    } catch (err) {
        console.error('❌ Error al actualizar pago:', err);
        res.status(500).json({ error: 'Error al actualizar pago' });
    }
});

// Eliminar un pago
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'DELETE FROM pagos WHERE id = ?';
        await pool.query(sql, [id]);

        res.json({ mensaje: 'Pago eliminado correctamente' });
    } catch (err) {
        console.error('❌ Error al eliminar pago:', err);
        res.status(500).json({ error: 'Error al eliminar pago' });
    }
});

module.exports = router;
