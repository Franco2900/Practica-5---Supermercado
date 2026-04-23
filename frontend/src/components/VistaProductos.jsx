import { useEffect, useState, useContext } from "react";
import { UsuarioContext } from "../context/UsuarioContext.jsx";

export default function VistaProductos({ endpoint, ComponenteProducto }) 
{
    // Variables de contexto
    const { usuario } = useContext(UsuarioContext);

    // Variables de estado
    const [productos, setProductos] = useState([]);

    useEffect(() => {

        if (!usuario) return; // Si todavía no está cargado los datos del usuario, no hago nada (tarda un segundo en cargar los datos del contexto)

        // Consulta al backend
        fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario_id: usuario.id })
        })
        .then((res) => res.json())
        .then((data) => setProductos(data))
        .catch((err) => console.error("Error al traer productos:", err));

    }, [usuario, endpoint]); // Se ejecuta cada vez que cambia el usuario


    function dividirProductosEnFilas(productos, tamanioParaDividir) 
    {
        const resultado = [];

        for (let i = 0; i < productos.length; i += tamanioParaDividir) 
        {
            resultado.push( productos.slice(i, i + tamanioParaDividir) );
        }
        // Extraigo una parte del array (inicio, fin) sin modificar el array original
        // Luego pongo las distintas partes en otro array. Cada parte es una fila de productos.

        return resultado;
    }

    const filasDeProductos = dividirProductosEnFilas(productos, 3);

    // Si los datos del usuario no se cargaron todavía
    if (!usuario) {
        return <p>Cargando usuario...</p>;
    }

    return (
        <div className="container">

            <br />

            {/* Para cada fila */}
            {filasDeProductos.map((fila, filaIndex) => (
                
                <>
                <div className="row" key={filaIndex}>
                    
                {/* Para cada producto de la fila */}
                {fila.map((producto) => (
                    <div className="col" key={producto.id}>
                        <ComponenteProducto producto={producto} />
                    </div>
                ))}

                </div>

                <br></br>
                </>
            ))}

        </div>
    );
}
