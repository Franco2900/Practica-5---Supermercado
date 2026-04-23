// Variables de entorno
const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

// Quita producto del carrito
export async function quitarProductoDelCarrito(carrito, setCarrito, producto_id, usuario_id, oferta_id = null) 
{
  // Si el producto pertenece a una oferta, aviso y pido confirmación
  if (oferta_id) 
  {
    const confirmar = window.confirm(
      "Este producto pertenece a una oferta. Si lo eliminas, se quitarán todos los productos de la oferta. ¿Deseas continuar con la eliminación de toda la oferta?"
    );
    if (!confirmar) return; // si cancela, no hago nada
  }

  
  let nuevoCarrito;
  if (oferta_id) // Si el producto pertenece a una oferta, elimino todos los productos de esa oferta
    nuevoCarrito = carrito.filter(p => p.oferta_id !== oferta_id);
  else           // Si el producto no pertenece a ninguna oferta, elimino solo el producto
    nuevoCarrito = carrito.filter(p => !(p.id === producto_id && p.oferta_id == null));
  
  // Actualizo el estado del carrito
  setCarrito(nuevoCarrito);

  // Solicitud al backend
  fetch(`${dominioBackend}:${puertoBackend}/carrito/quitarProducto`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
          producto_id: producto_id, 
          usuario_id: usuario_id,
          oferta_id // envío también el id de la oferta si existe
      }),
  })
  .then((res) => {
      if (!res.ok) throw new Error("Error en la petición: " + res.status);
      return res.json();
  })
  .then((data) => console.log("Respuesta del backend:", data))
  .catch((err) => console.error("Error al quitar producto del carrito:", err));
}


export async function modificarCantidad(producto_id, usuario_id, cantidad, oferta_id = null) 
{
  return fetch(`${dominioBackend}:${puertoBackend}/carrito/modificarCantidad`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      producto_id, 
      usuario_id,
      cantidad,
      oferta_id
    }),
  })
  .then((res) => {
    if (!res.ok) throw new Error("Error en la petición: " + res.status);
    return res.json();
  });
}
