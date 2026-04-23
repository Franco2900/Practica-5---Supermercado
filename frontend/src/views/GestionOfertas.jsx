import { useEffect, useState } from "react";
import "./GestionOfertas.css";

import EditarOfertaModal from "../components/EditarOfertaModal";
import CrearOfertaModal  from "../components/CrearOfertaModal";

import { handleSaveOferta, handleEliminar, handleCreateOferta } from "./GestionOfertas.helpers";

// Variables de entorno
const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

export default function OfertasABM() 
{
    // Variables de estado
    const [ofertas, setOfertas] = useState([]);
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null);
    const [crearOfertaVisible, setCrearOfertaVisible] = useState(false);
    const [tiempoRestante, setTiempoRestante] = useState({});

    useEffect(() => {

        // Petición al backend para obtener las ofertas al cargar
        fetch(`${dominioBackend}:${puertoBackend}/ofertas/todas`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
        .then((res) => res.json())
        .then((data) => setOfertas(data))
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

    const filasDeOfertas = dividirOfertasEnFilas(ofertas, 3);

    // Handler para cargar el modal de modificar
    const handleModificar = (id) => {
        const oferta = ofertas.find((o) => o.id === id);
        setOfertaSeleccionada(oferta);
    };

    // Handler para vaciar el modal de modificar
    const handleCloseModal = () => {
        setOfertaSeleccionada(null);
    };



    return (
        <div className="container ofertas-container">

            <button 
                className="btn btn-primary mb-4"
                onClick={() => setCrearOfertaVisible(true)}
            >
                ➕ Crear nueva oferta
            </button>

            
            {filasDeOfertas.map((fila, filaIndex) => (

                <div className="row mb-4" key={filaIndex}>
                {fila.map((oferta) => (
                    <div className="col" key={oferta.id}>
                    <div className="card oferta-card">

                        <img
                            src={oferta.fuenteImagen}
                            className="card-img-top oferta-img"
                            alt={oferta.nombre}
                        />

                        {/* Cuerpo de la tarjeta */}
                        <div className="card-body oferta-body">

                            <h5 className="card-title">{oferta.nombre}</h5>
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
                                <span className="fw-bold text-primary">Inicio:</span> {new Date(oferta.fecha_inicio).toLocaleDateString("es-AR")} 
                                <br />
                                <span className="fw-bold text-danger">Fin:</span> {new Date(oferta.fecha_fin).toLocaleDateString("es-AR")}
                            </p>

                            <p 
                                className={`texto-contador p-2 rounded shadow-sm ${
                                    tiempoRestante[oferta.id] === "Finalizada" ? "bg-danger text-white fw-bold" : "bg-success text-white fw-bold"
                                }`}
                            >
                                ⏳ Tiempo restante: {tiempoRestante[oferta.id] || ""}
                            </p>


                            {/* Motivo de inactividad */}
                            {oferta.activo === 0 ? (
                            <div className="alert alert-warning d-flex align-items-center p-2 rounded shadow-sm">
                                <span className="fw-bold me-2">⚠️</span>
                                <span className="fst-italic">Motivo de inactividad: dada de baja manualmente</span>
                            </div>
                        ) : new Date(oferta.fecha_fin) < new Date() ? (
                            <div className="alert alert-secondary d-flex align-items-center p-2 rounded shadow-sm">
                                <span className="fw-bold me-2">⏰</span>
                                <span className="fst-italic">Motivo de inactividad: oferta expirada</span>
                            </div>
                        ) : null}


                            {/* Botones de modificación y eliminación */}
                            <div className="d-flex justify-content-between mt-3">
                                
                                <button 
                                    className="btn btn-warning"
                                    onClick={() => handleModificar(oferta.id)}
                                >
                                    Modificar
                                </button>
                                
                                {/* Solo si está activa y vigente muestro Dar de baja */}
                                {oferta.activo === 1 && new Date(oferta.fecha_fin) >= new Date() && (
                                    <button 
                                        className="btn btn-danger"
                                        onClick={() => handleEliminar(oferta.id, oferta.nombre, ofertas, setOfertas)}
                                    >
                                        Dar de baja
                                    </button>
                                )}

                            </div>

                        </div>
                    </div>
                    </div>
                ))}
                </div>

            ))}

            {/* Modal de edición */}
            {ofertaSeleccionada && (
                <EditarOfertaModal 
                    oferta={ofertaSeleccionada}
                    onClose={handleCloseModal}
                    onSave={(ofertaEditada) => handleSaveOferta(ofertaEditada, true, ofertas, setOfertas, setOfertaSeleccionada)}
                />
            )}

            {/* Modal de creación */}
            {crearOfertaVisible && (
                <CrearOfertaModal
                    onClose={() => setCrearOfertaVisible(false)}
                    onSave={(nuevaOferta) => handleCreateOferta(nuevaOferta, ofertas, setOfertas, setCrearOfertaVisible)}
                />
            )}

        </div>
    );
}
