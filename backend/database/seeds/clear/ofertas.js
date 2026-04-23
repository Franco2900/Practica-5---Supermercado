const conexionDB = require('../../conexionDB.js');

async function borradoDatosTablaOfertas()
{
    console.log('Borrando datos de la tabla ofertas');

    await conexionDB.query(`DELETE FROM ofertas`);
    await conexionDB.query(`ALTER TABLE ofertas AUTO_INCREMENT = 1`);

    console.log('Datos completamente borrados de la tabla ofertas');
}

module.exports = { borradoDatosTablaOfertas };