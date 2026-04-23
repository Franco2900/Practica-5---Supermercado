import { useState, useEffect } from "react";

const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

// Hace la búsqueda en la base de datos de usuarios
export function buscarUsuarios() 
{
    const [consulta, setConsulta] = useState("");
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        
        if (consulta.length < 3) 
        {
            setUsuarios([]);
            return;
        }

        console.log("POST búsqueda usuarios:", consulta);

        fetch(`${dominioBackend}:${puertoBackend}/usuario/buscarSugerencias`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ consulta: consulta })
        })
        .then(res => {
            if (!res.ok) throw new Error("Error en la búsqueda de usuarios");
            return res.json();
        })
        .then(data => {
            setUsuarios(data);
        })
        .catch(err => {
            console.error("Error en buscador de usuarios:", err);
            setUsuarios([]);
        });

    }, [consulta]);

    return { consulta, setConsulta, usuarios };
}


export function cambiarRolUsuario(usuarioId, setDatosUsuario) 
{
    fetch(`${dominioBackend}:${puertoBackend}/usuario/cambiarRol`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: usuarioId }) 
    })
    .then(res => {
        if (!res.ok) throw new Error("Error al cambiar rol del usuario");
        return res.json();
    })
    .then(data => {
        console.log("Respuesta del backend:", data);
        // Actualizo los datos del usuario en la vista
        setDatosUsuario(prev => ({ ...prev, rol: data.nuevoRol }));
    })
    .catch(err => console.error("Error:", err));
}