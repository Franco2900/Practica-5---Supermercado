const conexionDB = require('../../conexionDB.js');
const { chequearExistenciaTablaIntermedia } = require('./loadUtils.js'); 

async function cargaDatosDePruebaTablaOfertaDetalle()
{
    console.log('Cargando datos de prueba a la tabla oferta_detalle');

    const ofertaDetalles = [

        // Oferta 1: Desayuno Saludable
        { oferta_id: 1, producto_id: 2, cantidad: 1 }, // Leche Entera
        { oferta_id: 1, producto_id: 3, cantidad: 1 }, // Pan Integral
        { oferta_id: 1, producto_id: 5, cantidad: 1 }, // Café Molido

        // Oferta 2: Picada de Campo
        { oferta_id: 2, producto_id: 3, cantidad: 1 }, // Pan Integral
        { oferta_id: 2, producto_id: 4, cantidad: 1 }, // Queso Cremoso
        { oferta_id: 2, producto_id: 9, cantidad: 1 }, // Vino Tinto Malbec

        // Oferta 3: Limpieza Total
        { oferta_id: 3, producto_id: 14, cantidad: 1 }, // Detergente Líquido
        { oferta_id: 3, producto_id: 15, cantidad: 1 }, // Lavandina
        { oferta_id: 3, producto_id: 17, cantidad: 1 }, // Limpiador Multiuso

        // Oferta 4: Outfit Urbano
        { oferta_id: 4, producto_id: 10, cantidad: 1 }, // Remera Algodón
        { oferta_id: 4, producto_id: 11, cantidad: 1 }, // Pantalón Jeans
        { oferta_id: 4, producto_id: 12, cantidad: 1 }, // Zapatillas Deportivas

        // Oferta 5: Dúo Refrescante
        { oferta_id: 5, producto_id: 8, cantidad: 1 },  // Agua Mineral
        { oferta_id: 5, producto_id: 7, cantidad: 1 },  // Jugo de Naranja

        // Oferta 6: Pareja Dulce
        { oferta_id: 6, producto_id: 23, cantidad: 1 }, // Miel Orgánica
        { oferta_id: 6, producto_id: 20, cantidad: 1 }, // Galletitas de Avena

        // Oferta 7: Pack Limpieza Hogar
        { oferta_id: 7, producto_id: 14, cantidad: 1 }, // Detergente Líquido
        { oferta_id: 7, producto_id: 15, cantidad: 1 }, // Lavandina
        { oferta_id: 7, producto_id: 16, cantidad: 1 }, // Jabón en Polvo
        { oferta_id: 7, producto_id: 17, cantidad: 1 }, // Limpiador Multiuso

        // Oferta 8: Combo Fitness
        { oferta_id: 8, producto_id: 12, cantidad: 1 }, // Zapatillas Deportivas
        { oferta_id: 8, producto_id: 30, cantidad: 1 }, // Pelota de Fútbol
        { oferta_id: 8, producto_id: 8,  cantidad: 1 }, // Agua Mineral
        { oferta_id: 8, producto_id: 21, cantidad: 1 }  // Té Verde
    ];

    for (const detalle of ofertaDetalles) {
        await cargarOfertaDetalle(detalle);
    }

    console.log('Datos completamente cargados en la tabla oferta_detalle');
}


async function cargarOfertaDetalle(detalle)
{
    const existeDetalle = await chequearExistenciaTablaIntermedia(
        'oferta_detalle',
        'oferta_id', detalle.oferta_id,
        'producto_id', detalle.producto_id
    );

    if (existeDetalle) console.log(`ERROR: Ya existe el detalle oferta_id=${detalle.oferta_id}, producto_id=${detalle.producto_id}`);
    else 
    {
        try 
        {
            await conexionDB.query('INSERT INTO oferta_detalle SET ?', detalle);
            console.log(`Se hizo el alta del detalle: oferta_id=${detalle.oferta_id}, producto_id=${detalle.producto_id}`);
        } 
        catch (error) 
        { 
            console.log(error); 
        }
    }
}

module.exports = { cargaDatosDePruebaTablaOfertaDetalle };
