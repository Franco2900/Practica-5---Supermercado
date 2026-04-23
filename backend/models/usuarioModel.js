const conexionDB = require('../database/conexionDB.js'); // Base de datos

// await conexionDB.query(sql) devuelve un arreglo de dos elementos: 
// * El primer elemento son las filas obtenidas de la consulta
// * El segundo elemento son los metadatos de las columnas

// const respuesta = await conexionDB.query(sql);
// respuesta === [ rows, fields ]

// Haciendo const [resultado] = await conexionDB.query(sql); me quedo solo con el primer elemento del arreglo

async function verificarNombre(usuario_id, nombre)
{
    const sql = `
        SELECT 1
        FROM usuarios
        WHERE nombre = ? AND id <> ?
        LIMIT 1
    `;

    const [filas] = await conexionDB.query(sql, [nombre, usuario_id]);

    // Si hay al menos un registro, significa que el nombre existe en otro usuario
    return filas.length > 0;
}


// Actualiza datos del usuario, incluyendo imagen opcional
async function actualizarDatos(usuario_id, nombre, telefono, direccion, fuente_imagen) 
{
    let sql, params;

    if (fuente_imagen) // Si se subió imagen, actualizamos también ese campo
    {
        sql = `
        UPDATE usuarios
        SET nombre = ?, telefono = ?, direccion = ?, fuente_imagen = ?
        WHERE id = ?
        `;
        params = [nombre, telefono, direccion, fuente_imagen, usuario_id];
    } 
    else // Si no se subió imagen, dejamos la anterior intacta 
    {
        sql = `
        UPDATE usuarios
        SET nombre = ?, telefono = ?, direccion = ?
        WHERE id = ?
        `;
        params = [nombre, telefono, direccion, usuario_id];
    }

    await conexionDB.query(sql, params);
}


async function traerUsuario(usuario_id)
{
    const sql = `
        SELECT *
        FROM usuarios
        WHERE id = ?
    `;

    const [filas] = await conexionDB.query(sql, [usuario_id]);

    return filas[0];
}


async function buscarUsuariosPorNombre(search) 
{
    const sql = `
        SELECT id, nombre, fuente_imagen
        FROM usuarios
        WHERE nombre LIKE CONCAT('%', ?, '%')
        ORDER BY nombre ASC
        LIMIT 10
    `;

    const [filas] = await conexionDB.query(sql, [search]);

    return filas;
}


async function cambiarRol(usuario_id, nuevoRol)
{
    const sql = `
        UPDATE usuarios 
        SET rol = ? 
        WHERE id = ?
    `;

    await conexionDB.query(sql, [nuevoRol, usuario_id]);

    return nuevoRol;
}

module.exports = {
    verificarNombre,
    actualizarDatos,
    traerUsuario,
    buscarUsuariosPorNombre,
    cambiarRol
}