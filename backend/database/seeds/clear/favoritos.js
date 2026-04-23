const conexionDB = require('../../conexionDB.js');

async function borradoDatosTablaFavoritos()
{
    console.log('Borrando datos de la tabla favoritos');

    await conexionDB.query(`DELETE FROM favoritos`);

    console.log('Datos completamente borrados de la tabla favoritos');
}

module.exports = { borradoDatosTablaFavoritos };
