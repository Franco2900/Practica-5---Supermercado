const fs = require("fs");
const path = require("path");

const { logURL } = require('./utilController.js');

const model = require('../models/ofertasModel.js');

async function getOfertasActivas(req, res)
{
    logURL(`GET`, `/ofertas/soloActivas`);

    try 
    {
        // Obtengo las ofertas de la base de datos
        const ofertas = await model.obtenerOfertasActivasYNoVencidas();

        // Respuesta del backend al frontend
        return res.status(200).json(ofertas);
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }

}


async function getTodasLasOfertas(req, res)
{
    logURL(`GET`, `/ofertas/todas`);

    try 
    {
        // Obtengo las ofertas de la base de datos
        const ofertas = await model.obtenerTodasLasOfertas();

        // Respuesta del backend al frontend
        return res.status(200).json(ofertas);
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }

}



async function getProductosDeLaOferta(req, res)
{
    const { id } = req.params;

    logURL(`GET`, `/ofertas/${id}/productos`);

    try
    {
        if (isNaN(id)) return res.status(400).json({ mensaje: "ID inválido" }); // Verifico que id sea un numero

        const productos = await model.obtenerProductosDeLaOferta(id); // Obtengo los datos de los productos de la oferta en la base de datos
        if (!productos) return res.status(404).json({ mensaje: "Productos no encontrados" }); // Si los productos no existen, mando mensaje de error
        
        return res.status(200).json(productos);
    }
    catch(error)
    {
        console.error("Error al buscar los productos de la oferta:", error);
        return res.status(500).json({ mensaje: "Error al buscar los productos de la oferta" });
    }

}


async function postAgregarOfertaAlCarrito(req, res)
{
    logURL(`POST`, `/ofertas/agregarOfertaAlCarrito`);

    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    const { oferta_id, usuario_id } = req.body;

    // En caso de que no lleguen todos los datos
    if (!oferta_id || !usuario_id) return res.status(400).json({ mensaje: "Faltan datos" });

    try 
    {
        // Obtengo el id del carrito actual (si existe)
        let carrito_id  = await model.obtenerCarritoActualId(usuario_id);

        // Si no existe, creo uno nuevo 
        if (!carrito_id) carrito_id = await model.crearCarrito(usuario_id);
        
        // Obtengo los productos que forman parte de la oferta
        const productosDeLaOferta = await model.obtenerProductosDeLaOferta(oferta_id);

        // Agrego cada producto al carrito
        for (const p of productosDeLaOferta) 
        {
            await model.agregarProductoAlCarrito(carrito_id, p.id, oferta_id,  p.cantidad * 1);
        }
        

        // Respuesta del backend al frontend
        return res.status(200).json({
            mensaje: `Oferta ${oferta_id} agregada al carrito ${carrito_id}`,
        });
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }

}


async function putOferta(req, res)
{
    try 
    {
        const id = req.params.id;
        const { nombre, descripcion, precio_original, precio_oferta, fecha_inicio, fecha_fin, imagenVieja } = req.body;

        // Validación básica
        if (!id || !nombre || !precio_original || !precio_oferta) {
            return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
        }

        logURL(`PUT`, `/ofertas/${id}`);

        // Obtengo la oferta actual para conservar la imagen si no se sube una nueva
        const ofertaActual = await model.obtenerOfertaPorId(id);
        if (!ofertaActual) {
            return res.status(404).json({ mensaje: "Oferta no encontrada" });
        }

        let fuenteImagen = ofertaActual.fuenteImagen; // por defecto mantengo la actual

        // Si se subió una nueva imagen
        if (req.file) {
            fuenteImagen = `/images/ofertas/${req.file.filename}`;

            // Eliminar imagen vieja si existe
            if (imagenVieja) 
            {
                const rutaVieja = path.join(__dirname, "../../frontend/public", imagenVieja);
                fs.promises.unlink(rutaVieja).catch(() => {
                    console.warn("No se pudo eliminar la imagen vieja:", rutaVieja);
                });
            }
        }
        
        // Armo objeto oferta
        const ofertaActualizada = {
            id,
            nombre,
            descripcion,
            precio_original,
            precio_oferta,
            fecha_inicio,
            fecha_fin,
            fuenteImagen
        };

        // Actualizo la oferta en la base de datos
        const resultado = await model.actualizarOferta(ofertaActualizada);
        if (!resultado) return res.status(404).json({ mensaje: "Oferta no encontrada" });
        
        return res.status(200).json(resultado);
    } 
    catch (error) 
    {
        console.error("Error en putOferta:", error);
        return res.status(500).json({ mensaje: "Error interno al actualizar la oferta" });
    }
}


