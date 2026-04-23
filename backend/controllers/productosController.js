// Metodos importados de 'util.js'
const { logURL } = require('./utilController.js');

const model = require('../models/productosModel.js');

async function getProductos(req, res)
{
    logURL(`GET`, `/productos/`);

    const productos = await model.buscarTodosLosProductos();

    res.json(productos);
}


async function getMasVendidos(req, res)
{
    logURL(`GET`, `/productosMasVendidos`);

    const productos = await model.buscarMasVendidos();

    res.json(productos);
}


async function postProductosMasFavoritos(req, res)
{
    logURL(`POST`, `/productos/productosMasFavoritos`);

    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    const { usuario_id } = req.body;

    const productos = await model.buscarTodosLosProductosMasFavoritosDelUsuario(usuario_id);

    res.json(productos);
}


async function getProductoDetalle(req, res)
{
    const { id } = req.params;

    logURL(`GET`, `/productos/${id}`);

    try
    {
        // Obtengo los datos del producto en la base de datos
        const producto = await model.buscarProducto(id);

        if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });
        
        return res.status(200).json(producto);
    }
    catch(error)
    {
        return res.status(500).json({ mensaje: "Error al obtener los datos del producto" });
    }

}


async function postBusquedaSugerencias(req, res) 
{
    const { search } = req.body; // ahora viene en el body

    logURL(`POST`, `/productos/buscar`, { search });

    console.log(`Buscando sugerencias para: ${search}`);

    if (!search || search.trim() === "") {
        return res.status(200).json([]);
    }

    try {
        const sugerencias = await model.buscarSugerencias(search);
        return res.status(200).json(sugerencias);
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al hacer la búsqueda" });
    }
}


async function deleteProducto(req, res)
{
    const { id } = req.params;

    logURL(`DELETE`, `/productos/${id}`);

    try
    {
        // Verifico que id sea un numero
        if (isNaN(id)) return res.status(400).json({ mensaje: "ID inválido" });

        // Obtengo los datos del producto en la base de datos
        const producto = await model.buscarProducto(id);

        // Si el producto a eliminar no existe, mando mensaje de error
        if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });
        
        // Si ya está inactivo, aviso
        if (producto.activo === 0) return res.status(400).json({ mensaje: "El producto ya estaba inactivo" });
        
        // Si existe el producto, lo elimino (le hago baja logica)
        await model.eliminarProducto(id);

        return res.status(200).json({ mensaje: "Producto eliminado correctamente" });
    }
    catch(error)
    {
        console.error("Error al eliminar producto:", error);
        return res.status(500).json({ mensaje: "Error al obtener los datos del producto" });
    }

}



async function putProducto(req, res) 
{
    try 
    {
        const id = req.params.id;
        const { nombre, descripcion, precio, categoria, subcategoria } = req.body;

        // Validación básica
        if (!id || !nombre || !precio) {
            return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
        }

        logURL(`PUT`, `/productos/${id}`);

        // Si se subió una nueva imagen con Multer
        let fuenteImagen = req.body.fuenteImagen || null;
        if (req.file) fuenteImagen = `/images/productos/${req.file.filename}`;
        
        // Armo objeto producto
        const productoActualizado = {
            id,
            nombre,
            descripcion,
            precio,
            categoria,
            subcategoria,
            fuenteImagen
        };

        // Actualizo el producto en la base de datos
        const resultado = await model.actualizarProducto(productoActualizado);
        if (!resultado) return res.status(404).json({ mensaje: "Producto no encontrado" });
        
        return res.status(200).json(resultado);
    } 
    catch (error) 
    {
        console.error("Error en putProducto:", error);
        return res.status(500).json({ mensaje: "Error interno al actualizar producto" });
    }
}


async function postAgregarProducto(req, res) 
{
    logURL(`POST`, `/productos`);

    try {
        const { nombre, descripcion, precio, categoria, subcategoria } = req.body;

        // Validación básica
        if (!nombre || !descripcion || !precio || !categoria || !subcategoria) {
            return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
        }

        // Imagen subida con multer
        let fuenteImagen = null;
        if (req.file) {
            fuenteImagen = `/images/productos/${req.file.filename}`;
        }

        const producto = {
            nombre,
            descripcion,
            precio,
            categoria,
            subcategoria,
            fuenteImagen
        };

        const nuevoProducto = await model.agregarProducto(producto);

        return res.status(201).json(nuevoProducto);
    } 
    catch (error) 
    {
        console.error("Error al agregar producto:", error);
        return res.status(500).json({ mensaje: "Error interno al agregar producto" });
    }
}


module.exports = { 
    getProductos,
    getMasVendidos,
    postProductosMasFavoritos,
    getProductoDetalle,
    postBusquedaSugerencias,
    deleteProducto,
    putProducto,
    postAgregarProducto
};