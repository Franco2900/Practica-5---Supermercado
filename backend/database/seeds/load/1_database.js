const { cargaDatosDePruebaTablaUsuarios }  = require('./usuarios.js');
const { cargaDatosDePruebaTablaProductos } = require('./1_productos.js');
const { cargaDatosDePruebaTablaOfertas }   = require('./ofertas.js');
const { cargaDatosDePruebaTablaOfertaDetalle } = require('./oferta_detalle.js');

async function cargaDatosDePruebaDB() 
{
    console.log('=== Cargando datos de prueba en toda la base de datos ===');

    try
    {
        await cargaDatosDePruebaTablaUsuarios();
        await cargaDatosDePruebaTablaProductos();
        await cargaDatosDePruebaTablaOfertas();
        await cargaDatosDePruebaTablaOfertaDetalle();

        console.log('=== Carga de datos de prueba finalizada correctamente ===');
    } 
    catch (error) 
    {
        console.error('ERROR durante la carga de datos de prueba:', error);
    }
}


cargaDatosDePruebaDB();

module.exports = { cargaDatosDePruebaDB }