import { useState } from "react";
import { solicitudRecuperarContrasenia } from "./SolicitudRecuperarContrasenia.helpers.js";

export default function SolicitudRecuperarContrasenia() 
{
    const [formulario, setFormulario] = useState({ email: "" });

    const handleChange = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Datos de login:", formulario);

        await solicitudRecuperarContrasenia(formulario.email);
    };

    return (
        <div className="container mt-5">
            <h2>Recuperar contraseña</h2>
            <p>Le enviaremos un email a su correo electrónico para que recupere su contraseña</p>

            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="form-label">Correo electrónico</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formulario.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-success">
                    Recuperar
                </button>
            </form>
        </div>
    );
}
