import Carrusel from "../components/Carrusel.jsx"
import ListadoProductosUsuarioInvitado from "../components/ListadoProductosUsuarioInvitado.jsx"
import ListadoProductosUsuarioLogueado from "../components/ListadoProductosUsuarioLogueado.jsx";
import BarraBusqueda from "../components/BarraBusqueda.jsx";

import "./ListadoProductos.css";

import { useState, useEffect, useContext } from 'react'; // Importo los hook
import { UsuarioContext } from "../context/UsuarioContext.jsx";

// Variables de entorno
const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

export default function ListadoProductos()
{
    // Variables de estado
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);

    // Variables de contexto
    const { usuario } = useContext(UsuarioContext);

    // Petición al backend según si hay usuario o no
    useEffect(() => {

        if (usuario) 
        {
            // Usuario logueado → productos con favoritos
            fetch(`${dominioBackend}:${puertoBackend}/productos/productosMasFavoritos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario_id: usuario.id })
            })
            .then((res) => res.json())
            .then((data) => setProductos(data))
            .catch((err) => console.error("Error al traer productos favoritos:", err));
        } 
        else 
        {
            // Usuario invitado → productos generales
            fetch(`${dominioBackend}:${puertoBackend}/productos/`)
            .then((res) => res.json())
            .then((data) => setProductos(data))
            .catch((err) => console.error("Error al traer productos:", err));
        }

    }, [usuario]); // se ejecuta al montar y cada vez que cambia usuario


    function dividirProductosEnFilas(productos, tamanioParaDividir)
    {
        const resultado = [];

        for (let i = 0; i < productos.length; i += tamanioParaDividir) 
        { 
            resultado.push( productos.slice(i, i + tamanioParaDividir) ); 
            // Extraigo una parte del array (inicio, fin) sin modificar el array original
            //Luego pongo las distintas partes en otro array. Cada parte es una fila de productos.
        }

        return resultado;
    }

    // Si hay productos filtrados muestra esos productos, sino hay filtrado muestra todos
    const filasDeProductos = dividirProductosEnFilas(
        productosFiltrados.length > 0 ? productosFiltrados : productos,
        3
    );

    return (
        <>
            <Carrusel />
            <br />

            <div className="container">

                <BarraBusqueda productos={productos} onFiltrar={setProductosFiltrados} />

                {/* Para cada fila */}
                {filasDeProductos.map((fila, filaIndex) => (

                    <>
                    {/*Nueva fila*/}
                    <div className="row" key={filaIndex}>
                        
                        {/* Para cada producto de la fila */}
                        {fila.map((producto) => (
                            
                            // Nueva columna
                            <div className="col" key={producto.id}> {/* key sirve para que React solo cambia ese componente si algo cambia*/}
                                {usuario ? (
                                    <ListadoProductosUsuarioLogueado producto={producto} />
                                ) : (
                                    <ListadoProductosUsuarioInvitado producto={producto} />
                                )}
                            </div>
                        ))}
                    </div>

                    <br />
                    </>
                ))}

            </div> 

        </>
    )
}
