// Metodos importados de 'util.js'
const { logURL } = require('./utilController.js');

const model = require('../models/reportesModel.js');

async function getTop5Productos(req, res) 
{
    logURL(`GET`, `/reportes/top5`);

    try 
    {
        // Consulto a la base de datos cuales son los productos más vendidos
        const productos = await model.buscarTop5Productos();

        // Respuesta del backend al frontend
        res.json(productos);
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
}


async function getProductos(req, res) 
{
    logURL(`GET`, `/reportes/productos`);

    try 
    {
        // Consulto a la base de datos sobre todos los productos
        const productos = await model.buscarProductos();

        // Respuesta del backend al frontend
        res.json(productos);
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
}


async function getIngresos(req, res) 
{
    logURL(`GET`, `/reportes/ingresos`);

    try 
    {
        // Consulto a la base de datos sobre los ingresos de todos los productos
        const ingresos = await model.buscarIngresos();

        // Respuesta del backend al frontend
        res.json(ingresos);
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
}

module.exports = { getTop5Productos, getProductos, getIngresos }