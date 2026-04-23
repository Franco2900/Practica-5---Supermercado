import { toast } from "react-toastify";

// Variables de entorno
const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;


// Agregar producto al carrito
export async function actualizarPerfil({ usuario_id, nombre, telefono, direccion, imagen }, setUsuario) 
{
    // Uso formData porque tengo que enviar un archivo
    const formData = new FormData();
    formData.append("usuario_id", usuario_id);
    formData.append("nombre", nombre);
    formData.append("telefono", telefono);
    formData.append("direccion", direccion);
    if (imagen) formData.append("imagen", imagen); // Archivo


    // Solicitud al backend
    fetch(`${dominioBackend}:${puertoBackend}/usuario/`, {
        method: "PUT",
        body: formData
    })
    .then((res) => {
        if (!res.ok) {
        return res.json().then((err) => {
          throw new Error(err.mensaje || "Error en la petición");
        });
      }
        return res.json();
    })
    .then((data) => {
        console.log("Respuesta del backend:", data)
        toast.success("¡Datos actualizados con éxito!");

        // Actualizar el contexto del usuario
        setUsuario(data.usuario);

        // Guardo en memoria local
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        localStorage.setItem("token", data.token);
    })
    .catch((err) => {
        console.error("Error al actualizar los datos de perfil:", err);
        toast.error(err.message);
    });
}