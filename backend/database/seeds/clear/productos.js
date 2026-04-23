const conexionDB = require('../../conexionDB.js');

async function borradoDatosTablaProductos()
{
    console.log('Borrando datos de la tabla productos');

    await conexionDB.query(`DELETE FROM productos`);
    await conexionDB.query(`ALTER TABLE productos AUTO_INCREMENT = 1`);

    console.log('Datos completamente borrados de la tabla productos');
}

module.exports = { borradoDatosTablaProductos };