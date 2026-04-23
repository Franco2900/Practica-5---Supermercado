const { cargaDatosDePruebaTablaUsuarios }       = require('./usuarios.js');
const { cargaDatosDePruebaTablaProductos }      = require('./2_productos.js');
const { cargaDatosDePruebaTablaOfertas }        = require('./ofertas.js');
const { cargaDatosDePruebaTablaOfertaDetalle }  = require('./oferta_detalle.js');
const { cargaDatosDePruebaTablaCarrito }        = require('./carrito.js');
const { cargaDatosDePruebaTablaCarritoDetalle } = require('./carrito_detalle.js');

async function cargaDatosDePruebaDB() 
{
    console.log('=== Cargando datos de prueba en toda la base de datos ===');

    try
    {
        await cargaDatosDePruebaTablaUsuarios();
        await cargaDatosDePruebaTablaProductos();
    
        await cargaDatosDePruebaTablaOfertas();
        await cargaDatosDePruebaTablaOfertaDetalle();
    
        await cargaDatosDePruebaTablaCarrito();
        await cargaDatosDePruebaTablaCarritoDetalle();

        console.log('=== Carga de datos de prueba finalizada correctamente ===');
    } 
    catch (error) 
    {
        console.error('ERROR durante la carga de datos de prueba:', error);
    }
}


cargaDatosDePruebaDB();

module.exports = { cargaDatosDePruebaDB }