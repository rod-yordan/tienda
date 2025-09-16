const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('./routes'); // middleware JWT

// Obtener todas las categorías (público)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categorias');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear categoría (usuarios logueados)
router.post('/', verifyToken, async (req, res) => {
  const { nombre } = req.body;
  try {
    const [result] = await db.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre]);
    res.json({ id: result.insertId, nombre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar categoría
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    await db.query('UPDATE categorias SET nombre = ? WHERE id = ?', [nombre, id]);
    res.json({ id, nombre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar categoría
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM categorias WHERE id = ?', [id]);
    res.json({ mensaje: 'Categoría eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
