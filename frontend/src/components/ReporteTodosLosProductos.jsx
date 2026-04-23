import { Link } from "react-router-dom";

export default function ReporteTodosLosProductos({productos}) 
{
    return (
        <div className="container mt-4">

            <h2 className="mt-5 mb-4">Todos los Productos</h2>

            <div className="table-responsive">

                <table className="table table-striped table-hover">

                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Categoría</th>
                            <th>Subcategoría</th>
                            <th>Cantidad Vendida</th>
                            <th>Ingresos Generados</th>
                        </tr>
                    </thead>

                    <tbody>
                        {productos.map((prod, index) => (
                            <tr key={prod.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <Link to={`/productos/${prod.id}`}>
                                        {prod.nombre}
                                    </Link>
                                </td>
                                <td>${prod.precio.toLocaleString("es-AR")}</td>
                                <td>{prod.categoria}</td>
                                <td>{prod.subcategoria}</td>
                                <td>{prod.cantidad_vendido}</td>
                                <td>${prod.ingresos_generados.toLocaleString("es-AR")}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>

        </div>
    );
}
