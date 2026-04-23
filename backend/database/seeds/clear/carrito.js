const conexionDB = require('../../conexionDB.js');

async function borradoDatosTablaCarrito()
{
    console.log('Borrando datos de la tabla carrito');

    await conexionDB.query(`DELETE FROM carrito`);
    await conexionDB.query(`ALTER TABLE carrito AUTO_INCREMENT = 1`);

    console.log('Datos completamente borrados de la tabla carrito');
}

module.exports = { borradoDatosTablaCarrito };
