import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./OfertasHorizontales.css";

// Variables de entorno
const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

import { UsuarioContext } from "../context/UsuarioContext.jsx";
import { CarritoContext } from "../context/CarritoContext.jsx";

import { agregarOfertaAlCarrito } from "./OfertasHorizontales.helpers.js";

export default function OfertasHorizontales() 
{
  // Variables de estado
  const [ofertas, setOfertas] = useState([]);
  const [tiempoRestante, setTiempoRestante] = useState({});

  // Variables de contexto
  const { usuario } = useContext(UsuarioContext);
  const { setCarrito } = useContext(CarritoContext);

  // Petición al backend para obtener las ofertas
  useEffect(() => {
    fetch(`${dominioBackend}:${puertoBackend}/ofertas/soloActivas`)
      .then(res => res.json())
      .then(data => setOfertas(data))
      .catch(err => console.error("Error al traer ofertas:", err));
  }, []);


  // Función para calcular tiempo restante
  const calcularTiempoRestante = (fechaFin) => {
    const ahora = new Date();
    const fin = new Date(fechaFin);
    const diff = fin - ahora;

    if (diff <= 0) return "Finalizada";

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diff / (1000 * 60)) % 60);
    const segundos = Math.floor((diff / 1000) % 60);

    return `${dias}d ${horas}h ${minutos}m ${segundos}s`;
  };

  // Actualiza el contador cada segundo
  useEffect(() => {

    const interval = setInterval(() => {

      const nuevosTiempos = {};
      ofertas.forEach(oferta => {
        nuevosTiempos[oferta.id] = calcularTiempoRestante(oferta.fecha_fin);
      });
      setTiempoRestante(nuevosTiempos);

    }, 1000);

    return () => clearInterval(interval);

  }, [ofertas]);

  
  return (
    <div className="container-fluid py-4 bg-light">
      <h2 className="text-center mb-4 fw-bold">🔥 Ofertas destacadas</h2>
      
      <div className="d-flex flex-row overflow-auto gap-3 px-3 ofertas-scroll">
        {ofertas.map(oferta => (
          <div className="card oferta-card flex-shrink-0" style={{ minWidth: "300px" }} key={oferta.id}>
            
            <img src={oferta.fuenteImagen} className="card-img-top" alt={oferta.nombre} />
            
            <div className="card-body">
              <h5 className="card-title fw-bold">{oferta.nombre}</h5>
              <p className="card-text text-muted">{oferta.descripcion}</p>

              <p>
                <span className="badge bg-danger text-decoration-line-through me-2">
                  ${oferta.precio_original.toLocaleString("es-AR")}
                </span>
                <span className="badge bg-success fs-6">
                  ${oferta.precio_oferta.toLocaleString("es-AR")}
                </span>
              </p>

              <p className="text-success fw-bold">
                ¡Ahorrás ${ (oferta.precio_original - oferta.precio_oferta).toLocaleString("es-AR") }!
              </p>

              <p 
                className={`p-2 rounded ${
                  tiempoRestante[oferta.id] === "Finalizada" 
                    ? "bg-danger text-white fw-bold" 
                    : "bg-warning fw-bold"
                }`}
              >
                ⏳ {tiempoRestante[oferta.id]}
              </p>

              <div className="d-flex justify-content-between mt-3">
                {usuario && (
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => agregarOfertaAlCarrito(setCarrito, usuario.id, oferta.id, oferta.nombre)}
                  >
                    <i className="bi bi-cart-plus"></i> Agregar
                  </button>
                )}
                <Link to={`/ofertas/${oferta.id}`} className="btn btn-outline-dark btn-sm">
                  Ver detalles
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}