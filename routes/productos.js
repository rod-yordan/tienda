const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('./routes');

// Obtener productos (público, opcional filtro por categoría)
router.get('/', async (req, res) => {
  const { categoria_id } = req.query;
  try {
    let query = `
      SELECT p.id, p.nombre, p.precio, c.nombre AS categoria, c.id AS categoria_id
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
    `;
    const params = [];
    if (categoria_id) {
      query += ' WHERE p.categoria_id = ?';
      params.push(categoria_id);
    }
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear producto (protegido)
router.post('/', verifyToken, async (req, res) => {
  const { nombre, precio, categoria_id } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO productos (nombre, precio, categoria_id) VALUES (?, ?, ?)',
      [nombre, precio, categoria_id]
    );
    res.json({ id: result.insertId, nombre, precio, categoria_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar producto
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, categoria_id } = req.body;
  try {
    await db.query(
      'UPDATE productos SET nombre = ?, precio = ?, categoria_id = ? WHERE id = ?',
      [nombre, precio, categoria_id, id]
    );
    res.json({ id, nombre, precio, categoria_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar producto
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM productos WHERE id = ?', [id]);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
