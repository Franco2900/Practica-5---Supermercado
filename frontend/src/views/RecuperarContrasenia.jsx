import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

export default function RecuperarContrasenia() 
{
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [nuevaContraseña, setNuevaContraseña] = useState("");

    useEffect(() => {
        // Valida token al cargar la vista
        fetch(`${dominioBackend}:${puertoBackend}/auth/recuperarContrasenia?token=${token}`)
        .then(res => res.json())
        .then(data => {
            if (data.mensaje !== "Token válido") {
                toast.error("Token inválido o expirado", { position: "bottom-right", autoClose: 4000 });
            }
        })
        .catch(() => {
            toast.error("Error al validar token", { position: "bottom-right", autoClose: 4000 });
        });

    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try 
        {
            const res = await fetch(`${dominioBackend}:${puertoBackend}/auth/recuperarContrasenia/cambiar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, nuevaContraseña })
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.mensaje, { position: "bottom-right", autoClose: 4000 });
                return;
            }

            toast.success("Contraseña actualizada correctamente", { position: "bottom-right", autoClose: 4000 });
        } 
        catch (err) 
        {
            console.error(err);
            toast.error("Error en el servidor", { position: "bottom-right", autoClose: 4000 });
        }
    };

    return (
        <div className="container mt-5">

            <h2>Ingresar nueva contraseña</h2>

            <form onSubmit={handleSubmit} className="mt-3">
                
                <div className="mb-3">
                    <label className="form-label">Nueva contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={nuevaContraseña}
                        onChange={(e) => setNuevaContraseña(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-success">
                    Cambiar contraseña
                </button>

            </form>

        </div>
    );
}
