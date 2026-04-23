import { useState, useEffect } from "react";
import Select from "react-select";

const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

export default function CrearOfertaModal({ onClose, onSave }) {
    // Estado inicial vacío
    const [productos, setProductos] = useState([]);
    const [productosDeLaOferta, setProductosDeLaOferta] = useState([]);
    const [imagen, setImagen] = useState(null);
    const [nuevaOferta, setNuevaOferta] = useState({
        nombre: "",
        descripcion: "",
        precio_original: 0,
        precio_oferta: 0,
        fecha_inicio: "",
        fecha_fin: "",
        fuenteImagen: "",
        nuevaImagen: null
    });

    useEffect(() => {
        // Traigo todos los productos activos
        fetch(`${dominioBackend}:${puertoBackend}/productos`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
        .then((res) => res.json())
        .then((data) => setProductos(data))
        .catch((err) => console.error("Error al traer productos:", err));
    }, []);

    useEffect(() => {
        // Calcular precio original según productos seleccionados
        const precioTotal = productosDeLaOferta.reduce(
            (acc, prod) => acc + prod.precio * (prod.cantidad || 1), 
            0
        );
        setNuevaOferta(prev => ({ ...prev, precio_original: precioTotal }));
    }, [productosDeLaOferta]);

    const productosDisponibles = productos.filter(
        p => !productosDeLaOferta.some(po => po.id === p.id || po.producto_id === p.id)
    );

    const opciones = productosDisponibles.map(prod => ({
        value: prod.id,
        label: prod.nombre,
        data: prod
    }));

    const formatOptionLabel = ({ label, data }) => (
        <div className="d-flex align-items-center">
            <img
                src={data.fuenteImagen || "/images/producto-generico.jpg"}
                alt={label}
                style={{ width: "30px", height: "30px", objectFit: "cover", marginRight: "10px" }}
            />
            <span>{label} (${data.precio.toLocaleString("es-AR")})</span>
        </div>
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevaOferta({ ...nuevaOferta, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const ofertaFinal = {
            ...nuevaOferta,
            productosDeLaOferta
        };
        onSave(ofertaFinal);
    };

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content border border-dark">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">Crear nueva oferta</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>

                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label"><strong>Nombre</strong></label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        className="form-control"
                                        value={nuevaOferta.nombre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label"><strong>Descripción</strong></label>
                                    <input
                                        type="text"
                                        name="descripcion"
                                        className="form-control"
                                        value={nuevaOferta.descripcion}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label"><strong>Precio original</strong></label>
                                    <input
                                        type="number"
                                        name="precio_original"
                                        className="form-control"
                                        value={nuevaOferta.precio_original}
                                        readOnly
                                        style={{ cursor: "not-allowed" }}
                                    />
                                    <small className="text-muted fst-italic">
                                        Calculado automáticamente según los productos de la oferta
                                    </small>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label"><strong>Precio oferta</strong></label>
                                    <input
                                        type="number"
                                        name="precio_oferta"
                                        className="form-control"
                                        value={nuevaOferta.precio_oferta}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label"><strong>Fecha inicio</strong></label>
                                    <input
                                        type="date"
                                        name="fecha_inicio"
                                        className="form-control"
                                        value={nuevaOferta.fecha_inicio}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label"><strong>Fecha fin</strong></label>
                                    <input
                                        type="date"
                                        name="fecha_fin"
                                        className="form-control"
                                        value={nuevaOferta.fecha_fin}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Productos seleccionados */}
                                <div className="col-12 mt-4">
                                    <h6 className="mb-3 text-center"><strong>Productos incluidos en la oferta:</strong></h6>
                                    <div className="row justify-content-center">
                                        {productosDeLaOferta.length > 0 ? (
                                            productosDeLaOferta.map((prod) => (
                                                <div className="col-12 col-sm-6 col-md-4 mb-3" key={prod.id}>
                                                    <div className="card h-100 shadow-sm text-center" style={{ maxWidth: "220px", margin: "0 auto" }}>
                                                        <button
                                                            type="button"
                                                            className="btn-close position-absolute"
                                                            style={{ top: "5px", right: "5px" }}
                                                            aria-label="Eliminar"
                                                            onClick={() => {
                                                                setProductosDeLaOferta(productosDeLaOferta.filter(p => p.id !== prod.id));
                                                            }}
                                                        />
                                                        <div className="d-flex justify-content-center align-items-center" style={{ height: "140px" }}>
                                                            <img
                                                                src={prod.fuenteImagen || "/images/producto-generico.jpg"}
                                                                alt={prod.nombre}
                                                                className="img-fluid"
                                                                style={{ maxHeight: "130px", objectFit: "contain" }}
                                                            />
                                                        </div>
                                                        <div className="card-body p-2">
                                                            <p className="fw-bold mb-1">{prod.nombre}</p>
                                                            <p className="text-muted mb-2">${prod.precio.toLocaleString("es-AR")}</p>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={prod.cantidad || 1}
                                                                onChange={(e) => {
                                                                    const nuevaCantidad = parseInt(e.target.value, 10);
                                                                    setProductosDeLaOferta(productosDeLaOferta.map(p =>
                                                                        p.id === prod.id ? { ...p, cantidad: nuevaCantidad } : p
                                                                    ));
                                                                }}
                                                                className="form-control form-control-sm text-center"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted fst-italic text-center">No hay productos seleccionados.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Selector de productos */}
                                <div>
                                    <Select
                                        options={opciones}
                                        formatOptionLabel={formatOptionLabel}
                                        onChange={(selected) => {
                                            const productoSeleccionado = productos.find(p => p.id === selected.value);
                                            if (productoSeleccionado) {
                                                setProductosDeLaOferta([...productosDeLaOferta, { ...productoSeleccionado, cantidad: 1 }]);
                                            }
                                        }}
                                        placeholder="Selecciona un producto..."
                                    />
                                </div>

                                {/* Imagen */}
                                <div className="col-md-12">
                                    <label className="form-label">Imagen de la oferta</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            setImagen(file);
                                            if (file) {
                                                setNuevaOferta({ ...nuevaOferta, nuevaImagen: file });
                                            }
                                        }}
                                    />
                                    {imagen && (
                                        <div className="mt-2 text-center">
                                            <p className="text-muted">Nueva imagen seleccionada:</p>
                                            <img
                                                src={URL.createObjectURL(imagen)}
                                                alt="Preview nueva imagen"
                                                className="border border-2"
                                                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-success">
                                Crear oferta
                            </button>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
    );
}
