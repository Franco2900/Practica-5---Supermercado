// Metodos importados de 'util.js'
const { logURL } = require('./utilController.js');

const 
{ 
    obtenerCarritoActualId,
    crearCarrito,
    consultarPrecio,
    agregarProductoAlCarrito,
    obtenerProductosDelCarritoActual,
    obtenerProductosDeLaOferta,
    actualizarProductoCantidad,
    chequearDineroDelUsuario,
    comprarCarrito,
    actualizarDineroDelUsuario,
    obtenerUsuarioActualizado,
    modificarCantidadProductoEnCarrito,
    modificarCantidadOfertaEnCarrito,
    quitarProducto,
    quitarProductosDeOferta,
    quitarTodosLosProductos,
    actualizarProductoVenta,
    actualizarOfertaVenta
} 
= require('../models/carritoModel.js');


async function postAgregarProducto(req, res)
{
    logURL(`POST`, `/carrito/agregarProducto`);

    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    const { producto_id, usuario_id, cantidad, oferta_id } = req.body;

    try 
    {
        // Obtengo el id del carrito actual (si existe)
        let carrito_id  = await obtenerCarritoActualId(usuario_id);

        // Si no existe, creo uno nuevo 
        if (!carrito_id) carrito_id = await crearCarrito(usuario_id);

        // Consulta el precio del producto en mi base de datos en vez de que me lo envie el cliente por cuestiones de seguridad
        const precio_unitario = await consultarPrecio(producto_id);

        // Agrego el producto al carrito 
        await agregarProductoAlCarrito(carrito_id, producto_id, cantidad, precio_unitario, oferta_id );

        // Respuesta del backend al frontend
        return res.status(200).json({
            mensaje: `Producto ${producto_id} agregado al carrito ${carrito_id}`,
        });
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }

}



async function postObtenerCarrito(req, res)
{
    logURL(`POST`, `/carrito/obtenerCarrito`);

    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    const { usuario_id } = req.body;

    try 
    {
        // Obtengo el id del carrito actual
        const carrito_id  = await obtenerCarritoActualId(usuario_id);
        // Obtengo los productos del carrito
        const productos   = await obtenerProductosDelCarritoActual(carrito_id);
        
        // Respuesta del backend al frontend
        return res.status(200).json(productos);
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }

}


async function postComprarCarrito(req, res)
{
    logURL(`POST`, `/carrito/comprarCarrito`);

    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    const { usuario_id } = req.body;

    // En caso de que no lleguen todos los datos
    if (!usuario_id) return res.status(400).json({ mensaje: "Faltan datos" });

    try
    {
        // Obtengo el id del carrito actual
        const carrito_id  = await obtenerCarritoActualId(usuario_id);

        // Obtengo los productos del carrito
        const productos   = await obtenerProductosDelCarritoActual(carrito_id);

        // Calculo el precio de todos los productos del carrito
        let precioCarrito = 0;
        let ofertasYaSumadas = new Set();

        productos.forEach(p => {
            
           // Si el producto pertenece a una oferta
            if (p.oferta_id)
            {
                // Si la oferta todavía no fue sumada, la agrego
                if (!ofertasYaSumadas.has(p.oferta_id)) 
                {
                    precioCarrito += p.precio_oferta * p.cantidad;   // Precio de la oferta (se cobra por conjunto)
                    ofertasYaSumadas.add(p.oferta_id); 
                }
            }
            // Si el producto es individual
            else precioCarrito += p.precio * p.cantidad; // Precio de producto individual
        });

        // Calculo si el usuario tiene suficiente dinero para comprar todos los productos
        let dinero_disponible = await chequearDineroDelUsuario(usuario_id);

        if(dinero_disponible < precioCarrito) return res.status(400).json({ mensaje: `No hay suficiente dinero para hacer la compra`});

        // Obtengo la fecha actual
        let fecha = new Date();

        // Formateo a YYYY-MM-DD HH:MM:SS
        let fechaActual = `${fecha.getFullYear()}-${String(fecha.getMonth()+1).padStart(2,"0")}-${String(fecha.getDate()).padStart(2,"0")} ${String(fecha.getHours()).padStart(2,"0")}:${String(fecha.getMinutes()).padStart(2,"0")}:${String(fecha.getSeconds()).padStart(2,"0")}`;

        // Hago la compra
        await comprarCarrito(fechaActual, precioCarrito, usuario_id);

        // Actualizo la cantidad de dinero disponible del usuario
        dinero_disponible -= precioCarrito;
        await actualizarDineroDelUsuario(dinero_disponible, usuario_id);

        // Actualizar productos y ofertas vendidos e ingresos
        let ofertasYaActualizadas = new Set();

        for (const p of productos) 
        {   
            // Si el producto pertenece a una oferta
            if (p.oferta_id) 
            {
                // Evito actualizar la misma oferta varias veces
                if (!ofertasYaActualizadas.has(p.oferta_id)) 
                {
                    // Actualizo la oferta
                    await actualizarOfertaVenta(p.oferta_id, p.precio_oferta * p.cantidad, p.cantidad);
                    
                    // También actualizo los productos que forman parte de la oferta
                    // Actualizo solo la cantidad vendida de los productos de la oferta
                    const productosDeLaOferta = await obtenerProductosDeLaOferta(p.oferta_id);
                    for (const prod of productosDeLaOferta) 
                    {
                        await actualizarProductoCantidad(prod.id, prod.cantidad * p.cantidad);
                    }

                    ofertasYaActualizadas.add(p.oferta_id);
                }
            } 
            else 
            {
                // Producto individual
                const ingresos = p.precio * p.cantidad;
                await actualizarProductoVenta(p.id, p.cantidad, ingresos);
            }
        }

        // Obtengo los datos actualizados del usuario
        const usuario = await obtenerUsuarioActualizado(usuario_id);

        // Respuesta del backend al frontend
        return res.status(200).json({
            usuario
        });
    }
    catch (error)
    {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }

}


