import { toast } from "react-toastify";

// Variables de entorno
const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

// Divide un array en filas de N elementos
export function dividirProductosEnFilas(productos, tamanioParaDividir) 
{
    const resultado = [];

    for (let i = 0; i < productos.length; i += tamanioParaDividir) 
    {
        resultado.push( productos.slice(i, i + tamanioParaDividir) );
        // Extraigo una parte del array (desde, hasta) sin modificar el array original
        //Luego pongo las distintas partes en otro array. Cada parte es una fila de productos.
    }

    return resultado;
}


/**
 * Calcula el costo total del carrito
 * - Si el producto pertenece a una oferta, se suma solo una vez el precio de la oferta
 * - Si no, se suma precio * cantidad
 */
export function calcularCostoTotal(carrito) 
{
    let total = 0;
    const ofertasUnicas = new Set(); // Set para asegurarme de que solo se sume el precio de la oferta al costo total una sola vez

    carrito.forEach(prod => {

        if (prod.oferta_id && prod.precio_oferta) // Si el producto del carrito pertenece a una oferta
        {
            if (!ofertasUnicas.has(prod.oferta_id)) // Si el id de la oferta no esta en el set, significa que el costo de la oferta todavía no fue agregada al costo total del carrito
            {
                total += prod.precio_oferta * (prod.cantidad || 1);  // Se suma al total el precio de la oferta multiplicado por la cantida de ofertas, no el precio del producto
                ofertasUnicas.add(prod.oferta_id); // Agrego el id de la oferta al set
            }
        } 
        else // Si el producto no pertenece a una oferta
        {
            total += prod.precio * (prod.cantidad || 1); // Se suma al costo total del carrito, el precio individual del producto multiplicado por la cantidad
        }
        
    });

    return total;
}


// Comprar carrito
export async function comprarCarrito(usuario_id, setCarrito, setUsuario) 
{
    try 
    {
        // Solicitud al backend
        const res = await fetch(`${dominioBackend}:${puertoBackend}/carrito/comprarCarrito`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario_id })
        });

        if (!res.ok) 
        {
            // Mensaje para informar de error al usuario, ya sea porque no hay dinero suficiente u otra cosa
            const data = await res.json();
            toast.error(`💸 ${data.mensaje}`, { position: "bottom-right", autoClose: 4000 });
            throw new Error(data.mensaje);
        }

        const data = await res.json();
        setCarrito([]);
        setUsuario(data.usuario);

        // Mensaje para informar al usuario de la compra
        toast.success("🎉 ¡Compra realizada con éxito!", { position: "bottom-right", autoClose: 4000 });
    } 
    catch (err) 
    {
        console.error("Error al comprar los productos del carrito:", err);
    }
}


// Vaciar carrito
export async function vaciarCarrito(usuario_id, setCarrito) 
{
    try 
    {
        // Solicitud al backend
        await fetch(`${dominioBackend}:${puertoBackend}/carrito/quitarTodosLosProductos`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario_id })
        });

        setCarrito([]); // Limpia los productos de la vista
        toast.info("🛒 Tu carrito está vacío ahora", { position: "bottom-right", autoClose: 3000 }); // Mensaje para informar al usuario del vaciamiento del carrito
    } 
    catch (err) 
    {
        console.error("Error al eliminar los productos del carrito:", err);
    }
}
