const express = require('express');
const router = express.Router();
const pool = require('../db/conexion');

// Obtener productos
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM productos';
    pool.query(sql, (err, resultados) => {
        if (err) {
            console.error('❌ Error al obtener productos:', err);
            res.status(500).json({ error: err.message });
        } else {
            res.json(resultados);
        }
    });
});

// Agregar un nuevo producto
router.post('/', (req, res) => {
    const { nombre, descripcion, precio, stock, categoria, imagen_url } = req.body;
    const sql = 'INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen_url) VALUES (?, ?, ?, ?, ?, ?)';
    const valores = [nombre, descripcion, precio, stock, categoria, imagen_url];

    pool.query(sql, valores, (err, resultado) => {
        if (err) {
            console.error('❌ Error al agregar producto:', err);
            res.status(500).json({ error: 'Error al agregar producto' });
        } else {
            res.status(201).json({ mensaje: 'Producto agregado correctamente', id: resultado.insertId });
        }
    });
});

// Editar un producto
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria, imagen_url } = req.body;
    const sql = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria = ?, imagen_url = ? WHERE id = ?';
    const valores = [nombre, descripcion, precio, stock, categoria, imagen_url, id];

    pool.query(sql, valores, (err, resultado) => {
        if (err) {
            console.error('❌ Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
        } else {
            res.json({ mensaje: 'Producto actualizado correctamente' });
        }
    });
});

// Eliminar un producto
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM productos WHERE id = ?';

    pool.query(sql, [id], (err, resultado) => {
        if (err) {
            console.error('❌ Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
        } else {
            res.json({ mensaje: 'Producto eliminado correctamente' });
        }
    });
});

module.exports = router;
