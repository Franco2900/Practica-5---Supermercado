const conexionDB = require('../../conexionDB.js');

async function borradoDatosTablaComentarios()
{
    console.log('Borrando datos de la tabla comentarios');
    
    await conexionDB.query(`DELETE FROM comentarios WHERE id_comentario_padre IS NOT NULL`);
    await conexionDB.query(`DELETE FROM comentarios`);
    await conexionDB.query(`ALTER TABLE comentarios AUTO_INCREMENT = 1`);

    console.log('Datos completamente borrados de la tabla comentarios');
}

module.exports = { borradoDatosTablaComentarios }