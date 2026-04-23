import { toast } from "react-toastify";

// Variables de entorno
const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

/**
 * Función para recuperar contraseña
 * @param {string} email - Correo electrónico del usuario
 */
export async function solicitudRecuperarContrasenia(email) 
{
    try 
    {
        const res = await fetch(`${dominioBackend}:${puertoBackend}/auth/recuperarContrasenia`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        if (!res.ok) {
            const data = await res.json();
            toast.error(`${data.mensaje}`, { position: "bottom-right", autoClose: 4000 });
            throw new Error("Error en la petición: " + res.status);
        }

        const data = await res.json();
        toast.success("Email enviado. Revise su correo electrónico", { position: "bottom-right", autoClose: 4000 });
        return data;

    } 
    catch (err) 
    {
        console.error("Error al recuperar contraseña:", err);
        throw err;
    }
}
