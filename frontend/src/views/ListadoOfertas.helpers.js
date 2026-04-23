import { toast } from "react-toastify";

// Variables de entorno
const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

// Agregar producto al carrito
export function agregarOfertaAlCarrito(setCarrito, usuario_id, oferta_id, oferta_nombre) 
{
    fetch(`${dominioBackend}:${puertoBackend}/ofertas/agregarOfertaAlCarrito`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            oferta_id: oferta_id, 
            usuario_id: usuario_id
        }),
    })
    .then((res) => {
        if (!res.ok) throw new Error("Error en la petición: " + res.status);
        return res.json();
    })
    .then((data) => {
        
        // Después de agregar la oferta, pido el carrito actualizado
        return fetch(`${dominioBackend}:${puertoBackend}/carrito/obtenerCarrito`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario_id })
        });

    })
    .then((res) => res.json())
    .then((carritoActualizado) => {

        toast.success(`Oferta "${oferta_nombre}" agregada al carrito`);
        // Actualizo el contexto con el carrito actualizado
        setCarrito(carritoActualizado);
    })
    .catch((err) => console.error("Error al agregar producto al carrito:", err));
}