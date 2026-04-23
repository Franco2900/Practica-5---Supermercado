// Variables de entorno
const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

import { toast } from "react-toastify";

// Agregar producto al carrito
export function agregarProductoAlCarrito(carrito, setCarrito, producto, usuario_id, cantidad) 
{
    // Si el carrito ya tiene un producto con el mismo id del producto nuevo
    if ( carrito.some(p => p.id === producto.id) ) 
    { 
        setCarrito(carrito.map(p => // Recorro el carrito
            p.id === producto.id    // Si encuentro el producto con el mismo id
            ? { ...p, cantidad: (p.cantidad || 1) + cantidad } // Le actualizo el campo cantidad
            : p // Si no lo encuentro, queda igual
        )); 
    } 
    // Si el carrito no tiene el producto nuevo
    else 
    { 
        setCarrito([...carrito, { ...producto, cantidad }]); // Agrego el producto al carrito con el nuevo campo cantidad
    }


    fetch(`${dominioBackend}:${puertoBackend}/carrito/agregarProducto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            producto_id: producto.id, 
            usuario_id: usuario_id, 
            cantidad: cantidad,
            oferta_id: producto.oferta_id || null
        }),
    })
    .then((res) => {
        if (!res.ok) throw new Error("Error en la petición: " + res.status);
        return res.json();
    })
    .then((data) => {
        console.log("Respuesta del backend:", data)
        
        toast.success(`Producto "${producto.nombre}" agregado al carrito`);
    })
    .catch((err) => console.error("Error al agregar producto al carrito:", err));
}


// Toggle favorito (agregar/quitar)
export function toggleFavorito(e, producto_id, usuario_id) 
{
    const esRojo = e.target.classList.contains("icon-heart-red");

    if (esRojo) 
    {
        e.target.classList.remove("icon-heart-red");
        e.target.classList.add("icon-heart-black");

        fetch(`${dominioBackend}:${puertoBackend}/favoritos/quitarFavorito`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ producto_id: producto_id, usuario_id: usuario_id }),
        })
        .then((res) => {
            if (!res.ok) throw new Error("Error en la petición: " + res.status);
            return res.json();
        })
        .then((data) => console.log("Respuesta del backend:", data))
        .catch((err) => console.error("Error al quitar favorito:", err));
    } 
    else 
    {
        e.target.classList.remove("icon-heart-black");
        e.target.classList.add("icon-heart-red");

        fetch(`${dominioBackend}:${puertoBackend}/favoritos/agregarFavorito`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ producto_id: producto_id, usuario_id: usuario_id }),
        })
        .then((res) => {
            if (!res.ok) throw new Error("Error en la petición: " + res.status);
            return res.json();
        })
        .then((data) => console.log("Respuesta del backend:", data))
        .catch((err) => console.error("Error al agregar favorito:", err));
    }
}

// Contador
export function incrementar(cantidad, setCantidad) 
{
    setCantidad(cantidad + 1);
}

export function decrementar(cantidad, setCantidad) 
{
    if (cantidad > 1) 
    {
        setCantidad(cantidad - 1);
    }
}
