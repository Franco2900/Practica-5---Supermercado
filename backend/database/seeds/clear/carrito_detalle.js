const conexionDB = require('../../conexionDB.js');

async function borradoDatosTablaCarritoDetalle()
{
    console.log('Borrando datos de la tabla carrito_detalle');

    await conexionDB.query(`DELETE FROM carrito_detalle`);
    await conexionDB.query(`ALTER TABLE carrito_detalle AUTO_INCREMENT = 1`);

    console.log('Datos completamente borrados de la tabla carrito_detalle');
}

module.exports = { borradoDatosTablaCarritoDetalle };
