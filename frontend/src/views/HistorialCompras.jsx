import { useState, useEffect, useContext } from "react";

import { UsuarioContext } from "../context/UsuarioContext.jsx";

import ProductoHistorial from "../components/ProductoHistorial.jsx";

import { 
  handleFechaChange, 
  limpiarFiltros, 
  agruparPorCompra, 
  fetchHistorial, 
  fetchHistorialConFiltro, 
  formatearFechaCompra,
  calcularTotalCompra,
  generarPDFCompra
} from "./HistorialCompras.helpers.js";

const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

export default function HistorialCompras() 
{
  // Variables de contexto
  const { usuario } = useContext(UsuarioContext);

  // Variables de estado
  const [productos, setProductos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const endpoint = `${dominioBackend}:${puertoBackend}/historial`;

  useEffect(() => {
    if (!usuario) return;
    
    fetchHistorial(endpoint, usuario.id)
    .then(setProductos)
    .catch((err) => console.error("Error al traer productos:", err));

  }, [usuario, endpoint]);

  const gruposDeCompras = agruparPorCompra(productos);

  // Ordena los grupos por fecha (más nuevo primero)
  const gruposOrdenados = Object.entries(gruposDeCompras).sort(
    ([fechaA], [fechaB]) => new Date(fechaB) - new Date(fechaA)
  );

  if (!usuario) return <p>Cargando usuario...</p>;

  return (
    <div className="container">
      <div className="filtro-fechas d-flex align-items-center gap-3 mb-3">

        <div>
          <label className="form-label">
            Desde:
            <input 
              type="date" 
              className="form-control" 
              value={fechaInicio}
              onChange={handleFechaChange(setFechaInicio)} 
            />
          </label>
        </div>

        <div>
          <label className="form-label">
            Hasta:
            <input 
              type="date" 
              className="form-control" 
              value={fechaFin}
              onChange={handleFechaChange(setFechaFin)} 
            />
          </label>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => {
            fetchHistorialConFiltro(endpoint, usuario.id, fechaInicio, fechaFin)
            .then(setProductos)
            .catch((err) => console.error("Error al traer productos:", err));
          }}
        >
          Filtrar
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => limpiarFiltros(setFechaInicio, setFechaFin, setProductos, endpoint, usuario.id)} // 👈 helper
        >
          Limpiar filtros
        </button>
      </div>

      {/* Object.entries(gruposDeCompras) convierte el objeto gruposDeCompras en un array de pares [clave, valor]. */}
      {gruposOrdenados.map(([fechaCompra, productosCompra]) => {
        
        const totalCompra = calcularTotalCompra(productosCompra);

        return (
          <div key={fechaCompra} className="compra">

            {/* Titulo que separa los productos comprados */}
            <h4>
              {formatearFechaCompra(fechaCompra)} — 
              Total: ${totalCompra.toLocaleString("es-AR")}
            </h4>

            {/* Boton para descargar la compra en formato PDF */}
            <button 
              className="btn btn-sm btn-outline-danger mb-3"
              onClick={() => generarPDFCompra(usuario.nombre, fechaCompra, productosCompra, totalCompra)}
            >
              📄 Descargar PDF
            </button>

            {/* Productos comprados */}
            <div className="row">
              {productosCompra.map((producto) => (
                <div className="col" key={producto.id}>
                  <ProductoHistorial producto={producto} />
                </div>
              ))}
            </div>

            <br />
          </div>
        );
      })}
      
    </div>
  );
}
