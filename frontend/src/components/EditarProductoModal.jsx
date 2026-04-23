import { useState, useEffect } from "react";

export default function EditarProductoModal({ producto, productos, onClose, onSave }) 
{
    if (!producto) return null;

    const [imagen, setImagen] = useState(null);

    // Estado local para categoría y subcategoría seleccionadas
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(producto.categoria || "");
    const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(producto.subcategoria || "");

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
        onSave({ ...producto, categoria: categoriaSeleccionada, subcategoria: subcategoriaSeleccionada }, false);
    }, [categoriaSeleccionada, subcategoriaSeleccionada]);


    return (
        <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg">
            <div className="modal-content border border-dark">
            <form onSubmit={(e) => { e.preventDefault(); onSave(producto); }}>
                
                <div className="modal-header">
                <h5 className="modal-title">Editar producto</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
                </div>

                <div className="modal-body">
                <div className="row g-3">
                    
                    
                    <div className="col-md-6">
                    <label className="form-label"><strong>Nombre</strong></label>
                    <input
                        type="text"
                        className="form-control"
                        value={producto.nombre} /* Cargo los inputs con los datos ya existentes del producto */
                        onChange={(e) => onSave({ ...producto, nombre: e.target.value }, false)} /* Cada vez que hay un cambio en el input, ejecuta la función contenida en el onSave */
                        required
                    />
                    </div>

                    <div className="col-md-6">
                    <label className="form-label"><strong>Descripción</strong></label>
                    <input
                        type="text"
                        className="form-control"
                        value={producto.descripcion}
                        onChange={(e) => onSave({ ...producto, descripcion: e.target.value }, false)}
                    />
                    </div>

                    <div className="col-md-4">
                    <label className="form-label"><strong>Precio</strong></label>
                    <input
                        type="number"
                        className="form-control"
                        value={producto.precio}
                        onChange={(e) => onSave({ ...producto, precio: e.target.value }, false)}
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

                    {/* Imagen actual */}
                    <div className="mb-2 text-center">
                        <p className="text-muted">Imagen actual:</p>
                        <img
                        src={producto.fuenteImagen || "/images/producto-generico.jpg"}
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
                            // Actualizo el producto con la nueva imagen (puede ser enviada al backend con FormData)
                            onSave({ ...producto, nuevaImagen: file }, false);
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
