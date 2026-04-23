// Variables de entorno
require('dotenv').config({ path: __dirname + '/../.env' }); // Carga las variables de .env en process.env

// Modulos
const mysql = require('mysql2/promise'); // Permite usar mysql

// Creo la conexión a la base de datos 
const conexionDB = mysql.createPool({ 
    host:     process.env.DB_HOST, 
    user:     process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME
});

module.exports = conexionDB;