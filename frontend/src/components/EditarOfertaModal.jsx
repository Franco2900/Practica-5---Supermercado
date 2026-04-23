import { useState, useEffect } from "react";
import Select from "react-select";

// Variables de entorno
const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

export default function EditarOfertaModal({ oferta, onClose, onSave }) {
    if (!oferta) return null;

    // Variables de estado
    const [productos, setProductos] = useState([]);
    const [productosDeLaOferta, setProductosDeLaOferta] = useState([]);
    const [imagen, setImagen] = useState(null);
    const [ofertaEditada, setOfertaEditada] = useState(oferta);

    useEffect(() => {

        // Petición al backend para obtener los datos de los productos de la oferta
        fetch(`${dominioBackend}:${puertoBackend}/ofertas/${oferta.id}/productos`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
        .then((res) => res.json())
        .then((data) => setProductosDeLaOferta(data))
        .catch((err) => console.error("Error al traer las ofertas:", err));

        // Petición al backend para obtener los datos de todos los productos activos
        fetch(`${dominioBackend}:${puertoBackend}/productos`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
        .then((res) => res.json())
        .then((data) => setProductos(data))
        .catch((err) => console.error("Error al traer las ofertas:", err));

        // Si cambia la oferta seleccionada, actualizo el estado local
        setOfertaEditada(oferta);

    }, [oferta]);


    useEffect(() => {
        // Calcular precio original cada vez que cambian los productos de la oferta
        const precioTotal = productosDeLaOferta.reduce(
            (acc, prod) => acc + prod.precio * (prod.cantidad || 1),
            0
        );

        setOfertaEditada(prev => ({ ...prev, precio_original: precioTotal }));
    }, [productosDeLaOferta]);



    // Filtra productos que ya están en la oferta
    const productosDisponibles = productos.filter(
        p => !productosDeLaOferta.some(po => po.id === p.id || po.producto_id === p.id)
    );

    // Opciones para react-select
    const opciones = productosDisponibles.map(prod => ({
        value: prod.id,
        label: prod.nombre,
        data: prod
    }));

    // Render personalizado de cada opción
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

    // Actualizo los datos de la oferta
    const handleChange = (e) => {
        const { name, value } = e.target;
        setOfertaEditada({ ...ofertaEditada, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Si no hay nueva imagen, mantengo la fuenteImagen actual
        const ofertaFinal = {
            ...ofertaEditada,
            nuevaImagen: ofertaEditada.nuevaImagen || null,
            fuenteImagen: ofertaEditada.fuenteImagen,
            productosDeLaOferta 
        };

        onSave(ofertaFinal); // mando la oferta editada al padre
    };

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content border border-dark">
                    <form onSubmit={handleSubmit}>
                        
                        <div className="modal-header">
                            <h5 className="modal-title">Editar oferta</h5>
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
                                        value={ofertaEditada.nombre}
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
                                        value={ofertaEditada.descripcion}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label"><strong>Precio original</strong></label>
                                    <input
                                        type="number"
                                        name="precio_original"
                                        className="form-control"
                                        value={ofertaEditada.precio_original || 0}
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
                                        value={ofertaEditada.precio_oferta}
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
                                        value={ofertaEditada.fecha_inicio ? ofertaEditada.fecha_inicio.split("T")[0] : ""}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label"><strong>Fecha fin</strong></label>
                                    <input
                                        type="date"
                                        name="fecha_fin"
                                        className="form-control"
                                        value={ofertaEditada.fecha_fin ? ofertaEditada.fecha_fin.split("T")[0] : ""}
                                        onChange={handleChange}
                                    />
                                </div>


                                {/* Productos dentro de la oferta */}
                                <div className="col-12 mt-4">

                                    <h6 className="mb-3 text-center">
                                        <strong>
                                        Productos incluidos en la oferta:
                                        </strong>
                                    </h6>

                                    <div className="row justify-content-center">
                                        {productosDeLaOferta && productosDeLaOferta.length > 0 ? (
                                            productosDeLaOferta.map((prod) => (
                                                <div className="col-12 col-sm-6 col-md-4 mb-3" key={prod.producto_id}>
                                                    <div className="card h-100 shadow-sm text-center" style={{ maxWidth: "220px", margin: "0 auto" }}>
                                                        
                                                        {/* Botón X para eliminar */}
                                                        <button
                                                        type="button"
                                                        className="btn-close position-absolute"
                                                        style={{ top: "5px", right: "5px" }}
                                                        aria-label="Eliminar"
                                                        onClick={() => {
                                                            setProductosDeLaOferta(productosDeLaOferta.filter(p => (p.producto_id || p.id) !== (prod.producto_id || prod.id)));
                                                        }}
                                                        />

                                                        {/* Imagén del producto */}
                                                        <div className="d-flex justify-content-center align-items-center" style={{ height: "140px" }}>
                                                            <img
                                                                src={prod.fuenteImagen || "/images/producto-generico.jpg"}
                                                                alt={prod.nombre}
                                                                className="img-fluid"
                                                                style={{ maxHeight: "130px", objectFit: "contain" }}
                                                            />
                                                        </div>

                                                        {/* Datos del producto */}
                                                        <div className="card-body p-2">
                                                            <p className="fw-bold mb-1">{prod.nombre}</p>
                                                            
                                                            <p className="text-muted mb-0">
                                                                ${prod.precio.toLocaleString("es-AR")}
                                                            </p>

                                                            {/* Input para cantidad */}
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={prod.cantidad || 1}
                                                                onChange={(e) => {
                                                                    const nuevaCantidad = parseInt(e.target.value, 10);
                                                                    setProductosDeLaOferta(productosDeLaOferta.map(p =>
                                                                        (p.producto_id || p.id) === (prod.producto_id || prod.id)
                                                                            ? { ...p, cantidad: nuevaCantidad }
                                                                            : p
                                                                    ));
                                                                }}
                                                                className="form-control form-control-sm text-center"
                                                            />

                                                        </div>

                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted fst-italic text-center">
                                                No hay productos asociados a esta oferta.
                                            </p>
                                        )}
                                    </div>
                                </div>


                                {/* Selector de productos para añadir a la oferta */}
                                <div>
                                    <Select
                                        options={opciones}
                                        formatOptionLabel={formatOptionLabel}
                                        onChange={(selected) => {
                                            const productoSeleccionado = productos.find(p => p.id === selected.value);
                                            if (productoSeleccionado && !productosDeLaOferta.find(p => p.id === productoSeleccionado.id)) {
                                                setProductosDeLaOferta([...productosDeLaOferta, { ...productoSeleccionado, cantidad: 1 }]);
                                            }
                                        }}
                                        placeholder="Selecciona un producto..."
                                    />
                                </div>


                                {/* Imagen de la oferta */}
                                <div className="col-md-12">
                                    <label className="form-label">Imagen de la oferta</label>

                                    {/* Imagen actual */}
                                    <div className="mb-2 text-center">
                                        <p className="text-muted">Imagen actual:</p>
                                        <img
                                            src={ofertaEditada.fuenteImagen || "/images/oferta-generica.jpg"}
                                            alt="Imagen actual"
                                            className="border border-2"
                                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                        />
                                    </div>

                                    {/* Input para nueva imagen */}
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            setImagen(file);
                                            if (file) {
                                                setOfertaEditada({ ...ofertaEditada, nuevaImagen: file });
                                            }
                                        }}
                                    />


                                    {/* Preview de la nueva imagen */}
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
                                Guardar cambios
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
