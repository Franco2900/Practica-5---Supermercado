import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Variables de entorno
const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

export default function Register() 
{
    const navigate = useNavigate();

    // Variables de estado
    const [formulario, setFormulario] = useState({
        nombre: "",
        email: "",
        password: "",
    });

    // Función que se activa cuando cambio un campo del formulario
    const handleChange = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    // Función que se activa al subir el formulario
    const handleSubmit = (e) => {

        e.preventDefault();                          // Preveo el reinicio de la vista
        console.log("Datos de registro:", formulario); // Muestro los datos del formulario

        fetch(`${dominioBackend}:${puertoBackend}/auth/register`, { 
            method: "POST", 
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({ 
                nombre: formulario.nombre, 
                email: formulario.email, 
                password: formulario.password 
            }) 
        }) 
        .then((res) => { 
            if (!res.ok) throw new Error("Error en la petición: " + res.status); 
            return res.json(); 
        }) 
        .then((data) => { 
            console.log("Respuesta del backend:", data);

            alert("Registro exitoso, ahora inicia sesión"); 
            
            setTimeout(() => { 
                navigate("/login"); 
            }, 3000);
        }) 
        .catch((err) => console.error("Error al registrar usuario:", err));
    };

    return (
        <div className="container mt-5">

            <h2>Registro de Usuario</h2>
        
            <form onSubmit={handleSubmit} className="mt-3">

                {/* Nombre */}
                <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={formulario.nombre}
                    onChange={handleChange}
                    required
                />
                </div>

                {/* Email */}
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

                {/* Contraseña */}
                <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formulario.password}
                    onChange={handleChange}
                    required
                />
                </div>

                <button type="submit" className="btn btn-primary">
                Registrarse
                </button>
                
            </form>

        </div>
    );
}
