const conexionDB = require('../../conexionDB.js');

async function borradoDatosTablaValoraciones()
{
    console.log('Borrando datos de la tabla valoraciones');

    await conexionDB.query(`DELETE FROM valoraciones`);

    console.log('Datos completamente borrados de la tabla valoraciones');
}

module.exports = { borradoDatosTablaValoraciones };