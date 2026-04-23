import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";

import { UsuarioContext } from "../context/UsuarioContext.jsx";

import Comentario from "../components/Comentario.jsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

export default function ProductoDetalle() 
{
    const { id } = useParams(); // Obtiene el id de la URL
    
    // Variables de estado
    const [producto, setProducto] = useState(null);              // Contiene todos los productos
    
    const [comentarios, setComentarios] = useState([]);          // Contiene todos los comentarios
    const [nuevoComentario, setNuevoComentario] = useState("");  // Almacena lo escrito en el nuevo comentario
    
    const [valoracionDelUsuario, setValoracionDelUsuario] = useState(0);   // Contiene la valoracion del usuario sobre el producto actual
    const [valoracionDelProducto, setValoracionDelProducto] = useState(0); // Contiene la valoracion promedio del producto


    // Variables de contexto
    const { usuario } = useContext(UsuarioContext);

    // Llamada al backend
    useEffect(() => {

        //  Para obtener el producto
        fetch(`${dominioBackend}:${puertoBackend}/productos/${id}`)
        .then(res => {
            if (!res.ok) throw new Error("Error al obtener producto");
            return res.json();
        })
        .then(data => setProducto(data))
        .catch(err => console.error(err));


        // Para obtener comentarios del producto
        fetch(`${dominioBackend}:${puertoBackend}/comentarios/${id}`)
        .then(res => {
            if (!res.ok) throw new Error("Error al obtener comentarios");
            return res.json();
        })
        .then(data => setComentarios(data))
        .catch(err => console.error(err));


        // Para obtener la valoración del usuario sobre el producto (solo si el usuario esta logueado)
        if (usuario) 
        {
            fetch(`${dominioBackend}:${puertoBackend}/valoraciones/valoracionDelUsuario`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_producto: id,
                    id_usuario: usuario.id
                })
            })
            .then(res => {
                if (!res.ok) throw new Error("Error al obtener la valoración del usuario sobre el producto");
                return res.json();
            })
            .then(data => {
                setValoracionDelUsuario(data.valoracionDelUsuario || 0);
            })
            .catch(err => console.error(err));
        }

    }, [id]);


    const enviarComentario = (e) => {
        e.preventDefault();
        
        fetch(`${dominioBackend}:${puertoBackend}/comentarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                texto: nuevoComentario,
                id_producto: id,
                id_usuario: usuario.id,
                id_comentario_padre: null
            })
        })
        .then(res => res.json())
        .then(data => {
            setComentarios([...comentarios, data]);
            setNuevoComentario("");
        })
        .catch(err => console.error(err));
    };


    // Función para manejar nuevos subcomentarios
    const manejarNuevoSubcomentario = (comentarioId, nuevoSubcomentario) => {
        setComentarios(prev =>
            prev.map(c => 
                c.id === comentarioId 
                    ? { ...c, subcomentarios: [...(c.subcomentarios || []), nuevoSubcomentario] }
                    : c
            )
        );
    };


    const enviarValoracion = (valor) => {

        fetch(`${dominioBackend}:${puertoBackend}/valoraciones`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                valoracion: valor,
                id_producto: id,
                id_usuario: usuario.id
            })
        })
        .then(res => res.json())
        .then(data => {
            // Actualizo la valoración del usuario
            setValoracionDelUsuario(valor);

            // Actualizo el producto con los nuevos datos que devuelve el backend
            setProducto(prevProducto => ({
                ...prevProducto,
                valoracion_promedio: data.valoracionPromedio,
                cantidad_valoraciones: data.cantidadValoraciones
            }));
        })
        .catch(err => console.error(err));
    }

    if (!producto) return <p>Cargando producto...</p>;

    return (
        <div className="container mt-5">
            <h2>{producto.nombre}</h2>

            <img src={producto.fuenteImagen} alt={producto.nombre} />
            
            <p>{producto.descripcion}</p>

            <p><strong>Precio:</strong> ${producto.precio}</p>
            <p><strong>Categoría:</strong> {producto.categoria}</p>
            <p><strong>Subcategoría:</strong> {producto.subcategoria}</p>
    
            {producto.valoracion_promedio > 0 && (
                <p>
                    <strong>Valoración promedio:</strong>{" "}
                    {[1, 2, 3, 4, 5].map(num => {

                        // Recorro cada numero del mapa y determino que tipo de estrella le corresponde a cada uno
                        const promedio = Number(producto.valoracion_promedio);
                        const entero = Math.floor(promedio);
                        const decimal = promedio - entero;

                        // Pinto estrella entera, si el numero es menor o igual al entero del promerio
                        if (num <= entero)  return <FontAwesomeIcon key={num} icon="star" style={{ color: "gold" }} />;
                        
                        // Si la valoracion promedio tiene decimal
                        else if (num === entero + 1 && decimal > 0) 
                        {
                            // Si el decimal es 0.5 o menos, pinto medio estrella
                            if (decimal <= 0.5) return <FontAwesomeIcon key={num} icon="star-half-alt" style={{ color: "gold" }} />;
                            // Si el decimal es 0.51 o más, pinto estrella completa
                            else                return <FontAwesomeIcon key={num} icon="star" style={{ color: "gold" }} />;
                        } 

                        // Pinto estrella vacia
                        else return <FontAwesomeIcon key={num} icon="star" style={{ color: "lightgray" }} />;
                        
                    })}
                    <span className="ms-2 text-muted">
                        ({Number(producto.valoracion_promedio) % 1 === 0 
                            ? Number(producto.valoracion_promedio)   // si es entero, muestro sin decimales
                            : Number(producto.valoracion_promedio).toFixed(2)} / 5
                        )
                    </span>

                    {/* Cantidad de valoraciones */}
                    <span className="ms-2 text-muted">
                        - {producto.cantidad_valoraciones} valoraciones
                    </span>
                </p>
            )}

            {usuario ? (
                <p>
                    <strong>Tu valoración:</strong>
                    {/* Pinta las estrellas en dorado hasta la seleccionada */}
                    {[1,2,3,4,5].map(num => (
                        <span 
                            key={num}
                            style={{cursor: "pointer", fontSize: "24px", color: num <= valoracionDelUsuario ? "gold" : "gray"}}
                            onClick={() => enviarValoracion(num)}
                        >
                            ★
                        </span>
                    ))}
                </p>
            ) : (
                <p className="text-muted">
                    Debes iniciar sesión para poder valorar con estrellas.
                </p>
            )}

            <div className="mt-5">
                <h3>Comentarios</h3>

                {/* Formulario para comentar que aparece solo si el usuario está logueado */}
                {usuario ? (
                    <form onSubmit={enviarComentario}>
                        <textarea 
                            className="form-control" 
                            rows="3" 
                            value={nuevoComentario}
                            onChange={(e) => setNuevoComentario(e.target.value)}
                            placeholder="Dinos lo que piensas del producto"
                        />
                        <button type="submit" className="btn btn-primary mt-2">Enviar</button>
                    </form>
                ) : (
                    <p className="text-muted">
                        Debes iniciar sesión para poder comentar.
                    </p>
                )}

                {/* Lista de comentarios */}
                <ul className="list-group mt-4">
                    {comentarios.map(comentario => (
                        <Comentario 
                            key={comentario.id}
                            comentario={comentario}
                            usuario={usuario}
                            idProducto={id}
                            onNuevoSubcomentario={manejarNuevoSubcomentario}
                        />
                    ))}
                </ul>

            </div>

            {/* Espacio vacio extra al final por temas de estetica */}
            <div className="mb-4"></div>

        </div>
    );
}
