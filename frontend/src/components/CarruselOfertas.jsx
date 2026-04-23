import { useEffect, useState } from "react";
import "./CarruselOfertas.css";

// Variables de entorno
const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

export default function CarruselOfertas() {
  const [ofertas, setOfertas] = useState([]);

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

  return (
    <div id="ofertasCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {ofertas.map((oferta, index) => (
          <div
            key={oferta.id}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={oferta.fuenteImagen}
              className="d-block w-100 carrusel-oferta-img"
              alt={oferta.nombre}
            />
            <div className="carousel-caption d-none d-md-block carrusel-oferta-caption">
              <h5>{oferta.nombre}</h5>
              <p>{oferta.descripcion}</p>
              <p>
                <span className="precio-original">
                  ${oferta.precio_original.toLocaleString("es-AR")}
                </span>{" "}
                <span className="precio-oferta">
                  ${oferta.precio_oferta.toLocaleString("es-AR")}
                </span>
              </p>
              <p className="texto-ahorro">
                ¡Ahorrás $
                {(
                  oferta.precio_original - oferta.precio_oferta
                ).toLocaleString("es-AR")}
                !
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Controles */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#ofertasCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#ofertasCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  );
}
