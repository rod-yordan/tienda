const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../db"); // Conexión a la base de datos
const router = express.Router();

const SECRET_KEY = "mi_secreto_ultra_seguro"; // Mantener en secreto

// LOGIN - Generar token
router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = ? AND password = MD5(?)",
      [usuario, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    const user = rows[0];
    const token = jwt.sign({ id: user.id, usuario: user.usuario }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ message: "Login exitoso", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Middleware para verificar token
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token requerido" });

  jwt.verify(token.replace("Bearer ", ""), SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido o expirado" });
    req.user = decoded;
    next();
  });
}

// Ruta protegida de ejemplo
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, usuario FROM usuarios WHERE id = ?",
      [req.user.id]
    );
    res.json({ message: "Acceso autorizado", user: rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Error al obtener datos" });
  }
});

module.exports = router;
module.exports.verifyToken = verifyToken; // ✅ Exportar middleware
