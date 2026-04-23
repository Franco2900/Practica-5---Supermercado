import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UsuarioContext } from "../context/UsuarioContext.jsx";
import { CarritoContext } from "../context/CarritoContext.jsx";

import { toast } from "react-toastify";

// Variables de entorno
const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

export default function Login() 
{
    const navigate = useNavigate();

    // Variables de estado
    const [formulario, setFormulario] = useState({ nombreXemail: "", password: "" });

    // Variables de contexto 
    const { login } = useContext(UsuarioContext);
    const { setCarrito } = useContext(CarritoContext);


    // Efecto secundario que se activa cuando cambio un campo del formulario
    const handleChange = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value }); // Actualiza el valor de las variables de estado
    };

    // Efecto secundario que se activa al subir el formulario
    const handleSubmit = (e) => {

        e.preventDefault();                         // Preveo el reinicio de la vista
        console.log("Datos de login:", formulario); // Muestro los datos del formulario

        fetch(`${dominioBackend}:${puertoBackend}/auth/login`, { // Petición al backend
            method: "POST", 
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({ 
                nombreXemail: formulario.nombreXemail,  
                password: formulario.password 
            }) 
        })                 
        .then((res) => {    // Cuando llegue los datos
            if (!res.ok) throw new Error("Error en la petición: " + res.status); // Si hubo un error de la solicitud
            return res.json();  // Si no hubo un error de la solicitud
        }) 
        .then((data) => {   
            console.log("Respuesta del backend:", data); 

            if (data.token) 
            {
                login(data.token); // Actualizo el contexto con el token (las variables de contexto solo sirven para una sola pestaña/ventana del navegador)
                localStorage.setItem("token", data.token); // Guardo el token para mantener la sesión entre pestañas

                navigate("/"); // Redirijo al Home sin recargar la app
                setCarrito(data.productos) // Actualizo el contexto del carrito

                toast.success(`Login exitoso`);
            }
            else 
            { 
                alert("Error: " + data.mensaje); 
            }
        }) 
        .catch((err) => {
            toast.error(`Nombre/email y/o contraseña incorrecto`);
            console.error("Error al iniciar sesion:", err)
        });
    };

    return (
        <div className="container mt-5">

            <h2>Iniciar Sesión</h2>
            
            <form onSubmit={handleSubmit} className="mt-3"> {/* Ante la subida del formulario, se ejecuta la función */}

                {/* Email o nombre */}
                <div className="mb-3">
                <label className="form-label">Correo electrónico o Nombre de usuario</label>
                <input
                    type="text"
                    name="nombreXemail"
                    className="form-control"
                    value={formulario.nombreXemail}
                    onChange={handleChange} // Ante un cambio, se ejecuta la función
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
                    onChange={handleChange} // Ante un cambio, se ejecuta la función
                    required
                />
                </div>

                <p><a href="/solicitudRecuperarContrasenia">Olvide mi contraseña</a></p>

                <button type="submit" className="btn btn-success">
                    Ingresar
                </button>

            </form>

        </div>
    );
}
