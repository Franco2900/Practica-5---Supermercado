import { toast } from "react-toastify";

const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

/**
 * Función para enviar datos de contacto
 * @param {Object} formulario - Datos del formulario { nombre, email, mensaje }
 */
export async function solicitudContacto(formulario) 
{
    try 
    {
        const res = await fetch(`${dominioBackend}:${puertoBackend}/contacto`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formulario)
        });

        if (!res.ok) 
        {
            const data = await res.json();
            toast.error(`${data.mensaje}`, { position: "bottom-right", autoClose: 4000 });
            throw new Error("Error en la petición: " + res.status);
        }

        const data = await res.json();
        toast.success("Mensaje enviado correctamente", { position: "bottom-right", autoClose: 4000 });
        
        return data;
    } 
    catch (err) 
    {
        console.error("Error al enviar contacto:", err);
        toast.error("Error al enviar el mensaje", { position: "bottom-right", autoClose: 4000 });
        throw err;
    }
}
