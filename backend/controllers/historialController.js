// Metodos importados de 'util.js'
const { logURL } = require('./utilController.js');

const 
{ 
    buscarTodosLosCarritosComprados,
    busquedaConFiltro
} 
= require('../models/historialModel.js');



async function postObtenerHistorial(req, res)
{
    logURL(`POST`, `/historial`);

    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    const { usuario_id } = req.body;

    try
    {
        const productos = await buscarTodosLosCarritosComprados(usuario_id);

        // Respuesta del backend al frontend
        return res.json(productos);
    }
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
}


async function postBusquedaConFiltro(req, res)
{
    logURL(`POST`, `/historial/busquedaConFiltro`);

    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    const { usuario_id, fecha_desde, fecha_hasta } = req.body;

    try
    {
        const productos = await busquedaConFiltro(usuario_id, fecha_desde, fecha_hasta);

        // Respuesta del backend al frontend
        return res.json(productos);
    }
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
}


module.exports = { 
    postObtenerHistorial,
    postBusquedaConFiltro
};