import { Link } from "react-router-dom";

// Muestra las sugerencias de la busqueda
export default function MostrarSugerencias({ resultados }) 
{
    if (!resultados || resultados.length === 0) return null;

    return (
        <ul 
            className="list-group position-absolute mt-1 w-100" 
            style={{ top: "100%", left: 0, zIndex: 9999 }}
        >
        {resultados.map(prod => (
            <li key={prod.id} className="list-group-item">
            <Link 
                to={`/productos/${prod.id}`} 
                className="text-decoration-none"
            >
                <img 
                    src={prod.fuenteImagen} 
                    alt={prod.nombre} 
                    style={{ width: "40px", height: "40px", objectFit: "cover", marginRight: "10px" }}
                />
                <span>{prod.nombre}</span>
            </Link>
            </li>
        ))}
        </ul>
    );
}
