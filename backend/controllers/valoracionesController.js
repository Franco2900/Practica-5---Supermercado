// Metodos importados de 'util.js'
const { logURL } = require('./utilController.js');

const model = require('../models/valoracionesModel.js');

async function postValoracionDelUsuario(req, res) 
{
    logURL("POST", "/valoraciones/valoracionDelUsuario");

    const { id_producto, id_usuario } = req.body;

    console.log(`Datos ingresados`);
    console.log(req.body);

    try 
    {
        // Validación de datos
        if ( !id_producto || !id_usuario) 
            return res.status(400).json({
                mensaje: "Faltan datos obligatorios: id_producto, id_usuario"
            });
        

        // Busco la valoración del usuario sobre el producto actual
        const valoracionDelUsuario = await model.obtenerValoracionDelUsuario(id_producto, id_usuario);
        
        return res.status(200).json({ valoracionDelUsuario: valoracionDelUsuario || 0 });
    } 
    catch (error) 
    {
        console.error("Error en buscar la valoración del usuario:", error);
        return res.status(500).json({ mensaje: "Error al buscar la valoración del usuario" });
    }
}


async function postAñadirValoracion(req, res) 
{
    logURL("POST", "/valoraciones");

    const { valoracion, id_producto, id_usuario } = req.body;

    console.log(`Datos ingresados`);
    console.log(req.body);

    try 
    {
        // Validación de datos
        if (!valoracion || !id_producto || !id_usuario) 
            return res.status(400).json({
                mensaje: "Faltan datos obligatorios: valoracion, id_producto, id_usuario"
            });
        

        // Reviso si el usuario valoro anteriormente el producto actual
        const hayValoracion = await model.existeValoracionDelUsuario(id_producto, id_usuario)

        // Si el usuario ya lo valoro en el pasado, modifico la valoracion existente
        if(hayValoracion) await model.modificarValoracion(valoracion, id_producto, id_usuario);

        // Si la valoracion es nueva, la agrego a la en la base de datos
        else              await model.insertarValoracion(valoracion, id_producto, id_usuario);

        // Actualizo el promedio y cantidad en la tabla productos
        const { valoracionPromedio, cantidadValoraciones } = await model.actualizarPromedioEnProducto(id_producto);

        return res.status(200).json({ valoracionPromedio, cantidadValoraciones });
    } 
    catch (error) 
    {
        console.error("Error en añadir:", error);
        return res.status(500).json({ mensaje: "Error al añadir comentario" });
    }
}

module.exports = { 
    postValoracionDelUsuario,
    postAñadirValoracion
};