async function putProductosDeLaOferta(req, res) 
{
    const { id } = req.params;
    const productos = req.body; // Array con { producto_id, cantidad }

    logURL(`PUT`, `/ofertas/${id}/productos`);

    try {
        // Verifico que el id sea un número
        if (isNaN(id)) {
            return res.status(400).json({ mensaje: "ID inválido" });
        }

        // Verifico que sea un array
        if (!Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ mensaje: "No se enviaron productos para la oferta" });
        }

        // Verifico que la oferta exista
        const oferta = await model.obtenerOfertaPorId(id);
        if (!oferta) {
            return res.status(404).json({ mensaje: "Oferta no encontrada" });
        }

        // Elimino los productos actuales de la oferta
        await model.eliminarProductosDeLaOferta(id);

        // Inserto los nuevos productos en la oferta
        for (const p of productos) 
        {
            // Salto si el producto no es válido
            if (!p.producto_id || isNaN(p.producto_id)) continue; 
            
            const cantidad = p.cantidad && !isNaN(p.cantidad) ? p.cantidad : 1;
            await model.agregarProductoAOferta(id, p.producto_id, cantidad);
        }

        return res.status(200).json({ mensaje: "Productos de la oferta actualizados correctamente" });
    } catch (error) {
        console.error("Error en putProductosDeLaOferta:", error);
        return res.status(500).json({ mensaje: "Error interno al actualizar los productos de la oferta" });
    }
}


async function deleteOferta(req, res)
{
    const { id } = req.params;

    logURL(`DELETE`, `/ofertas/${id}`);

    try
    {
        if (isNaN(id)) return res.status(400).json({ mensaje: "ID inválido" }); // Verifico que id sea un numero

        const oferta = await model.obtenerOfertaPorId(id); // Obtengo los datos de la oferta en la base de datos
        if (!oferta) return res.status(404).json({ mensaje: "Oferta no encontrada" }); // Si la oferta a eliminar no existe, mando mensaje de error
        
        // Si ya está inactivo, aviso
        if (oferta.activo === 0) return res.status(400).json({ mensaje: "La oferta ya estaba inactiva" });
        
        await model.eliminarOferta(id); // Si existe el producto, lo elimino (le hago baja logica)

        return res.status(200).json({ mensaje: "Oferta eliminada correctamente" });
    }
    catch(error)
    {
        console.error("Error al eliminar la oferta:", error);
        return res.status(500).json({ mensaje: "Error al eliminar la oferta" });
    }

}


async function postCrearOferta(req, res) 
{
    logURL(`POST`, `/ofertas`);

    try 
    {
        const { nombre, descripcion, precio_original, precio_oferta, fecha_inicio, fecha_fin } = req.body;

        // Validación básica
        if (!nombre || !precio_original || !precio_oferta) {
            return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
        }

        // Imagen (si se subió)
        let fuenteImagen = null;
        if (req.file) {
            fuenteImagen = `/images/ofertas/${req.file.filename}`;
        }

        // Armo objeto oferta
        const nuevaOferta = {
            nombre,
            descripcion,
            precio_original,
            precio_oferta,
            fecha_inicio,
            fecha_fin,
            fuenteImagen,
            activo: 1 // por defecto activa
        };

        // Inserto en la base de datos
        const resultado = await model.crearOferta(nuevaOferta);

        return res.status(201).json(resultado);
    } 
    catch (error) 
    {
        console.error("Error en postCrearOferta:", error);
        return res.status(500).json({ mensaje: "Error interno al crear la oferta" });
    }
}



async function getOfertaDetalle(req, res) 
{
    const { id } = req.params;

    logURL(`GET`, `/ofertas/${id}`);

    try 
    {
        // Validación básica
        if (isNaN(id)) return res.status(400).json({ mensaje: "ID inválido" });
        
        // Obtengo la oferta
        const oferta = await model.obtenerOfertaPorId(id);
        if (!oferta)   return res.status(404).json({ mensaje: "Oferta no encontrada" });
        
        // Obtengo los productos asociados a la oferta
        const productos = await model.obtenerProductosDeLaOferta(id);

        // Armo objeto de respuesta
        const detalle = {
            ...oferta,
            productos: productos || []
        };

        return res.status(200).json(detalle);

    } 
    catch (error) 
    {
        console.error("Error en getOfertaDetalle:", error);
        return res.status(500).json({ mensaje: "Error interno al obtener detalle de la oferta" });
    }
}

module.exports = { 
    getOfertasActivas,
    getTodasLasOfertas,
    getProductosDeLaOferta,
    putProductosDeLaOferta,
    postAgregarOfertaAlCarrito,
    putOferta,
    deleteOferta,
    postCrearOferta,
    getOfertaDetalle
};
