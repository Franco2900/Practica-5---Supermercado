const conexionDB = require('../database/conexionDB.js'); // Base de datos

// await conexionDB.query(sql) devuelve un arreglo de dos elementos: 
// * El primer elemento son las filas obtenidas de la consulta
// * El segundo elemento son los metadatos de las columnas

// const respuesta = await conexionDB.query(sql);
// respuesta === [ rows, fields ]

// Haciendo const [resultado] = await conexionDB.query(sql); me quedo solo con el primer elemento del arreglo

// Modulos
const bcryptjs = require('bcryptjs'); // Modulo para trabajar con contraseñas cifradas

async function iniciarSesion(nombreXemail, password) 
{
    const sql = `
        SELECT * 
        FROM usuarios 
        WHERE nombre = ? OR email = ?
        LIMIT 1
    `;

    const [filas] = await conexionDB.query(sql, [nombreXemail, nombreXemail]);

    // Usuario no encontrado
    if (filas.length === 0) return null; 
    
    // Usuario encontrado
    const usuario = filas[0];
    const hayCoincidencia = await bcryptjs.compare(password, usuario.password);
    
    if (hayCoincidencia) return usuario; // contraseña correcta
    else                 return null;    // contraseña incorrecta
}


module.exports = { iniciarSesion };