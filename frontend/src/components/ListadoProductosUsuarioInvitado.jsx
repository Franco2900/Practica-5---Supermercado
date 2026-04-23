import "./Producto.css";

import { Link } from "react-router-dom";

export default function ListadoProductosUsuarioInvitado({ producto }) 
{
  return (
    <div className="card" id={producto.id}>

      {/* Imagen con ícono superpuesto */}
      <div className="card-img-container">
        <img className="card-img-top" src={producto.fuenteImagen} alt={producto.nombre} />
      </div>

      {/* Cuerpo del producto */}
      <div className="card-body">
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text">{producto.descripcion}</p>
        <p className="card-text">
          <strong>Categoría:</strong> {producto.categoria}<br />
          <strong>Subcategoría:</strong> {producto.subcategoria}
        </p>
        <p className="card-price"><strong>Precio:</strong> ${producto.precio.toLocaleString("es-AR")}</p>

      </div>

      <div className="d-flex justify-content-center">
        <Link to={`/productos/${producto.id}`} className="btn btn-info ">
          Ver detalles
        </Link>
      </div>

      <br></br>

    </div>
  );
}
