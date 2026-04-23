// Metodos importados de 'util.js'
const { logURL } = require('./utilController.js');

const { 
    agregarFavorito, 
    quitarFavorito,
    buscarSoloProductosFavoritosDelUsuario
} = require('../models/favoritosModel.js');


async function postAgregarFavorito(req, res)
{
    logURL(`POST`, `/favoritos/agregarFavorito`);

    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    const { producto_id, usuario_id } = req.body;

    try 
    {
        await agregarFavorito(producto_id, usuario_id);

        // Respuesta del backend al frontend
        return res.status(200).json({
            mensaje: `Producto ${producto_id} agregado a favoritos`,
        });
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }

}


async function deleteQuitarFavorito(req, res)
{
    logURL(`DELETE`, `/favoritos/quitarFavorito`);

    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    const { producto_id, usuario_id } = req.body;

    try 
    {
        await quitarFavorito(producto_id, usuario_id);

        // Respuesta del backend al frontend
        return res.status(200).json({
            mensaje: `Producto ${producto_id} eliminado de favoritos`,
        });
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }

}


async function postSoloProductosFavoritos(req, res)
{
    logURL(`POST`, `/productos/soloProductosFavoritos`);

    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    const { usuario_id } = req.body;

    const productos = await buscarSoloProductosFavoritosDelUsuario(usuario_id);

    res.json(productos);
}


module.exports = { 
    postAgregarFavorito,
    deleteQuitarFavorito,
    postSoloProductosFavoritos
};