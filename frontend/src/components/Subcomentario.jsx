import { useState } from "react";

const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

export default function Subcomentario({ comentarioId, idProducto, idUsuario, onNuevoSubcomentario }) 
{
    const [texto, setTexto] = useState("");

    const enviarSubcomentario = (e) => {
        e.preventDefault();

        fetch(`${dominioBackend}:${puertoBackend}/comentarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                texto,
                id_producto: idProducto,
                id_usuario: idUsuario,
                id_comentario_padre: comentarioId
            })
            })
        .then(res => res.json())
        .then(data => {
            onNuevoSubcomentario(data); // Avisa al padre que hay un nuevo subcomentario
            setTexto("");               // Limpia el textArea al enviarse el subcomentario
        })
        .catch(err => console.error(err));
    };

    return (
        <form onSubmit={enviarSubcomentario} className="mt-2">

            <textarea 
                className="form-control" 
                rows="2" 
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Responder a este comentario"
            />

            <button type="submit" className="btn btn-secondary btn-sm mt-1">
                Responder
            </button>
            
        </form>
    );
}
