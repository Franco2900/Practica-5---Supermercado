// Importo las funciones de borrado de cada archivo
const { borradoDatosTablaOfertaDetalle }   = require('./oferta_detalle.js');
const { borradoDatosTablaCarritoDetalle }  = require('./carrito_detalle.js');
const { borradoDatosTablaFavoritos }       = require('./favoritos.js');
const { borradoDatosTablaComentarios }     = require('./comentarios.js');
const { borradoDatosTablaValoraciones }    = require('./valoraciones.js'); 
const { borradoDatosTablaCarrito }         = require('./carrito.js');
const { borradoDatosTablaOfertas }         = require('./ofertas.js');
const { borradoDatosTablaProductos }       = require('./productos.js');
const { borradoDatosTablaUsuarios }        = require('./usuarios.js');

async function borradoDatosDeTodaLaDB() 
{
    console.log('=== Iniciando borrado de toda la base de datos ===');

    try {
        // Primero las tablas intermedias
        await borradoDatosTablaCarritoDetalle();
        await borradoDatosTablaOfertaDetalle();
        await borradoDatosTablaFavoritos();
        await borradoDatosTablaComentarios();
        await borradoDatosTablaValoraciones();

        // Luego las tablas principales
        await borradoDatosTablaCarrito();
        await borradoDatosTablaOfertas();
        await borradoDatosTablaProductos();
        await borradoDatosTablaUsuarios();

        console.log('=== Borrado de toda la base de datos finalizado correctamente ===');
    } 
    catch (error) 
    {
        console.error('ERROR durante el borrado de la base de datos:', error);
    }
}

borradoDatosDeTodaLaDB();

module.exports = { borradoDatosDeTodaLaDB };
