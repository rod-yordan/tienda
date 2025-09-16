// db.js
const mysql = require('mysql2/promise');
// Crear pool de conexiones para manejar múltiples requests
const pool = mysql.createPool({
host: 'localhost',
user: 'root', // tu usuario de MySQL
password: '', // tu contraseña de MySQL
database: 'tienda'
});

module.exports = pool;