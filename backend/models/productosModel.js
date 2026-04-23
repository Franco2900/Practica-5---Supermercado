const conexionDB = require('../database/conexionDB.js'); // Base de datos

// await conexionDB.query(sql) devuelve un arreglo de dos elementos: 
// * El primer elemento son las filas obtenidas de la consulta
// * El segundo elemento son los metadatos de las columnas

// const respuesta = await conexionDB.query(sql);
// respuesta === [ rows, fields ]

// Haciendo const [resultado] = await conexionDB.query(sql); me quedo solo con el primer elemento del arreglo

async function buscarTodosLosProductos()
{
    const sql = `
        SELECT * 
        FROM productos
        WHERE activo = 1
        ORDER BY nombre ASC;
    `;

    const [filas] = await conexionDB.query(sql);

    return filas;
}


async function buscarMasVendidos()
{
    const sql = `
        SELECT * 
        FROM productos
        WHERE activo = 1
        ORDER BY cantidad_vendido ASC
        LIMIT 5;
    `;

    const [filas] = await conexionDB.query(sql);

    return filas;
}


async function buscarTodosLosProductosMasFavoritosDelUsuario(usuario_id)
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
            CASE 
                WHEN f.producto_id IS NOT NULL THEN 1 
                ELSE 0 
            END AS es_favorito
        FROM productos p
        LEFT JOIN favoritos f 
            ON p.id = f.producto_id 
            AND f.usuario_id = ?
        WHERE p.activo = 1
        ORDER BY es_favorito DESC, p.nombre ASC;
    `;

    const [filas] = await conexionDB.query(sql, [usuario_id]);

    return filas;
}



async function buscarProducto(id)
{
    const sql = `
        SELECT * 
        FROM productos
        WHERE id = ?
        AND activo = 1
        LIMIT 1;
    `;

    const [filas] = await conexionDB.query(sql, [id]);

    return filas[0];
}


async function buscarSugerencias(nombre) 
{
    const sql = `
        SELECT id, nombre, fuenteImagen
        FROM productos
        WHERE LOWER(nombre) LIKE LOWER(?)
        AND activo = 1
        ORDER BY nombre ASC
        LIMIT 5;
    `;
    // Limite de 5 sugerencias para que no devuelva toda la tabla

    const [filas] = await conexionDB.query(sql, [`%${nombre}%`]);

    return filas;
}


async function eliminarProducto(id)
{
    // Baja lógica para no romper a todo lo que esta relacionado un producto, como el historial
    const sql = `
        UPDATE productos
        SET activo = 0
        WHERE id = ?
    `;

    await conexionDB.query(sql, [id]);

    return;
}



async function actualizarProducto(producto) 
{
    const sql = `
        UPDATE productos
        SET nombre = ?, descripcion = ?, precio = ?, categoria = ?, subcategoria = ?, fuenteImagen = ?
        WHERE id = ?
    `;

    const [resultado] = await conexionDB.query(sql, [
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.categoria,
        producto.subcategoria,
        producto.fuenteImagen,
        producto.id
    ]);

    if (resultado.affectedRows === 0) return null;

    // Devuelvo el producto actualizado
    return {
        id: Number(producto.id),
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: Number(producto.precio),
        categoria: producto.categoria,
        subcategoria: producto.subcategoria,
        fuenteImagen: producto.fuenteImagen
    };
}


async function agregarProducto(producto) 
{
    const sql = `
        INSERT INTO productos (nombre, descripcion, precio, categoria, subcategoria, fuenteImagen, activo)
        VALUES (?, ?, ?, ?, ?, ?, 1)
    `;

    const [resultado] = await conexionDB.query(sql, [
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.categoria,
        producto.subcategoria,
        producto.fuenteImagen
    ]);

    // Devuelvo el producto insertado con su nuevo id
    return {
        id: resultado.insertId,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: Number(producto.precio),
        categoria: producto.categoria,
        subcategoria: producto.subcategoria,
        fuenteImagen: producto.fuenteImagen
    };
}


module.exports = { 
    buscarTodosLosProductos, 
    buscarMasVendidos,
    buscarTodosLosProductosMasFavoritosDelUsuario,
    buscarProducto,
    buscarSugerencias,
    eliminarProducto,
    actualizarProducto,
    agregarProducto
};