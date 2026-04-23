const conexionDB = require('../../conexionDB.js');

// Chequea si existe un registro en un tabla simple usando una columna como clave
async function chequearExistenciaTablaSimple(tabla, columna, valor) 
{
    const resultados = await conexionDB.query(`
        SELECT EXISTS(
            SELECT ${columna} 
            FROM ${tabla} 
            WHERE ${columna} = ?) 
        AS existe`, 
        [valor]
    );

    return resultados[0].existe;
}

// Chequea si existe un registro en una tabla intermedia usando dos columnas como clave compuesta
async function chequearExistenciaTablaIntermedia(tabla, columna1, valor1, columna2, valor2) 
{
    const resultados = await conexionDB.query(`
        SELECT EXISTS(
            SELECT 1 
            FROM ${tabla} 
            WHERE ${columna1} = ? AND ${columna2} = ?) AS existe`,
        [valor1, valor2]
    );

    return resultados[0].existe;
}

module.exports = { chequearExistenciaTablaSimple, chequearExistenciaTablaIntermedia  };