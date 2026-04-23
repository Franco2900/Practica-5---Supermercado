const conexionDB = require('../database/conexionDB.js'); // Base de datos

// await conexionDB.query(sql) devuelve un arreglo de dos elementos: 
// * El primer elemento son las filas obtenidas de la consulta
// * El segundo elemento son los metadatos de las columnas

// const respuesta = await conexionDB.query(sql);
// respuesta === [ rows, fields ]

// Haciendo const [resultado] = await conexionDB.query(sql); me quedo solo con el primer elemento del arreglo

async function buscarTodosLosCarritosComprados(usuario_id)
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
            cd.cantidad,
            c.fecha_compra,
            cd.oferta_id,
            o.nombre AS oferta_nombre,
            o.precio_oferta
        FROM carrito c
        INNER JOIN carrito_detalle cd ON c.id = cd.carrito_id
        INNER JOIN productos p ON cd.producto_id = p.id
        LEFT JOIN ofertas o ON cd.oferta_id = o.id
        WHERE c.usuario_id = ? 
        AND c.fecha_compra IS NOT NULL
        ORDER BY c.fecha_compra DESC;
    `;

    const [filas] = await conexionDB.query(sql, [usuario_id]);
    return filas;
}



async function busquedaConFiltro(usuario_id, fecha_desde, fecha_hasta)
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
            cd.cantidad,
            c.fecha_compra,
            cd.oferta_id,
            o.nombre AS oferta_nombre,
            o.precio_oferta
        FROM carrito c
        INNER JOIN carrito_detalle cd ON c.id = cd.carrito_id
        INNER JOIN productos p ON cd.producto_id = p.id
        LEFT JOIN ofertas o ON cd.oferta_id = o.id
        WHERE c.usuario_id = ? 
        AND c.fecha_compra IS NOT NULL
        AND DATE(c.fecha_compra) BETWEEN ? AND ?
        ORDER BY c.fecha_compra DESC;
    `;

    const [filas] = await conexionDB.query(sql, [usuario_id, fecha_desde, fecha_hasta]);
    return filas;
}



module.exports = { 
    buscarTodosLosCarritosComprados,
    busquedaConFiltro
};