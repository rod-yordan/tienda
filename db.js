// db.js
const mysql = require('mysql2/promise');
// Crear pool de conexiones para manejar múltiples requests
const pool = mysql.createPool({
host: 'shortline.proxy.rlwy.net',
user: 'root', // tu usuario de MySQL
password: 'hUOdcOJJOVQaRNyDpYvXupVjvvMuxtwj', // tu contraseña de MySQL
database: 'railway',
port: 37348
});

module.exports = pool;