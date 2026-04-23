import { useContext, useState } from "react";
import { CarritoContext } from "../context/CarritoContext.jsx";
import { UsuarioContext } from "../context/UsuarioContext.jsx";

import { toast } from "react-toastify";
import "./Producto.css";

// Importo las funciones desde helpers
import { quitarProductoDelCarrito, modificarCantidad } from "./ProductoCarrito.helpers.js";

// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export default function ProductoCarrito({ producto, ofertasModificadas, setOfertasModificadas, cantidadesOfertas, setCantidadesOfertas }) 
{  
  // Variables de contexto
  const { carrito, setCarrito } = useContext(CarritoContext);
  const { usuario } = useContext(UsuarioContext);

  // Cantidad efectiva:
  // - Si es producto individual → cantidad viene de carrito_detalle
  // - Si es producto de oferta → cantidad = cantidad del producto en oferta_detalle * cantidad de ofertas en carrito_detalle
  const cantidadBase = producto.oferta_id 
  ? producto.cantidad_oferta_detalle * producto.cantidad  
  : producto.cantidad;

  // Variables de estado
  const [cantidad, setCantidad] = useState(cantidadBase);
  const [mostrarBoton, setMostrarBoton] = useState(false);

  const cantidadOferta = cantidadesOfertas[producto.oferta_id] ?? producto.cantidad;

  // Funciones para aumentar/disminuir cantidad de los productos
  const aumentarCantidadProducto = () => {
    const nuevaCantidad = cantidad + 1;
    setCantidad(nuevaCantidad);

    setMostrarBoton(nuevaCantidad !== producto.cantidad); // // Muestra botón solo si cambió respecto a la cantidad original
  };

  const disminuirCantidadProducto = () => {
    if (cantidad > 1) {
      const nuevaCantidad = cantidad - 1;
      setCantidad(nuevaCantidad);

      setMostrarBoton(nuevaCantidad !== producto.cantidad);
    }
  };


  // Funciones para aumentar/disminuir cantidad de las ofertas
  const aumentarCantidadOferta = () => {

    const nuevaCantidad = cantidadOferta  + 1;
    
    setCantidadesOfertas(prev => ({
      ...prev,
      [producto.oferta_id]: nuevaCantidad
    }));

    if (nuevaCantidad === producto.cantidad) // Si volvió al valor original, elimino la marca de modificación
    {
      setOfertasModificadas(prev => {
        const nuevo = { ...prev };
        delete nuevo[producto.oferta_id];
        return nuevo;
      });
    } 
    else  // Si cambió, marco la oferta como modificada
    {
      setOfertasModificadas(prev => ({
        ...prev,
        [producto.oferta_id]: true
      }));
    }
  };

  const disminuirCantidadOferta = () => {
    if (cantidadOferta  > 1) 
    {
      const nuevaCantidad = cantidadOferta  - 1;
      
      setCantidadesOfertas(prev => ({
        ...prev,
        [producto.oferta_id]: nuevaCantidad
      }));

      if (nuevaCantidad === producto.cantidad) 
      {
        setOfertasModificadas(prev => {
          const nuevo = { ...prev };
          delete nuevo[producto.oferta_id];
          return nuevo;
        });
      } 
      else 
        {
        setOfertasModificadas(prev => ({
          ...prev,
          [producto.oferta_id]: true
        }));
      }
    }
  };



  // Función para aplicar la modificación
  const aplicarModificacion = () => {

    if (producto.oferta_id) 
    {
      // --- OFERTAS ---
      modificarCantidad(producto.id, usuario.id, cantidadOferta, producto.oferta_id)
      .then(() => {
        
        // Actualizo el carrito global con la nueva cantidad de la oferta
        const nuevoCarrito = carrito.map(p =>
          p.id === producto.id && p.oferta_id === producto.oferta_id
            ? { ...p, cantidad: cantidadOferta }
            : p
        );
        setCarrito(nuevoCarrito);

        // Limpio la marca de modificación de la oferta
        setOfertasModificadas(prev => {
          const nuevo = { ...prev };
          delete nuevo[producto.oferta_id]; // Quito la oferta de ofertas modificadas para quitarle el boton de modificar
          return nuevo;
        });

        // Toast de confirmación
        toast.success(`Cantidad de la oferta "${producto.oferta_nombre}" modificada a ${cantidadOferta}`);
      })
      .catch(err => console.error("Error al modificar cantidad de oferta:", err));
    } 
    else 
    {
      // --- PRODUCTOS INDIVIDUALES ---
      modificarCantidad(producto.id, usuario.id, cantidad, null)
      .then(() => {

        const nuevoCarrito = carrito.map(p =>
          p.id === producto.id
            ? { ...p, cantidad }
            : p
        );
        setCarrito(nuevoCarrito);

        setMostrarBoton(false); // oculto el botón
        toast.success(`Cantidad del producto "${producto.nombre}" modificada a ${cantidad}`);
      })
      .catch(err => console.error("Error al modificar cantidad de producto:", err));
    }
  };


  return (
    <div className="card shadow-sm mb-3" id={`${producto.id}-${producto.oferta_id || "ind"}`}>

      <div className="card-img-container position-relative">
        
        {/* Imagen del producto */}
        <img className="card-img-top" src={producto.fuenteImagen} alt={producto.nombre} />
        
        {/* Icono para remover producto */}
        <i
          className="bi bi-trash-fill icon-trash"
          onClick={() => quitarProductoDelCarrito(carrito, setCarrito, producto.id, usuario.id, producto.oferta_id)}
        ></i>

      </div>


      <div className="card-body">

        {/* Nombre del producto */}
        <h5 className="card-title">{producto.nombre}</h5>
        
        {/* Descripcion del producto */}
        <p className="card-text text-muted">{producto.descripcion}</p>

        {/* Categoria y subcategoria del producto */}
        <p className="card-text">
          <strong>Categoría:</strong> {producto.categoria}<br />
          <strong>Subcategoría:</strong> {producto.subcategoria}
        </p>


        {/* Cantidad */}
        {producto.oferta_id ? (
          <p>
            <strong>
            <span title="Cantidad del producto dentro de una sola oferta">
              Cantidad por oferta:
            </span>
            </strong> 
            {" "}{producto.cantidad_oferta_detalle}{" "}

            <span title="Cantidad del producto dentro de una sola oferta">
              <FontAwesomeIcon icon={faInfoCircle} className="text-muted ms-1" />
            </span>
          </p>
        ) : (
          <p><strong>Cantidad:</strong> {cantidad}</p>
        )}


        {/* Oferta o producto individual */}
        {producto.oferta_id ? (
          // Si el producto pertenece a una oferta

          <div className="alert alert-warning p-2">
            <strong>Oferta aplicada:</strong> {producto.oferta_nombre} <br/><br/>
          
            {/*
              <strong>Cantidad de ofertas:</strong> {producto.cantidad} <br/><br/>
            */}

            <strong>
            <span title="Cantidad del producto en una sola oferta multiplicada por la cantidad de ofertas">
              Cantidad total de este producto: 
            </span> 
             </strong>
            {" "}{producto.cantidad_oferta_detalle * producto.cantidad}{" "}

            <span title="Cantidad del producto en una sola oferta multiplicada por la cantidad de ofertas">
            <FontAwesomeIcon icon={faInfoCircle} className="text-muted ms-1" />
            </span>
            <br/><br/>

            <strong>Precio por oferta:</strong> ${producto.precio_oferta.toLocaleString("es-AR")} <br/><br/>

            <strong>
            <span title="Precio de la oferta multiplicado por la cantidad de ofertas">
              Precio final: 
            </span>
            </strong>
            {" "}${(producto.precio_oferta * cantidadOferta).toLocaleString("es-AR")}{" "}
            
            <span title="Precio de la oferta multiplicado por la cantidad de ofertas">
              <FontAwesomeIcon icon={faInfoCircle} className="text-muted ms-1" />
            </span>

            {/* Controles de cantidad SOLO para ofertas */}
            <div className="contador mt-3 d-flex align-items-center">
              <button className="btn btn-secondary" onClick={disminuirCantidadOferta}>-</button>
              <span className="mx-2">{cantidadOferta}</span>
              <button className="btn btn-secondary" onClick={aumentarCantidadOferta}>+</button>
            </div>

            {ofertasModificadas[producto.oferta_id] && (
              <div className="d-flex justify-content-center mt-3">
                <button className="btn btn-warning" onClick={aplicarModificacion}>
                  Modificar cantidad de ofertas
                </button>
              </div>
            )}

          </div>

        ) : (
          // Si el producto es individual
          
          <>
            <p><strong>Precio unitario:</strong> ${producto.precio.toLocaleString("es-AR")}</p>
            <p><strong>Subtotal:</strong> ${(producto.precio * cantidad).toLocaleString("es-AR")}</p>
            <p className="badge bg-secondary">Producto individual</p>

            {/* Mantengo los botones de cantidad SOLO para productos individuales */}
            <div className="contador mt-3 d-flex align-items-center">
              <button className="btn btn-secondary" onClick={disminuirCantidadProducto}>-</button>
              <span className="mx-2">{cantidad}</span>
              <button className="btn btn-secondary" onClick={aumentarCantidadProducto}>+</button>
            </div>

            {mostrarBoton && (
              <div className="d-flex justify-content-center mt-3">
                <button className="btn btn-warning" onClick={aplicarModificacion}>
                  Modificar cantidad
                </button>
              </div>
            )}

          </>
        )}

      </div>

    </div>
  );
}