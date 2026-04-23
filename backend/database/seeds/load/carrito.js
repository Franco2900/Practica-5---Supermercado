const conexionDB = require('../../conexionDB.js');

async function cargaDatosDePruebaTablaCarrito()
{
    console.log('Cargando datos de prueba a la tabla carrito');

    const carritos = [
        { precio: 4300,   fecha_compra: '2024-01-15 10:30:00', usuario_id: 1 },
        { precio: 7500,   fecha_compra: '2024-02-20 18:45:00', usuario_id: 1 },
        { precio: 2500,   fecha_compra: '2024-03-05 12:00:00', usuario_id: 1 },
        { precio: 21000,  fecha_compra: '2024-04-10 09:15:00', usuario_id: 1 },
        { precio: 5200,   fecha_compra: '2024-05-22 14:20:00', usuario_id: 1 },
        { precio: 8500,   fecha_compra: '2024-06-14 20:00:00', usuario_id: 1 },
        { precio: 12500,  fecha_compra: '2024-07-02 11:10:00', usuario_id: 1 },
        { precio: 18500,  fecha_compra: '2024-08-19 16:40:00', usuario_id: 1 },
        { precio: 6500,   fecha_compra: '2024-09-25 08:55:00', usuario_id: 1 },
        { precio: 220000, fecha_compra: '2024-10-30 19:30:00', usuario_id: 1 },
        { precio: 4800,   fecha_compra: '2025-01-12 13:00:00', usuario_id: 1 },
        { precio: 25000,  fecha_compra: '2025-02-18 17:45:00', usuario_id: 1 },
        { precio: 8500,   fecha_compra: '2025-03-21 09:20:00', usuario_id: 1 },
        { precio: 12500,  fecha_compra: '2025-04-07 15:10:00', usuario_id: 1 },
        { precio: 18500,  fecha_compra: '2025-05-15 10:00:00', usuario_id: 1 },
        { precio: 6500,   fecha_compra: '2025-06-23 18:30:00', usuario_id: 1 },
        { precio: 220000, fecha_compra: '2025-07-29 12:45:00', usuario_id: 1 },
        { precio: 4800,   fecha_compra: '2025-08-11 14:50:00', usuario_id: 1 },
        { precio: 25000,  fecha_compra: '2025-09-19 09:05:00', usuario_id: 1 },
        { precio: 8500,   fecha_compra: '2025-10-27 20:15:00', usuario_id: 1 },
        { precio: 12500,  fecha_compra: '2026-01-14 11:25:00', usuario_id: 1 },
        { precio: 18500,  fecha_compra: '2026-02-09 17:40:00', usuario_id: 1 },
        { precio: 6500,   fecha_compra: '2026-03-22 08:15:00', usuario_id: 1 },
        { precio: 220000, fecha_compra: '2026-04-30 19:00:00', usuario_id: 1 },
        { precio: 4800,   fecha_compra: '2026-05-18 13:30:00', usuario_id: 1 },
        { precio: 25000,  fecha_compra: '2026-06-25 16:45:00', usuario_id: 1 },
        { precio: 8500,   fecha_compra: '2026-07-12 10:20:00', usuario_id: 1 },
        { precio: 12500,  fecha_compra: '2026-08-05 15:55:00', usuario_id: 1 },
        { precio: 18500,  fecha_compra: '2026-09-19 09:40:00', usuario_id: 1 },
        { precio: 6500,   fecha_compra: '2026-10-27 18:10:00', usuario_id: 1 },
    ];


    for (const carrito of carritos) {
        await cargarCarrito(carrito);
    }

    console.log('Datos completamente cargados en la tabla carrito');
}


async function cargarCarrito(carrito) 
{
    try 
    {
        await conexionDB.query('INSERT INTO carrito SET ?', carrito);
        console.log(`Se hizo el alta del carrito: usuario_id=${carrito.usuario_id}, fecha=${carrito.fecha_compra}`);
    } 
    catch (error) 
    {
        console.error(error);
    }
}

module.exports = { cargaDatosDePruebaTablaCarrito };
