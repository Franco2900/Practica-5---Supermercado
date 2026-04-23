const conexionDB = require('../database/conexionDB.js'); // Base de datos

// await conexionDB.query(sql) devuelve un arreglo de dos elementos: 
// * El primer elemento son las filas obtenidas de la consulta
// * El segundo elemento son los metadatos de las columnas

// const respuesta = await conexionDB.query(sql);
// respuesta === [ rows, fields ]

// Haciendo const [resultado] = await conexionDB.query(sql); me quedo solo con el primer elemento del arreglo

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


async function consultarPrecio(producto_id)
{
    const sql = `
        SELECT precio
        FROM productos
        WHERE id = ?
    `;

    const [filas] = await conexionDB.query(sql, [producto_id]);

    return filas[0].precio;
}


async function agregarProductoAlCarrito(carrito_id, producto_id, cantidad, precio_unitario, oferta_id = null) 
{
    // Verifico si ya existe el producto en el carrito
    const [rows] = await conexionDB.query(
        `SELECT id, cantidad 
        FROM carrito_detalle 
        WHERE carrito_id = ? AND producto_id = ?
        AND  ( 
            (oferta_id IS NULL AND ? IS NULL) 
            OR oferta_id = ?
        )`,
        [carrito_id, producto_id, oferta_id, oferta_id]
    );
    // oferta_id IS NULL AND ? IS NULL: Busca productos individuales no asociados a ninguna oferta
    // oferta_id = ?: Busca productos que pertenezcan a una oferta


    if (rows.length > 0) // Si ya existe el producto en el carrito, solo actualizo la cantidad
    {
        const nuevoTotal = rows[0].cantidad + cantidad;

        await conexionDB.query(
            `UPDATE carrito_detalle 
            SET cantidad = ? 
            WHERE id = ?`,
            [nuevoTotal, rows[0].id]
        );
    } 
    else // Si no existe el producto en el carrito, inserto un nuevo registro
    {
        await conexionDB.query(
            `INSERT INTO carrito_detalle (carrito_id, producto_id, cantidad, precio_unitario)
            VALUES (?, ?, ?, ?)`,
            [carrito_id, producto_id, cantidad, precio_unitario]
        );
    }
}



async function obtenerProductosDelCarritoActual(carrito_id)
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
            cd.oferta_id,
            o.nombre AS oferta_nombre,
            o.precio_oferta,
            od.cantidad AS cantidad_oferta_detalle
        FROM productos p
        INNER JOIN carrito_detalle cd
            ON p.id = cd.producto_id
        LEFT JOIN ofertas o
            ON cd.oferta_id = o.id
        LEFT JOIN oferta_detalle od
            ON od.oferta_id = o.id AND od.producto_id = p.id    
        WHERE cd.carrito_id = ?;
    `;

    const [filas] = await conexionDB.query(sql, [carrito_id]);
    
    return filas;
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


async function actualizarProductoCantidad(producto_id, cantidad) 
{
    const sql = `
        UPDATE productos
        SET cantidad_vendido = cantidad_vendido + ?
        WHERE id = ?
    `;

    await conexionDB.query(sql, [cantidad, producto_id]);

    return;
}


async function chequearDineroDelUsuario(usuario_id)
{
    const sql = `
        SELECT dinero_disponible
        FROM usuarios
        WHERE id = ?
    `;

    const [filas] = await conexionDB.query(sql, [usuario_id]);

    return filas[0].dinero_disponible;
}


async function comprarCarrito(fechaActual, precio, usuario_id)
{
    const sql = `
        UPDATE carrito
        SET fecha_compra = ?, precio = ?
        WHERE usuario_id = ? 
        AND fecha_compra IS NULL
    `;

    await conexionDB.query(sql, [fechaActual, precio, usuario_id]);

    return;
}


async function actualizarDineroDelUsuario(dinero_disponible, usuario_id)
{
    const sql = `
        UPDATE usuarios
        SET dinero_disponible = ?
        WHERE id = ?
    `;

    await conexionDB.query(sql, [dinero_disponible, usuario_id]);

    return;
}


async function modificarCantidadProductoEnCarrito(carrito_id, producto_id, cantidad, oferta_id)
{
    const sql = `
        UPDATE carrito_detalle
        SET cantidad = ?
        WHERE carrito_id = ?
        AND producto_id = ?
        AND (
            (oferta_id IS NULL AND ? IS NULL) 
            OR oferta_id = ?
        )
    `;

    await conexionDB.query(sql, [cantidad, carrito_id, producto_id, oferta_id, oferta_id]);

    return;
}


async function modificarCantidadOfertaEnCarrito(carrito_id, oferta_id, cantidad) 
{
  const sql = `
    UPDATE carrito_detalle
    SET cantidad = ?
    WHERE carrito_id = ?
    AND oferta_id = ?;
  `;
  
  await conexionDB.query(sql, [cantidad, carrito_id, oferta_id]);

  return;
}


async function obtenerUsuarioActualizado(usuario_id)
{
    const sql = `
        SELECT * 
        FROM USUARIOS
        WHERE id = ?
    `;

    const [filas] = await conexionDB.query(sql, [usuario_id]);

    return filas[0];
}


async function actualizarProductoVenta(producto_id, cantidad, ingresos) 
{
    const sql = `
        UPDATE productos
        SET cantidad_vendido = cantidad_vendido + ?,
            ingresos_generados = ingresos_generados + ?
        WHERE id = ?
    `;

    await conexionDB.query(sql, [cantidad, ingresos, producto_id]);

    return;
}


async function actualizarOfertaVenta(oferta_id, ingresos, cantidad) 
{
    const sql = `
        UPDATE ofertas
        SET cantidad_vendido = cantidad_vendido + ?,
            ingresos_generados = ingresos_generados + ?
        WHERE id = ?
    `;
    await conexionDB.query(sql, [cantidad, ingresos, oferta_id]);
    return; 
}



async function quitarProducto(carrito_id, producto_id)
{
    const sql = `
        DELETE FROM carrito_detalle
        WHERE carrito_id = ? AND producto_id = ?
    `;

    await conexionDB.query(sql, [carrito_id, producto_id]);
    
    return null;
}


async function quitarProductosDeOferta(carrito_id, producto_id)
{
    const sql = `
        DELETE FROM carrito_detalle
        WHERE carrito_id = ? AND oferta_id = ?;
    `;

    await conexionDB.query(sql, [carrito_id, producto_id]);
    
    return null;
}


async function quitarTodosLosProductos(carrito_id)
{
    const sql = `
        DELETE FROM carrito_detalle
        WHERE carrito_id = ?
    `;

    await conexionDB.query(sql, [carrito_id]);
    
    return null;
}


module.exports = { 
    obtenerCarritoActualId,
    crearCarrito,
    consultarPrecio,
    agregarProductoAlCarrito,
    obtenerProductosDelCarritoActual,
    obtenerProductosDeLaOferta,
    actualizarProductoCantidad,
    chequearDineroDelUsuario,
    comprarCarrito,
    actualizarDineroDelUsuario,
    modificarCantidadProductoEnCarrito,
    modificarCantidadOfertaEnCarrito,
    obtenerUsuarioActualizado,
    quitarProducto,
    quitarProductosDeOferta,
    quitarTodosLosProductos,
    actualizarProductoVenta,
    actualizarOfertaVenta
};