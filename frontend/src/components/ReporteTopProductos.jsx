import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

export default function ReporteTopProductos({productos}) 
{
    return (
        <div className="container mt-4">

            <h2 className="mb-4">Top 5 Productos Más Vendidos</h2>

            <div className="row">
                {productos.map((prod) => (
                <div key={prod.id} className="col-md-4 mb-4">
                    <div className="card h-100 shadow-sm">
                    
                        <img
                            src={prod.fuenteImagen}
                            className="card-img-top"
                            alt={prod.nombre}
                            style={{ height: "200px", objectFit: "cover" }}
                        />

                        <div className="card-body d-flex flex-column">
                            
                            <h5 className="card-title">{prod.nombre}</h5>
                            
                            <p className="card-text">
                                <strong>Cantidad vendido:</strong> {prod.cantidad_vendido}
                            </p>
                            
                            <p className="card-text">
                                <strong>Ingresos generados:</strong> ${prod.ingresos_generados.toLocaleString("es-AR")}
                            </p>

                            <div className="mt-auto">
                            <Link
                                to={`/productos/${prod.id}`}
                                className="btn btn-primary w-100"
                            >
                                Ver Detalle
                            </Link>
                            </div>
                        </div>

                    </div>
                </div>
                ))}
            </div>
            
        </div>
    );
};