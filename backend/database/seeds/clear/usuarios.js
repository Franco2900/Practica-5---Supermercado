const conexionDB = require('../../conexionDB.js');

async function borradoDatosTablaUsuarios()
{
    console.log('Borrando datos de la tabla usuarios');

    await conexionDB.query(`DELETE FROM usuarios`);
    await conexionDB.query(`ALTER TABLE usuarios AUTO_INCREMENT = 1`);

    console.log('Datos completamente borrados de la tabla usuarios');
}

module.exports = { borradoDatosTablaUsuarios };