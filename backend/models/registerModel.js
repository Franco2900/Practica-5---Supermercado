const conexionDB = require('../database/conexionDB.js'); // Base de datos

// await conexionDB.query(sql) devuelve un arreglo de dos elementos: 
// * El primer elemento son las filas obtenidas de la consulta
// * El segundo elemento son los metadatos de las columnas

// const respuesta = await conexionDB.query(sql);
// respuesta === [ rows, fields ]

// Haciendo const [resultado] = await conexionDB.query(sql); me quedo solo con el primer elemento del arreglo

// Modulos
const bcryptjs = require('bcryptjs'); // Modulo para trabajar con contraseñas cifradas

async function existeUsuario(nombre, email) 
{
    const sql = `
        SELECT * 
        FROM usuarios 
        WHERE nombre = ?
        OR email = ?
    `;

    const [filas] = await conexionDB.query( sql, [nombre, email] ); 

    return filas.length > 0; // Si encuentra algún usuario, devuelve true
}


async function registrarUsuarioNuevo(nombre, email, password) 
{
    // Codifico la contraseña. El segundo parámetro es la longitud de saltos. Mientras más saltos, más seguro es (lo normal son entre 8 y 10)
    let contraseniaCifrada = bcryptjs.hashSync(password, 8); 

    const sql = `
        INSERT INTO usuarios (nombre, email, password)
        VALUES (?, ?, ?)
    `;

    const [resultado] = await conexionDB.query( sql, [nombre, email, contraseniaCifrada] );

    return resultado;
}

module.exports = { existeUsuario, registrarUsuarioNuevo };