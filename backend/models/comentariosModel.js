const conexionDB = require('../database/conexionDB.js'); // Base de datos

// await conexionDB.query(sql) devuelve un arreglo de dos elementos: 
// * El primer elemento son las filas obtenidas de la consulta
// * El segundo elemento son los metadatos de las columnas

// const respuesta = await conexionDB.query(sql);
// respuesta === [ rows, fields ]

// Haciendo const [resultado] = await conexionDB.query(sql); me quedo solo con el primer elemento del arreglo

async function buscarComentariosDelProducto(id)
{
    const sql = `
        SELECT 
            c.id,
            c.texto,
            DATE_FORMAT(c.fecha_creacion, '%d/%m/%Y %H:%i') AS fecha_creacion,
            c.id_comentario_padre,
            u.id AS id_usuario,
            u.nombre,
            u.fuente_imagen AS urlFotoPerfil
        FROM comentarios c
        JOIN usuarios u ON c.id_usuario = u.id
        WHERE c.id_producto = ?
        ORDER BY c.fecha_creacion ASC;
    `;

    const [filas] = await conexionDB.query(sql, [id]);

    return filas;
}


async function insertarComentario({ texto, id_producto, id_usuario, id_comentario_padre }) 
{
    const sql = `
        INSERT INTO comentarios (texto, fecha_creacion, id_usuario, id_producto, id_comentario_padre)
        VALUES (?, NOW(), ?, ?, ?);
    `;

    const [resultado] = await conexionDB.query(sql, [texto, id_usuario, id_producto, id_comentario_padre]);

    // Traigo los datos del usuario para devolverlos junto al comentario
    const sqlUsuario = `
        SELECT nombre, fuente_imagen AS urlFotoPerfil
        FROM usuarios
        WHERE id = ?;
    `;
    const [usuarioRows] = await conexionDB.query(sqlUsuario, [id_usuario]);
    const usuario = usuarioRows[0];


    // Devuelvo el comentario recién insertado
    return {
        id: resultado.insertId,
        texto,
        fecha_creacion: new Date().toLocaleString("es-AR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }),
        id_usuario,
        id_producto,
        id_comentario_padre,
        nombre: usuario.nombre,
        urlFotoPerfil: usuario.urlFotoPerfil
    };
}


module.exports = { 
    buscarComentariosDelProducto,
    insertarComentario
};