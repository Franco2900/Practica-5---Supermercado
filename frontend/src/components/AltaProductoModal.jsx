import { useState, useEffect } from "react";

export default function AltaProductoModal({ productos, onClose, onSave }) 
{
    // Estado local del producto nuevo
    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "",
        subcategoria: "",
        fuenteImagen: "",
        nuevaImagen: null,
    });

    const [imagen, setImagen] = useState(null);

    // Para vaciar los campos del modal
    const resetForm = () => {

        setNuevoProducto({
            nombre: "",
            descripcion: "",
            precio: "",
            categoria: "",
            subcategoria: "",
            fuenteImagen: "",
            nuevaImagen: null
        });

        setImagen(null);
    };


    // Estado local para categoría y subcategoría seleccionadas
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState("");

    // Extraer categorías únicas
    const categorias = [...new Set(productos.map(p => p.categoria))];

    // Extraer subcategorías según la categoría elegida
    const subcategorias = categoriaSeleccionada
        ? [...new Set(productos
            .filter(p => p.categoria === categoriaSeleccionada)
            .map(p => p.subcategoria))]
        : [];

    // Actualizar producto cuando cambian categoría o subcategoría
    useEffect(() => {
        setNuevoProducto(prev => ({
            ...prev,
            categoria: categoriaSeleccionada,
            subcategoria: subcategoriaSeleccionada
        }));
    }, [categoriaSeleccionada, subcategoriaSeleccionada]);

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content border border-dark">
                    <form onSubmit={(e) => { e.preventDefault(); onSave(nuevoProducto, resetForm); }}>
                        
                        <div className="modal-header">
                            <h5 className="modal-title">Alta de producto</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>

                        <div className="modal-body">
                            <div className="row g-3">
                                
                                <div className="col-md-6">
                                    <label className="form-label"><strong>Nombre</strong></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={nuevoProducto.nombre}
                                        onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label"><strong>Descripción</strong></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={nuevoProducto.descripcion}
                                        onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label"><strong>Precio</strong></label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={nuevoProducto.precio}
                                        onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label"><strong>Categoría</strong></label>
                                    <select
                                        className="form-select"
                                        value={categoriaSeleccionada}
                                        onChange={(e) => {
                                            setCategoriaSeleccionada(e.target.value);
                                            setSubcategoriaSeleccionada(""); // reset subcategoría
                                        }}
                                    >
                                        <option value="">Seleccione categoría</option>
                                        {categorias.map((cat, i) => (
                                            <option key={i} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label"><strong>Subcategoría</strong></label>
                                    <select
                                        className="form-select"
                                        value={subcategoriaSeleccionada}
                                        onChange={(e) => setSubcategoriaSeleccionada(e.target.value)}
                                        disabled={!categoriaSeleccionada}
                                    >
                                        <option value="">Seleccione subcategoría</option>
                                        {subcategorias.map((sub, i) => (
                                            <option key={i} value={sub}>{sub}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-12">
                                    <label className="form-label">Imagen del producto</label>

                                    {/* Imagen por defecto */}
                                    <div className="mb-2 text-center">
                                        <p className="text-muted">Imagen actual:</p>
                                        <img
                                            src={nuevoProducto.fuenteImagen || "/images/producto-generico.jpg"}
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
                                                setNuevoProducto({ ...nuevoProducto, nuevaImagen: file });
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
                                Crear producto
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
