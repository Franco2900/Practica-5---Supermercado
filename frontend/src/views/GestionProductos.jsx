import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import EditarProductoModal from "../components/EditarProductoModal";
import AltaProductoModal   from "../components/AltaProductoModal.jsx";
import { guardarEdicion, eliminarProducto, altaProducto } from "./GestionProductos.helpers.js"; 

const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

export default function GestionProductos() 
{
    // Variables de estado
    const [productos, setProductos] = useState([]);
    
    const [productoEditando, setProductoEditando] = useState(null);
    const [mostrarAlta, setMostrarAlta] = useState(false);

    // Cargar productos al inicio
    useEffect(() => {
        fetch(`${dominioBackend}:${puertoBackend}/productos`)
        .then(res => res.json())
        .then(data => {
            setProductos(data);
        })
        .catch(err => console.error("Error cargando productos:", err));
    }, []);

    
    return (
        <div className="container mt-4">
        <h2>Gestión de Productos</h2>

        <button className="btn btn-success mb-3" onClick={() => setMostrarAlta(true)}>
            Nuevo producto
        </button>

        {/* Listado de productos */}
        <table className="table table-striped">
            <thead>
            <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Subcategoría</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {productos.map(prod => (
                <tr key={prod.id}>
                <td>
                    <img src={prod.fuenteImagen} alt={prod.nombre} style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                </td>
                <td>{prod.nombre}</td>
                <td>${prod.precio}</td>
                <td>{prod.categoria}</td>
                <td>{prod.subcategoria}</td>
                <td>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => setProductoEditando(prod)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(prod.id, setProductos, productos)}>Eliminar</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>


        {/* Modal de alta */}
        {mostrarAlta && (
            <AltaProductoModal
                productos={productos}
                onClose={() => setMostrarAlta(false)}
                onSave={(nuevoProd, resetForm) =>
                    altaProducto(nuevoProd, setProductos, productos, resetForm, () => setMostrarAlta(false))
                }
            />
        )}


        {/* Modal de modificación */}
        {productoEditando && (
            <EditarProductoModal
                producto={productoEditando}
                productos={productos}
                onClose={() => setProductoEditando(null)}
                onSave={(prod, cerrar) => 
                    guardarEdicion(prod, setProductos, setProductoEditando, productos, cerrar)
                }
            />
        )}

        </div>
    );
}