async function putModificarCantidadEnCarrito(req, res)
{
    logURL(`PUT`, `/carrito/modificarCantidad`);

    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    // Obtengo los datos
    const { producto_id, usuario_id, cantidad, oferta_id } = req.body;

    // En caso de que no lleguen todos los datos
    if (!producto_id || !usuario_id || !cantidad) return res.status(400).json({ mensaje: "Faltan datos" });

    try
    {
        // Obtengo el id del carrito actual
        let carrito_id  = await obtenerCarritoActualId(usuario_id);

        // Modifico la cantidad del producto u oferta en el carrito actual
        if (oferta_id) await modificarCantidadOfertaEnCarrito(carrito_id, oferta_id, cantidad);
        else           await modificarCantidadProductoEnCarrito(carrito_id, producto_id, cantidad);

        // Respuesta del backend al frontend
        return res.status(200).json({
            mensaje: `Cantidad del producto ${producto_id} cambiada`,
        });
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
}


async function deleteQuitarProducto(req, res)
{
    logURL(`DELETE`, `/carrito/quitarProducto`);

    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    const { producto_id, usuario_id, oferta_id } = req.body;

    try 
    {
        // Obtengo el id del carrito actual
        let carrito_id  = await obtenerCarritoActualId(usuario_id);


        if (oferta_id) 
        {
            // Si el producto pertenece a una oferta, elimino todos los productos asociados a esa oferta
            await quitarProductosDeOferta(carrito_id, oferta_id);

            return res.status(200).json({
                mensaje: `Oferta ${oferta_id} eliminada del carrito ${carrito_id}`,
            });
        } 
        else 
        {
            // Si el producto no pertenece a ninguna oferta, elimino solo el producto individual
            await quitarProducto(carrito_id, producto_id);
            
            return res.status(200).json({
                mensaje: `Producto ${producto_id} quitado del carrito ${carrito_id}`,
            });
        }
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }

}



async function deleteQuitarTodosLosProductos(req, res)
{
    logURL(`DELETE`, `/carrito/quitarTodosLosProductos`);

    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    const { usuario_id } = req.body;

    try 
    {
        // Obtengo el id del carrito actual
        let carrito_id  = await obtenerCarritoActualId(usuario_id);

        if (!carrito_id) {
            return res.status(404).json({ mensaje: "No existe un carrito activo para este usuario" });
        }
        
        // Quito todos los productos del carrito 
        await quitarTodosLosProductos(carrito_id);

        // Respuesta del backend al frontend
        return res.status(200).json({
            mensaje: `Todos los productos fueron quitados del carrito ${carrito_id}`,
        });
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }

}


module.exports = { 
    postAgregarProducto,
    postObtenerCarrito,
    postComprarCarrito,
    putModificarCantidadEnCarrito,
    deleteQuitarProducto,
    deleteQuitarTodosLosProductos
};