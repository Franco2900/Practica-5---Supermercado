const conexionDB = require('../../conexionDB.js');

async function cargaDatosDePruebaTablaCarritoDetalle()
{
    console.log('Cargando datos de prueba a la tabla carrito');

    const carritoDetalles = [
        { carrito_id: 1, producto_id: 3, cantidad: 1, precio_unitario: 800 },
        { carrito_id: 1, producto_id: 2, cantidad: 1, precio_unitario: 950 },
        { carrito_id: 1, producto_id: 5, cantidad: 1, precio_unitario: 3200 },

        { carrito_id: 2, producto_id: 4, cantidad: 1, precio_unitario: 2500 },
        { carrito_id: 2, producto_id: 9, cantidad: 1, precio_unitario: 5200 },

        { carrito_id: 3, producto_id: 14, cantidad: 2, precio_unitario: 950 },
        { carrito_id: 3, producto_id: 15, cantidad: 1, precio_unitario: 750 },

        { carrito_id: 4, producto_id: 10, cantidad: 1, precio_unitario: 3500 },
        { carrito_id: 4, producto_id: 11, cantidad: 1, precio_unitario: 7200 },
        { carrito_id: 4, producto_id: 12, cantidad: 1, precio_unitario: 12500 },

        { carrito_id: 5, producto_id: 9, cantidad: 1, precio_unitario: 5200 },
        { carrito_id: 6, producto_id: 28, cantidad: 1, precio_unitario: 8500 },
        { carrito_id: 7, producto_id: 12, cantidad: 1, precio_unitario: 12500 },
        { carrito_id: 8, producto_id: 13, cantidad: 1, precio_unitario: 18500 },
        { carrito_id: 9, producto_id: 30, cantidad: 1, precio_unitario: 6500 },
        { carrito_id: 10, producto_id: 29, cantidad: 1, precio_unitario: 220000 },

        { carrito_id: 11, producto_id: 26, cantidad: 1, precio_unitario: 4800 },
        { carrito_id: 12, producto_id: 27, cantidad: 1, precio_unitario: 25000 },
        { carrito_id: 13, producto_id: 28, cantidad: 1, precio_unitario: 8500 },
        { carrito_id: 14, producto_id: 12, cantidad: 1, precio_unitario: 12500 },
        { carrito_id: 15, producto_id: 13, cantidad: 1, precio_unitario: 18500 },
        { carrito_id: 16, producto_id: 30, cantidad: 1, precio_unitario: 6500 },
        { carrito_id: 17, producto_id: 29, cantidad: 1, precio_unitario: 220000 },
        { carrito_id: 18, producto_id: 26, cantidad: 1, precio_unitario: 4800 },
        { carrito_id: 19, producto_id: 27, cantidad: 1, precio_unitario: 25000 },
        { carrito_id: 20, producto_id: 28, cantidad: 1, precio_unitario: 8500 },
        { carrito_id: 21, producto_id: 12, cantidad: 1, precio_unitario: 12500 },
        { carrito_id: 22, producto_id: 13, cantidad: 1, precio_unitario: 18500 },
        { carrito_id: 23, producto_id: 30, cantidad: 1, precio_unitario: 6500 },
        { carrito_id: 24, producto_id: 29, cantidad: 1, precio_unitario: 220000 },
        { carrito_id: 25, producto_id: 26, cantidad: 1, precio_unitario: 4800 },
        { carrito_id: 26, producto_id: 27, cantidad: 1, precio_unitario: 25000 },
        { carrito_id: 27, producto_id: 28, cantidad: 1, precio_unitario: 8500 },
        { carrito_id: 28, producto_id: 12, cantidad: 1, precio_unitario: 12500 },
        { carrito_id: 29, producto_id: 13, cantidad: 1, precio_unitario: 18500 },
        { carrito_id: 30, producto_id: 30, cantidad: 1, precio_unitario: 6500 }
    ]

    for (const detalle of carritoDetalles) {
        await cargarCarritoDetalle(detalle);
    }

    console.log('Datos completamente cargados en la tabla carrito_detalle');
}


async function cargarCarritoDetalle(carrito) 
{
    try 
    {
        await conexionDB.query('INSERT INTO carrito_detalle SET ?', carrito);
        console.log(`Se hizo el alta del carrito_detalle: carrito_id=${carrito.carrito_id}, cantidad=${carrito.cantidad}, precio_unitario:${carrito.precio_unitario}`);
    } 
    catch (error) 
    {
        console.error(error);
    }
}

module.exports = { cargaDatosDePruebaTablaCarritoDetalle };
