import Subcomentario from "./Subcomentario.jsx";

export default function Comentario({ comentario, usuario, idProducto, onNuevoSubcomentario }) 
{
    return (
        <li className="list-group-item mb-3 border border-dark rounded">

            {/* Comentario */}
            <img 
                src={comentario.urlFotoPerfil} 
                alt="perfil" 
                className="rounded-circle me-2" 
                style={{width: "40px", height: "40px"}} 
            />
            <strong>{comentario.nombre}: </strong> ({comentario.fecha_creacion}) <br />
            {comentario.texto}

            {/* Subcomentarios */}
            {comentario.subcomentarios?.length > 0 && (
                <ul className="mt-2">
                    {comentario.subcomentarios.map(sub => (
                        <li key={sub.id} className="subcomentario mb-2">
                            <img 
                                src={sub.urlFotoPerfil} 
                                alt="perfil" 
                                className="rounded-circle me-2" 
                                style={{width: "30px", height: "30px"}} 
                            />
                            <strong>{sub.nombre}:</strong> ({sub.fecha_creacion}) <br />
                            {sub.texto}
                        </li>
                    ))}
                </ul>
            )}

            {/* Formulario para crear nuevo subcomentario */}
            {usuario && (
                <Subcomentario 
                    comentarioId={comentario.id}
                    idProducto={idProducto}
                    idUsuario={usuario.id}
                    onNuevoSubcomentario={(nuevoSub) => onNuevoSubcomentario(comentario.id, nuevoSub)}
                />
            )}
        </li>
    );
}
