const conexionDB = require('../database/conexionDB.js'); // Base de datos

// await conexionDB.query(sql) devuelve un arreglo de dos elementos: 
// * El primer elemento son las filas obtenidas de la consulta
// * El segundo elemento son los metadatos de las columnas

// const respuesta = await conexionDB.query(sql);
// respuesta === [ rows, fields ]

// Haciendo const [resultado] = await conexionDB.query(sql); me quedo solo con el primer elemento del arreglo

async function obtenerOfertasActivasYNoVencidas()
{
    const sql = `
        SELECT *
        FROM ofertas
        WHERE activo = 1
        AND fecha_fin > NOW()
    `;

    const [filas] = await conexionDB.query(sql);

    return filas;
}


async function obtenerTodasLasOfertas()
{
    const sql = `
        SELECT *
        FROM ofertas
    `;

    const [filas] = await conexionDB.query(sql);

    return filas;
}


async function obtenerOfertaPorId(id)
{
    const sql = `
        SELECT *
        FROM ofertas
        WHERE id = ?
    `;

    const [filas] = await conexionDB.query(sql, [id]);

    return filas[0];
}


async function obtenerCarritoActualId(usuario_id) 
{
    const sql = `
        SELECT *
        FROM carrito
        WHERE usuario_id = ? AND fecha_compra IS NULL
        LIMIT 1
    `;

    const [filas] = await conexionDB.query(sql, [usuario_id]);
    
    // Si existe, devolvemos el id; si no, devolvemos null 
    return filas.length > 0 ? filas[0].id : null;
}


async function crearCarrito(usuario_id)
{
    const sql = `
        INSERT INTO carrito (usuario_id)
        VALUES (?)
    `;

    const [resultado] = await conexionDB.query(sql, [usuario_id]);
    
    return resultado.insertId;
}


async function obtenerProductosDeLaOferta(oferta_id) 
{
    const sql = `
        SELECT 
            p.id,
            od.cantidad,
            p.nombre,
            p.descripcion,
            p.fuenteImagen,
            p.precio
        FROM oferta_detalle od
        INNER JOIN productos p 
        ON od.producto_id = p.id
        WHERE od.oferta_id = ?
    `;

    const [filas] = await conexionDB.query(sql, [oferta_id]);
    return filas;
}


async function agregarProductoAlCarrito(carrito_id, producto_id, oferta_id, cantidad) 
{
    // Chequeo si ya existe ese producto con esa oferta en el carrito.
    const [rows] = await conexionDB.query(
        `SELECT id, cantidad 
         FROM carrito_detalle 
         WHERE carrito_id = ? AND producto_id = ? AND oferta_id = ?`,
        [carrito_id, producto_id, oferta_id]
    );

    if (rows.length > 0) // Si existe
    {
        // Actualizo cantidad
        const nuevoTotal = rows[0].cantidad + cantidad;
        
        await conexionDB.query(
            `UPDATE carrito_detalle 
             SET cantidad = ? 
             WHERE id = ?`,
            [nuevoTotal, rows[0].id]
        );
    } 
    else // Si no existe
    {
        // Agrego el producto a la tabla
        await conexionDB.query(
            `INSERT INTO carrito_detalle (carrito_id, producto_id, oferta_id, cantidad, precio_unitario)
             VALUES (?, ?, ?, ?, NULL)`,
            [carrito_id, producto_id, oferta_id, cantidad]
        );
    }

    return null;
}




async function actualizarOferta(oferta) 
{
    const sql = `
        UPDATE ofertas
        SET nombre = ?, descripcion = ?, precio_original = ?, precio_oferta = ?, 
            fecha_inicio = ?, fecha_fin = ?, fuenteImagen = ?
        WHERE id = ?
    `;

    const [resultado] = await conexionDB.query(sql, [
        oferta.nombre,
        oferta.descripcion,
        oferta.precio_original,
        oferta.precio_oferta,
        oferta.fecha_inicio,
        oferta.fecha_fin,
        oferta.fuenteImagen,
        oferta.id
    ]);

    if (resultado.affectedRows === 0) return null;

    // Devuelvo la oferta actualizada
    return {
        id:              Number(oferta.id),
        nombre:          oferta.nombre,
        descripcion:     oferta.descripcion,
        precio_original: Number(oferta.precio_original),
        precio_oferta:   Number(oferta.precio_oferta),
        fecha_inicio:    oferta.fecha_inicio,
        fecha_fin:       oferta.fecha_fin,
        activo:          oferta.activo,
        fuenteImagen:    oferta.fuenteImagen
    };
}


async function eliminarProductosDeLaOferta(oferta_id) 
{
    const sql = `
        DELETE FROM oferta_detalle
        WHERE oferta_id = ?
    `;

    await conexionDB.query(sql, [oferta_id]);
 
    return;
}


async function agregarProductoAOferta(oferta_id, producto_id, cantidad) 
{
    const sql = `
        INSERT INTO oferta_detalle (oferta_id, producto_id, cantidad)
        VALUES (?, ?, ?)
    `;

    await conexionDB.query(sql, [oferta_id, producto_id, cantidad]);
    return;
}


async function eliminarOferta(id)
{
    // Baja lógica para no romper a todo lo que esta relacionado una oferta, como el historial
    const sql = `
        UPDATE ofertas
        SET activo = 0
        WHERE id = ?
    `;

    await conexionDB.query(sql, [id]);

    return;
}


async function crearOferta(oferta) 
{
    const sql = `
        INSERT INTO ofertas 
        (nombre, descripcion, precio_original, precio_oferta, fecha_inicio, fecha_fin, fuenteImagen, activo) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        oferta.nombre,
        oferta.descripcion || "",
        oferta.precio_original,
        oferta.precio_oferta,
        oferta.fecha_inicio || null,
        oferta.fecha_fin || null,
        oferta.fuenteImagen || null,
        oferta.activo
    ];

    const [resultado] = await conexionDB.query(sql, valores);

    // Devuelvo la oferta creada con su id
    return { id: resultado.insertId, ...oferta };
}


module.exports = { 
    obtenerOfertasActivasYNoVencidas,
    obtenerTodasLasOfertas,
    obtenerOfertaPorId,
    obtenerCarritoActualId,
    crearCarrito,
    obtenerProductosDeLaOferta,
    agregarProductoAlCarrito,
    actualizarOferta,
    eliminarProductosDeLaOferta,
    agregarProductoAOferta,
    eliminarOferta,
    crearOferta
};