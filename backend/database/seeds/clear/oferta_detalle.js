const conexionDB = require('../../conexionDB.js');

async function borradoDatosTablaOfertaDetalle()
{
    console.log('Borrando datos de la tabla oferta_detalle');

    await conexionDB.query(`DELETE FROM oferta_detalle`);

    console.log('Datos completamente borrados de la tabla oferta_detalle');
}

module.exports = { borradoDatosTablaOfertaDetalle };
