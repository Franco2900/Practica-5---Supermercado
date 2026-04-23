import { useContext, useState } from "react";
import { CarritoContext } from "../context/CarritoContext.jsx";
import { UsuarioContext } from "../context/UsuarioContext.jsx";
import { Link } from "react-router-dom";

import "./Producto.css";

// Importo las funciones desde helpers
import { 
  agregarProductoAlCarrito, 
  toggleFavorito, 
  incrementar, 
  decrementar 
} from "./ListadosProductosUsuarioLogueado.helpers.js";


export default function ListadoProductosUsuarioLogueado({ producto }) {
  
  // Variables de contexto
  const { carrito, setCarrito } = useContext(CarritoContext);
  const { usuario } = useContext(UsuarioContext);

  // Variables de estado
  const [cantidad, setCantidad] = useState(1);

  return (
    <div className="card" id={producto.id}>

      <div className="card-img-container">
        <img className="card-img-top" src={producto.fuenteImagen} alt={producto.nombre} />
        <i 
          className={`bi bi-heart-fill ${producto.es_favorito ? "icon-heart-red" : "icon-heart-black"}`} 
          onClick={(e) => toggleFavorito(e, producto.id, usuario.id)}
        ></i>
      </div>

      <div className="card-body">
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text">{producto.descripcion}</p>
        <p className="card-text">
          <strong>Categoría:</strong> {producto.categoria}<br />
          <strong>Subcategoría:</strong> {producto.subcategoria}
        </p>
        <p className="card-price"><strong>Precio:</strong> ${producto.precio.toLocaleString("es-AR")}</p>

        <div className="contador">
          <button className="btn btn-secondary" onClick={() => decrementar(cantidad, setCantidad)}>-</button>
          <span className="mx-2">{cantidad}</span>
          <button className="btn btn-secondary" onClick={() => incrementar(cantidad, setCantidad)}>+</button>
        </div>

        <br />

        <div className="d-flex gap-2">
          <button 
            className="btn btn-primary" 
            onClick={() => agregarProductoAlCarrito(carrito, setCarrito, producto, usuario.id, cantidad )}
          >
            Agregar al carrito
          </button>

          
          <Link to={`/productos/${producto.id}`} className="btn btn-info ms-2">
            Ver detalles
          </Link>
        </div>

      </div>

    </div>
  );
}
