import { useState } from "react";

export default function BarraBusqueda({ productos, onFiltrar }) 
{
    // Variables de estado para guardar lo que elige el usuario
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState("");

    // Extraer categorías únicas
    const categorias = [...new Set(productos.map(p => p.categoria))]; // Crea un array con todas las categorías de los productos y elimina duplicados

    // Extraer subcategorías según la categoría elegida
    const subcategorias = categoriaSeleccionada
        ? [...new Set(productos // Crea un array nuevo y elimina los duplicados
            .filter(p => p.categoria === categoriaSeleccionada) // Filtra los productos que pertenecen a esa categoría
            .map(p => p.subcategoria))] // Extrae sus subcategorías.
        : [];

    function buscarConFiltro()
    {
        let filtrados = productos;

        // Si hay categoría seleccionada, filtra por esa categoría.
        if (categoriaSeleccionada)    filtrados = filtrados.filter(p => p.categoria === categoriaSeleccionada);
        // Si además hay subcategoría seleccionada, filtra por esa subcategoría.
        if (subcategoriaSeleccionada) filtrados = filtrados.filter(p => p.subcategoria === subcategoriaSeleccionada);

        onFiltrar(filtrados); // Actualizo el estado de los productos filtrados
    };


    function limpiarFiltro() 
    {
        setCategoriaSeleccionada("");
        setSubcategoriaSeleccionada("");
        onFiltrar(productos); // vuelve a mostrar todos los productos
    };

    return (
        <div className="barra-busqueda d-flex gap-3 mb-4">

            {/* Categorías */}
            <select
                className="form-select"
                value={categoriaSeleccionada}
                onChange={(e) => {
                setCategoriaSeleccionada(e.target.value);
                setSubcategoriaSeleccionada(""); // reset subcategoría
                }}
            >
                <option value="">Todas las categorías</option>
                {categorias.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
                ))}
            </select>

            {/* Subcategorías (solo si hay categoría elegida) */}
            <select
                className="form-select"
                value={subcategoriaSeleccionada}
                onChange={(e) => setSubcategoriaSeleccionada(e.target.value)}
                disabled={!categoriaSeleccionada}
            >
                <option value="">Todas las subcategorías</option>
                {subcategorias.map((sub, i) => (
                <option key={i} value={sub}>{sub}</option>
                ))}
            </select>

            <button className="btn btn-primary" onClick={buscarConFiltro}>
                Buscar
            </button>

            <button className="btn btn-secondary" onClick={limpiarFiltro}>
                Limpiar filtros
            </button>

        </div>
    );
}
