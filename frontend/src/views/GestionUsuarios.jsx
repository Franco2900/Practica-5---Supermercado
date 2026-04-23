import { useState, useEffect } from "react";
import { buscarUsuarios, cambiarRolUsuario } from "./GestionUsuarios.helpers.js";
import MostrarSugerenciasUsuarios from "../components/MostrarSugerenciasUsuarios.jsx";

const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

export default function GestionUsuarios() 
{
    const { consulta, setConsulta, usuarios } = buscarUsuarios();

    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [datosUsuario, setDatosUsuario] = useState(null);

    // Cuando selecciono un usuario, traigo sus datos completos
    useEffect(() => {
        
        if (!usuarioSeleccionado) return;

        fetch(`${dominioBackend}:${puertoBackend}/usuario/${usuarioSeleccionado}`)
        .then(res => {
            if (!res.ok) throw new Error("Error al traer datos del usuario");
            return res.json();
        })
        .then(data => setDatosUsuario(data))
        .catch(err => console.error("Error:", err));

    }, [usuarioSeleccionado]);


    // Badge según el rol
    const badgeClass =
    datosUsuario?.rol === "Admin"
      ? "badge bg-warning text-dark"
      : "badge bg-info text-dark";

    return (
        <div className="container mt-4 d-flex flex-column align-items-center">
            
            {/* Busqueda de usuarios */}
            <div className="position-relative" style={{ width: "400px" }}>
                
                <h3 className="mb-3 text-center">Buscar usuario</h3>
                <input 
                className="form-control" 
                type="search" 
                placeholder="Nombre del usuario a buscar" 
                aria-label="Search"
                value={consulta}
                onChange={(e) => setConsulta(e.target.value)}
                />

                <MostrarSugerenciasUsuarios 
                    usuarios={usuarios} 
                    onSelect={setUsuarioSeleccionado}
                    limpiarBusqueda={setConsulta}
                />
            </div>

            {/* Vista de datos del usuario */}
            {datosUsuario && (
            <div className="card shadow-lg border-0 mt-3 mb-4" style={{ maxWidth: "600px", width: "100%" }}>
                
                {/* Encabezado con imagen */}
                <div className="card-body text-center bg-light">
                    <img 
                    src={datosUsuario.fuente_imagen || "/images/perfil/perfil generico.jpg"} 
                    alt="Foto de perfil" 
                    className="rounded-circle mb-3 border border-3 border-primary"
                    style={{ width: "140px", height: "140px", objectFit: "cover" }}
                    />
                    <h3 className="card-title mb-1">{datosUsuario.nombre}</h3>
                    <p className="text-muted">{datosUsuario.email}</p>
                    <span className={badgeClass}>{datosUsuario.rol}</span>
                </div>

                {/* Lista de datos */}
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                    <i className="bi bi-currency-dollar me-2 text-success"></i>
                    <strong>Dinero disponible:</strong> ${datosUsuario.dinero_disponible?.toLocaleString("es-AR")}
                    </li>
                    <li className="list-group-item">
                    <i className="bi bi-gift me-2 text-warning"></i>
                    <strong>Puntos de canje:</strong> {datosUsuario.puntos_canje}
                    </li>
                    <li className="list-group-item">
                    <i className="bi bi-telephone me-2 text-primary"></i>
                    <strong>Teléfono:</strong> {datosUsuario.telefono || "No registrado"}
                    </li>
                    <li className="list-group-item">
                    <i className="bi bi-house-door me-2 text-primary"></i>
                    <strong>Dirección:</strong> {datosUsuario.direccion || "No registrada"}
                    </li>
                    <li className="list-group-item">
                    <i className="bi bi-calendar-check me-2 text-secondary"></i>
                    <strong>Miembro desde:</strong>{" "}
                    {datosUsuario.fecha_creacion
                        ? new Date(datosUsuario.fecha_creacion).toLocaleDateString("es-AR")
                        : "No disponible"}
                    </li>
                </ul>

                {/* Botón de ascendo o descenso según rol */}
                <div className="card-body text-center mb-2">
                {datosUsuario.rol === "Cliente" ? (
                    <button 
                        className="btn btn-outline-success"
                        onClick={() => cambiarRolUsuario(datosUsuario.id, setDatosUsuario)}
                    >
                        <i className="bi bi-arrow-up-circle me-2"></i> Ascender a Admin
                    </button>
                ) : (
                    <button 
                        className="btn btn-outline-danger"
                        onClick={() => cambiarRolUsuario(datosUsuario.id, setDatosUsuario)}
                    >
                        <i className="bi bi-arrow-down-circle me-2"></i> Degradar a Cliente
                    </button>
                )}
                </div>

            </div>
            
            )}

        </div>
    );
}
