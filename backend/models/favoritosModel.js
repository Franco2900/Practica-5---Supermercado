const conexionDB = require('../database/conexionDB.js'); // Base de datos

// await conexionDB.query(sql) devuelve un arreglo de dos elementos: 
// * El primer elemento son las filas obtenidas de la consulta
// * El segundo elemento son los metadatos de las columnas

// const respuesta = await conexionDB.query(sql);
// respuesta === [ rows, fields ]

// Haciendo const [resultado] = await conexionDB.query(sql); me quedo solo con el primer elemento del arreglo


async function agregarFavorito(producto_id, usuario_id)
{
    const sql = `
        INSERT INTO favoritos (producto_id, usuario_id)
        VALUES (?, ?)
    `;

    await conexionDB.query(sql, [producto_id, usuario_id]);

    return;
}


async function quitarFavorito(producto_id, usuario_id)
{
    const sql = `
        DELETE FROM favoritos
        WHERE producto_id = ? AND usuario_id = ?
    `;

    await conexionDB.query(sql, [producto_id, usuario_id]);

    return;
}


async function buscarSoloProductosFavoritosDelUsuario(usuario_id) 
{
    const sql = `
        SELECT 
            p.id,
            p.nombre,
            p.descripcion,
            p.fuenteImagen,
            p.precio,
            p.categoria,
            p.subcategoria,
            1 AS es_favorito
        FROM productos p
        INNER JOIN favoritos f 
            ON p.id = f.producto_id 
            AND f.usuario_id = ?
        ORDER BY p.nombre ASC;
    `;

    const [filas] = await conexionDB.query(sql, [usuario_id]);
    
    return filas;
}

module.exports = { 
    agregarFavorito, 
    quitarFavorito,
    buscarSoloProductosFavoritosDelUsuario
};