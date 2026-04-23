const conexionDB = require('../database/conexionDB.js'); // Base de datos

// await conexionDB.query(sql) devuelve un arreglo de dos elementos: 
// * El primer elemento son las filas obtenidas de la consulta
// * El segundo elemento son los metadatos de las columnas

// const respuesta = await conexionDB.query(sql);
// respuesta === [ rows, fields ]

// Haciendo const [resultado] = await conexionDB.query(sql); me quedo solo con el primer elemento del arreglo

async function buscarTop5Productos(email) 
{
    const sql = `
        SELECT *
        FROM productos 
        ORDER BY ingresos_generados DESC
        LIMIT 5;
    `;

    const [filas] = await conexionDB.query( sql, [email] ); 

    return filas; 
}


async function buscarProductos(email) 
{
    const sql = `
        SELECT *
        FROM productos 
        ORDER BY ingresos_generados DESC;
    `;

    const [filas] = await conexionDB.query( sql, [email] ); 

    return filas; 
}


async function buscarIngresos(email) 
{
    const sql = `
        SELECT 
            YEAR(fecha_compra) AS anio,
            MONTH(fecha_compra) AS mes,
            SUM(cd.precio_unitario * cd.cantidad) AS ingresos_mes
        FROM carrito_detalle cd
        JOIN carrito c ON cd.carrito_id = c.id
        GROUP BY anio, mes
        ORDER BY anio, mes;
    `;

    const [filas] = await conexionDB.query( sql ); 
    
    return filas;
}

module.exports = { buscarTop5Productos, buscarProductos, buscarIngresos }