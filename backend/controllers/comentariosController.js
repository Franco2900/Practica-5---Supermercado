// Metodos importados de 'util.js'
const { logURL } = require('./utilController.js');

const model = require('../models/comentariosModel.js');

async function getComentarios(req, res)
{
    const { id } = req.params;

    logURL(`GET`, `/comentarios/${id}`);

    try
    {
        // Obtengo los comentarios del producto en la base de datos
        let comentariosPlano = await model.buscarComentariosDelProducto(id);

        // Si no hay comentarios para el producto
        if (!comentariosPlano || comentariosPlano.length === 0) {
            return res.status(200).json([]);
        }

        // Armo jerarquía padre-hijo
        const comentariosMap = {};
        comentariosPlano.forEach(c => {
            c.subcomentarios = [];    // A cada comentario le agrego un array vacío que representa los subcomentarios
            comentariosMap[c.id] = c; // Guardo el comentario en un diccionario con su id como clave
        });

        const comentariosRaiz = [];

        comentariosPlano.forEach(c => {

            // Si el comentario tiene un comentario padre y el comentario padre esta en el mapa
            if (c.id_comentario_padre && comentariosMap[c.id_comentario_padre]) 
            {
                // Agrego el subcomentario al array subcomentarios del padre
                comentariosMap[c.id_comentario_padre].subcomentarios.push(c);
            } 
            else 
            {
                // Si el comentario no tiene un comentario padre, es un comentario raíz
                comentariosRaiz.push(c);
            }
        });

        return res.status(200).json(comentariosRaiz);
    }
    catch(error)
    {
        console.error("Error al obtener los comentarios del producto");
        return res.status(500).json({ mensaje: "Error al obtener los comentarios del producto" });
    }

}



async function postAñadirComentario(req, res) 
{
    logURL("POST", "/comentarios");

    const { texto, id_producto, id_usuario, id_comentario_padre } = req.body;

    try 
    {
        const nuevoComentario = await model.insertarComentario({
            texto,
            id_producto,
            id_usuario,
            id_comentario_padre: id_comentario_padre || null
        });

        return res.status(201).json(nuevoComentario);
    } 
    catch (error) 
    {
        console.error("Error en añadir comentario:", error);
        return res.status(500).json({ mensaje: "Error al añadir comentario" });
    }
}

module.exports = { 
    getComentarios,
    postAñadirComentario
};