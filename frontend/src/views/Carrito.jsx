import React, { useEffect, useContext, useState } from "react";

import { CarritoContext } from "../context/CarritoContext.jsx";
import { UsuarioContext } from "../context/UsuarioContext.jsx";

import ProductoCarrito from "../components/ProductoCarrito.jsx";

import { dividirProductosEnFilas, calcularCostoTotal, comprarCarrito, vaciarCarrito } from "./Carrito.helpers.js";

// Variables de entorno
const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

export default function Carrito() 
{
    // Variables de contexto
    const { carrito, setCarrito } = useContext(CarritoContext);
    const { usuario, setUsuario } = useContext(UsuarioContext);

    // Variables de estado
    const [ofertasModificadas, setOfertasModificadas] = useState({});
    const [cantidadesOfertas, setCantidadesOfertas] = useState({});

    // Petición al backend según si hay usuario o no
    useEffect(() => {

        if (!usuario) return;

        fetch(`${dominioBackend}:${puertoBackend}/carrito/obtenerCarrito`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario_id: usuario.id })
        })
        .then(res => res.json())
        .then(data => setCarrito(data))
        .catch(err => console.error("Error al traer productos del carrito:", err));

    }, [usuario]);

    // Si los datos del usuario no se cargaron todavía
    if (!usuario) return <p>Cargando usuario...</p>;

    const filasDeProductos  = dividirProductosEnFilas(carrito, 3);
    const costoTotalCarrito = calcularCostoTotal(carrito);
    const carritoVacio      = carrito.length === 0;

    return (
        <div className="container">

        <br />

        <div className="d-flex justify-content-between mt-4">

            <button
            className="btn btn-success"
            disabled={carritoVacio}  // Deshabilito el boton si esta el carrito vacio
            onClick={() => comprarCarrito(usuario.id, setCarrito, setUsuario)}
            >
            Comprar (${costoTotalCarrito.toLocaleString("es-AR")})
            </button>

            <button
            className="btn btn-danger"
            disabled={carritoVacio}  // Deshabilito el boton si esta el carrito vacio
            onClick={() => vaciarCarrito(usuario.id, setCarrito)}
            >
            Vaciar carrito
            </button>

        </div>

        <br />

        {filasDeProductos.map((fila, index) => (
            // Nueva fila
            <React.Fragment key={index}>
            <div className="row">

                {/* Nuevo producto de la fila */}
                {fila.map(producto => (
                    <div className="col" key={producto.id}>
                        <ProductoCarrito 
                            producto={producto}
                            ofertasModificadas={ofertasModificadas} 
                            setOfertasModificadas={setOfertasModificadas}
                            cantidadesOfertas={cantidadesOfertas} 
                            setCantidadesOfertas={setCantidadesOfertas}
                        />
                    </div>
                ))}

            </div>
            <br />
            </React.Fragment>
        ))}
        </div>
    );
}
