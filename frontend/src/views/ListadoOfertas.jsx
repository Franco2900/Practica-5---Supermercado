import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import { UsuarioContext } from "../context/UsuarioContext.jsx";
import { CarritoContext } from "../context/CarritoContext.jsx";

import "./ListadoOfertas.css";
import { agregarOfertaAlCarrito } from "./ListadoOfertas.helpers.js";

// Variables de entorno
const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

export default function Ofertas() 
{
  // Variables de estado
  const [ofertas, setOfertas] = useState([]);
  const [tiempoRestante, setTiempoRestante] = useState("");

  // Variables de contexto
  const { usuario } = useContext(UsuarioContext);
  const { carrito, setCarrito } = useContext(CarritoContext);

  // Petición al backend para obtener las ofertas
  useEffect(() => {

    fetch(`${dominioBackend}:${puertoBackend}/ofertas/soloActivas`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
    .then((res) => res.json())
    .then((data) => {
      setOfertas(data);
      console.log(data);
    })
    .catch((err) => console.error("Error al traer las ofertas:", err));
  
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
      ofertas.forEach((oferta) => {
        nuevosTiempos[oferta.id] = calcularTiempoRestante(oferta.fecha_fin);
      });
      setTiempoRestante(nuevosTiempos);
    }, 1000);

    return () => clearInterval(interval);
  }, [ofertas]);


  // Función para dividir las ofertas en filas de N columnas
  function dividirOfertasEnFilas(ofertas, tamanioParaDividir) 
  {
    const resultado = [];
    for (let i = 0; i < ofertas.length; i += tamanioParaDividir) 
    {
      resultado.push(ofertas.slice(i, i + tamanioParaDividir));
    }
    return resultado;
  }


  // Dividimos las ofertas en filas de 3 columnas
  const filasDeOfertas = dividirOfertasEnFilas(ofertas, 3);


  return (
    <div className="container ofertas-container">

      {/* Operación a realizar para cada fila de ofertas */}
      {filasDeOfertas.map((fila, filaIndex) => (
        <div className="row mb-4" key={filaIndex}>

          {/* Operación a realizar para cada oferta */}
          {fila.map((oferta) => (
            <div className="col" key={oferta.id}>

              {/* Tarjeta */}
              <div className="card oferta-card">
                
                {/* Imagen */}
                <img
                  src={oferta.fuenteImagen}
                  className="card-img-top oferta-img"
                  alt={oferta.nombre}
                />

                {/* Cuerpo de la tarjeta */}
                <div className="card-body oferta-body">
                  
                  {/* Nombre de la oferta */}
                  <h5 className="card-title">{oferta.nombre}</h5>
                  
                  {/* Descripción de la oferta */}
                  <p className="card-text">{oferta.descripcion}</p>
                  
                  <p>
                    {/* Precio original */}
                    <span className="precio-original">
                      ${oferta.precio_original.toLocaleString("es-AR")}
                    </span>{" "}
                    {/* Precio de la oferta */}  
                    <span className="precio-oferta">
                      ${oferta.precio_oferta.toLocaleString("es-AR")}
                    </span>
                  </p>

                  {/* Dinero ahorrado */}
                  <p className="texto-ahorro">
                    ¡Ahorrás $ {(oferta.precio_original - oferta.precio_oferta).toLocaleString("es-AR")}!
                  </p>

                  <p className="texto-fechas bg-light p-2 rounded shadow-sm mb-2">
                    <span className="fw-bold text-primary">Inicio:</span> {new Date(oferta.fecha_inicio).toLocaleDateString("es-AR")} 
                    <br />
                    <span className="fw-bold text-danger">Fin:</span> {new Date(oferta.fecha_fin).toLocaleDateString("es-AR")}
                  </p>

                  <p 
                    className={`texto-contador p-2 rounded shadow-sm ${
                      tiempoRestante[oferta.id] === "Finalizada" ? "bg-danger text-white fw-bold" : "bg-success text-white fw-bold"
                    }`}
                  >
                    ⏳ Tiempo restante: {tiempoRestante[oferta.id]}
                  </p>

                  <div 
                    className={
                      usuario 
                        ? "d-flex gap-2" 
                        : "d-flex justify-content-center"
                    }
                  >
                    {usuario && (
                      <button 
                        className="btn btn-primary" 
                        onClick={() => agregarOfertaAlCarrito(setCarrito, usuario.id, oferta.id, oferta.nombre)}
                      >
                        Agregar al carrito
                      </button>
                    )}

                    <Link
                      to={`/ofertas/${oferta.id}`}
                      className="btn btn-info"
                    >
                      Ver detalles
                    </Link>
                  </div>

                </div>

              </div>
            </div>
          ))}

        </div>
      ))}

    </div>
  );
}
