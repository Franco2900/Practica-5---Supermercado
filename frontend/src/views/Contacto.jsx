import "./Contacto.css";

import { solicitudContacto } from "./Contacto.helpers.js";

import { useState } from "react";

export default function Contacto() 
{
    const [formulario, setFormulario] = useState({
        nombre: "",
        email: "",
        mensaje: ""
    });

    const handleChange = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Datos de contacto:", formulario);

        await solicitudContacto(formulario);
    };

    return (
        <div className="container mt-5 contacto-page">

            <h1 className="text-center mb-4 text-primary">Contacto - Supermercado Sol Ultra</h1>
            
            <div className="row">
                {/* Información de contacto */}
                <div className="col-md-6 mb-4">
                <h3>Información</h3>
                <p><strong>Dirección:</strong> Av. Principal 123, Rafael Calzada</p>
                <p><strong>Teléfono:</strong> +54 11 5555-5555</p>
                <p><strong>Email:</strong> contacto@solultra.com</p>
                <p><strong>Horario:</strong> Lunes a Sábado, 8:00 - 20:00</p>
                </div>

                {/* Formulario de contacto */}
                <div className="col-md-6">
                    <h3>Envíanos tu consulta</h3>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label 
                                htmlFor="nombre" 
                                className="form-label"
                            >
                                Nombre
                            </label>
                            <input 
                                type="text"
                                className="form-control"
                                id="nombre"
                                name="nombre"
                                value={formulario.nombre}
                                onChange={handleChange}
                                placeholder="Tu nombre"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label 
                                htmlFor="email" 
                                className="form-label"
                            >
                                Correo electrónico
                            </label>
                            <input 
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formulario.email}
                                onChange={handleChange}
                                placeholder="tuemail@ejemplo.com"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label 
                                htmlFor="mensaje" 
                                className="form-label"
                            >
                                Mensaje
                            </label>
                            <textarea 
                                className="form-control"
                                id="mensaje"
                                name="mensaje"
                                rows="4"
                                value={formulario.mensaje}
                                onChange={handleChange}
                                placeholder="Escribe tu consulta aquí"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary"
                        >
                            Enviar
                        </button>

                    </form>
                </div>
                
            </div>

        </div>
    );
}
