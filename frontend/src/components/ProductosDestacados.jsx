import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./ProductosDestacados.css";

// Variables de entorno
const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

import { UsuarioContext } from "../context/UsuarioContext.jsx";
import { CarritoContext } from "../context/CarritoContext.jsx";

import { agregarProductoAlCarrito } from "./ListadosProductosUsuarioLogueado.helpers.js";

export default function ProductosDestacados() 
{
    // Variables de estado
    const [productos, setProductos] = useState([]);

    // Variables de contexto
    const { usuario } = useContext(UsuarioContext);
    const { carrito, setCarrito } = useContext(CarritoContext);


  // Petición al backend para obtener los productos destacados
    useEffect(() => {
      fetch(`${dominioBackend}:${puertoBackend}/productos/masVendidos`)
        .then(res => res.json())
        .then(data => setProductos(data))
        .catch(err => console.error("Error al traer productos:", err));
    }, []);



  return (
    <div className="container-fluid py-4 bg-white">
      <h2 className="text-center mb-4 fw-bold">⭐ Productos destacados</h2>
      
      <div className="d-flex flex-row overflow-auto gap-3 px-3 productos-scroll">
        {productos.map(prod => (
          <div className="card producto-card flex-shrink-0" style={{ minWidth: "220px" }} key={prod.id}>

            <img src={prod.fuenteImagen} className="card-img-top" alt={prod.nombre} />
            
            <div className="card-body text-center">

              <h6 className="card-title fw-bold">{prod.nombre}</h6>
              <p className="text-primary fw-bold">${prod.precio.toLocaleString("es-AR")}</p>

              <div className="d-flex justify-content-center gap-2">

                {/* Botón de carrito solo visible si el usuario está logueado */}
                {usuario && (
                  <button 
                    className="btn btn-outline-success btn-sm"
                    title="Agrega este producto al carrito"
                    onClick={() => agregarProductoAlCarrito(carrito, setCarrito, prod, usuario.id, 1 )}
                  >
                    <i className="bi bi-cart-plus"></i>
                  </button>
                )}

                <Link 
                  to={`/productos/${prod.id}`} 
                  className="btn btn-outline-dark btn-sm"
                  title="Ver más detalles del producto"
                >
                  <i className="bi bi-search"></i>
                </Link>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
