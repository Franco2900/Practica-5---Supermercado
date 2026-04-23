import { useState, useEffect } from "react";

const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

// Hace la búsqueda en la base de datos
export function buscarProductos() 
{
    const [query, setQuery] = useState("");
    const [resultados, setResultados] = useState([]);

    useEffect(() => {
        
        if (query.length < 3) 
        {
            setResultados([]);
            return;
        }

    console.log("POST búsqueda:", query);

    fetch(`${dominioBackend}:${puertoBackend}/productos/buscarSugerencias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: query })
    })
    .then(res => {
        if (!res.ok) throw new Error("Error en la búsqueda");
        return res.json();
    })
    .then(data => {
        setResultados(data);
    })
    .catch(err => {
        console.error("Error en buscador:", err);
        setResultados([]);
    });

    }, [query]);

    return { query, setQuery, resultados };
}
