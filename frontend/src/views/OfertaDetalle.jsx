import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import { UsuarioContext } from "../context/UsuarioContext.jsx";
import { CarritoContext } from "../context/CarritoContext.jsx";

import { agregarOfertaAlCarrito } from "./OfertaDetalle.helpers.js";

// Variables de entorno
const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

export default function OfertaDetalle() 
{
    const { id } = useParams(); // id de la oferta desde la URL
    
    // Variables de estado
    const [oferta, setOferta] = useState(null);
    const [productos, setProductos] = useState([]);
    const [tiempoRestante, setTiempoRestante] = useState("");

    // Variables de contexto
    const { usuario } = useContext(UsuarioContext);
    const { carrito, setCarrito } = useContext(CarritoContext);

    useEffect(() => {

        // Trae datos de la oferta
        fetch(`${dominioBackend}:${puertoBackend}/ofertas/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
        .then((res) => res.json())
        .then((data) => setOferta(data))
        .catch((err) => console.error("Error al traer la oferta:", err));

        // Trae productos asociados a la oferta
        fetch(`${dominioBackend}:${puertoBackend}/ofertas/${id}/productos`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
        .then((res) => res.json())
        .then((data) => setProductos(data))
        .catch((err) => console.error("Error al traer productos de la oferta:", err));

    }, [id]);


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

        if (!oferta) return;

        const interval = setInterval(() => {
            setTiempoRestante(calcularTiempoRestante(oferta.fecha_fin));
        }, 1000);

        return () => clearInterval(interval);

    }, [oferta]);

    if (!oferta) return <p>Cargando oferta...</p>;

    return (
        <div className="container detalle-oferta">

            <div className="d-flex justify-content-center">
            <div className="card oferta-card mt-3">
                <img
                    src={oferta.fuenteImagen}
                    alt={oferta.nombre}
                    className="card-img-top oferta-img"
                />
                <div className="card-body oferta-body">
                    <h2 className="card-title">{oferta.nombre}</h2>
                    <p className="card-text">{oferta.descripcion}</p>

                    <p>
                        <span className="precio-original">
                            ${oferta.precio_original.toLocaleString("es-AR")}
                        </span>{" "}
                        <span className="precio-oferta">
                            ${oferta.precio_oferta.toLocaleString("es-AR")}
                        </span>
                    </p>

                    <p className="texto-ahorro">
                    ¡Ahorrás $ {(oferta.precio_original - oferta.precio_oferta).toLocaleString("es-AR")}!
                    </p>

                    <p className="texto-fechas bg-light p-2 rounded shadow-sm mb-2">
                        <span className="fw-bold text-primary">Inicio:</span>{" "}
                        {new Date(oferta.fecha_inicio).toLocaleDateString("es-AR")} 
                        <br />
                        <span className="fw-bold text-danger">Fin:</span>{" "}
                        {new Date(oferta.fecha_fin).toLocaleDateString("es-AR")}
                    </p>

                    <p 
                    className={`texto-contador p-2 rounded shadow-sm ${
                        tiempoRestante === "Finalizada"
                        ? "bg-danger text-white fw-bold"
                        : "bg-success text-white fw-bold"
                    }`}
                    >
                    ⏳ Tiempo restante: {tiempoRestante}
                    </p>

                    {usuario && (
                        <div className="d-flex justify-content-center mt-3">
                        <button 
                            className="btn btn-primary" 
                            onClick={() => agregarOfertaAlCarrito(setCarrito, usuario.id, oferta.id, oferta.nombre)}
                        >
                            Agregar al carrito
                        </button>
                        </div>
                    )}

                </div>
            </div>
            </div>

            <h3 className="mt-4">Productos incluidos en la oferta</h3>
            
            <div className="row">
                {productos.map((producto) => (
                    <div className="col-md-4 mb-3" key={producto.id}>
                        
                        <div className="card h-100">
                        <img
                            src={producto.fuenteImagen}
                            alt={producto.nombre}
                            className="card-img-top producto-img"
                        />
                        <div className="card-body">
                            <h5 className="card-title">{producto.nombre}</h5>
                            <p className="card-text">{producto.descripcion}</p>
                            <p className="card-text">
                                <strong>Categoría:</strong> {producto.categoria} <br />
                                <strong>Subcategoría:</strong> {producto.subcategoria}
                            </p>
                            <p className="card-price">
                                <strong>Precio:</strong> ${producto.precio.toLocaleString("es-AR")}
                            </p>
                        </div>

                        <div className="d-flex justify-content-center">
                            <Link
                                to={`/productos/${producto.id}`}
                                className="btn btn-info mb-2"
                            >
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
