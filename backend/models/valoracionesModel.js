const conexionDB = require('../database/conexionDB.js'); // Base de datos

// await conexionDB.query(sql) devuelve un arreglo de dos elementos: 
// * El primer elemento son las filas obtenidas de la consulta
// * El segundo elemento son los metadatos de las columnas

// const respuesta = await conexionDB.query(sql);
// respuesta === [ rows, fields ]

// Haciendo const [resultado] = await conexionDB.query(sql); me quedo solo con el primer elemento del arreglo

async function existeValoracionDelUsuario(id_producto, id_usuario) 
{
    const sql = `
        SELECT * 
        FROM valoraciones
        WHERE id_producto = ? AND id_usuario = ?;
    `;
    
    const [rows] = await conexionDB.query(sql, [id_producto, id_usuario]);
    
    return rows.length > 0 ? rows[0] : null;
}


async function obtenerValoracionDelUsuario(id_producto, id_usuario) 
{
    const sql = `
        SELECT estrellas
        FROM valoraciones
        WHERE id_producto = ? AND id_usuario = ?;
    `;
    
    const [rows] = await conexionDB.query(sql, [id_producto, id_usuario]);
    
    return rows.length > 0 ? rows[0].estrellas : null;
}


async function insertarValoracion(valoracion, id_producto, id_usuario) 
{
    const sql = `
        INSERT INTO valoraciones (estrellas, id_producto, id_usuario)
        VALUES (?, ?, ?);
    `;

    const [resultado] = await conexionDB.query(sql, [valoracion, id_producto, id_usuario]);
    
    return resultado;
}


// Modifica una valoración existente
async function modificarValoracion(valoracion, id_producto, id_usuario) 
{
    const sql = `
        UPDATE valoraciones
        SET estrellas = ?, fecha_creacion = NOW()
        WHERE id_producto = ? AND id_usuario = ?;
    `;

    const [resultado] = await conexionDB.query(sql, [valoracion, id_producto, id_usuario]);
    
    return resultado;
}


async function actualizarPromedioEnProducto(id_producto) 
{
    const sql = `
        SELECT AVG(estrellas) AS valoracionPromedio, COUNT(*) AS cantidadValoraciones
        FROM valoraciones
        WHERE id_producto = ?;
    `;
    
    let [rows] = await conexionDB.query(sql, [id_producto]);
    
    const { valoracionPromedio, cantidadValoraciones } = rows[0];

    const sqlUpdate = `
        UPDATE productos
        SET valoracion_promedio = ?, cantidad_valoraciones = ?
        WHERE id = ?;
    `;
    
    await conexionDB.query(sqlUpdate, [valoracionPromedio, cantidadValoraciones, id_producto]);

    return { valoracionPromedio, cantidadValoraciones }
}

module.exports = { 
    existeValoracionDelUsuario,
    obtenerValoracionDelUsuario,
    insertarValoracion,
    modificarValoracion,
    actualizarPromedioEnProducto
};