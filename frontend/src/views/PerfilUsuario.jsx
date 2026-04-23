import { useContext } from "react";
import { UsuarioContext } from "../context/UsuarioContext.jsx";

import EditarPerfilModal from "../components/EditarPerfilModal.jsx";

export default function PerfilUsuario() 
{
    const { usuario } = useContext(UsuarioContext);

    if (!usuario) return <p className="text-center mt-5">No hay usuario logueado</p>;

    // Clase del badge según el rol
    const badgeClass =
    usuario.rol === "Admin"
      ? "badge bg-warning text-dark" // dorado para Admin
      : "badge bg-info text-dark";   // celeste para otros roles

    return (
        <div className="container mt-5 d-flex justify-content-center">
        <div className="card shadow-lg border-0" style={{ maxWidth: "600px", width: "100%" }}>
            
            {/* Encabezado con imagen */}
            <div className="card-body text-center bg-light">

            <img
                src={usuario.fuente_imagen || "/images/perfil/perfil generico.jpg"}
                alt="Foto de perfil"
                className="rounded-circle mb-3 border border-3 border-primary"
                style={{ width: "140px", height: "140px", objectFit: "cover" }}
            />

            <h3 className="card-title mb-1">{usuario.nombre}</h3>
            <p className="text-muted">{usuario.email}</p>
            <span className={badgeClass}>{usuario.rol}</span>

            </div>

            {/* Lista de datos */}
            <ul className="list-group list-group-flush">

            <li className="list-group-item">
                <i className="bi bi-currency-dollar me-2 text-success"></i>
                <strong>Dinero disponible:</strong> ${usuario.dinero_disponible.toLocaleString("es-AR")}
            </li>

            <li className="list-group-item">
                <i className="bi bi-gift me-2 text-warning"></i>
                <strong>Puntos de canje:</strong> {usuario.puntos_canje}
            </li>

            <li className="list-group-item">
                <i className="bi bi-telephone me-2 text-primary"></i>
                <strong>Teléfono:</strong> {usuario.telefono || "No registrado"}
            </li>

            <li className="list-group-item">
                <i className="bi bi-house-door me-2 text-primary"></i>
                <strong>Dirección:</strong> {usuario.direccion || "No registrada"}
            </li>

            <li className="list-group-item">
                <i className="bi bi-calendar-check me-2 text-secondary"></i>
                <strong>Miembro desde:</strong>{" "}
                {usuario.fecha_creacion
                ? new Date(usuario.fecha_creacion).toLocaleDateString("es-AR")
                : "No disponible"}
            </li>

            </ul>

            {/* Botón que abre el modal */}
            <div className="card-body text-center">
            <button 
                className="btn btn-outline-primary" 
                data-bs-toggle="modal" 
                data-bs-target="#editarPerfilModal"
            >
                <i className="bi bi-pencil-square me-2"></i> Editar perfil
            </button>
            </div>

        </div>

        {/* Modal separado */}
        <EditarPerfilModal />
        </div>
    );
}
