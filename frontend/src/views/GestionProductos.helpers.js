import { toast } from "react-toastify";

const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

// Guardar cambios de edición
export async function guardarEdicion(producto, setProductos, setProductoEditando, productos, cerrar = true) 
{
    try 
    {
        if (!cerrar) {
            // Solo actualizar estado local mientras escribe
            setProductoEditando(producto);
            return;
        }

        const formData = new FormData();

        formData.append("nombre", producto.nombre);
        formData.append("descripcion", producto.descripcion);
        formData.append("precio", producto.precio);
        formData.append("categoria", producto.categoria);
        formData.append("subcategoria", producto.subcategoria);

        if (producto.nuevaImagen) formData.append("imagen", producto.nuevaImagen);
        else                      formData.append("fuenteImagen", producto.fuenteImagen || "");
        

        const res = await fetch(`${dominioBackend}:${puertoBackend}/productos/${producto.id}`, {
            method: "PUT",
            body: formData
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.mensaje || "Error en la petición");
        }

        const data = await res.json();
        console.group(data)
        
        toast.success("Producto actualizado correctamente", { position: "bottom-right", autoClose: 4000 });

        setProductos(productos.map(p => (p.id === data.id ? data : p)));
        setProductoEditando(null);
    } 
    catch (err) 
    {
        console.error("Error al editar producto:", err);
        toast.error(err.message, { position: "bottom-right", autoClose: 4000 });
    }
}


// Eliminar producto
export async function eliminarProducto(id, setProductos, productos) 
{
    try 
    {
        const res = await fetch(`${dominioBackend}:${puertoBackend}/productos/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.mensaje || "Error en la petición");
        }

        toast.success("Producto eliminado correctamente", { position: "bottom-right", autoClose: 4000 });
        setProductos(productos.filter(p => p.id !== id));
    } 
    catch (err) 
    {
        console.error("Error eliminando producto:", err);
        toast.error(err.message, { position: "bottom-right", autoClose: 4000 });
    }
}


// Alta de producto
export async function altaProducto(nuevoProducto, setProductos, productos, resetForm, onClose) 
{
    try 
    {
        const formData = new FormData();

        formData.append("nombre", nuevoProducto.nombre);
        formData.append("descripcion", nuevoProducto.descripcion);
        formData.append("precio", nuevoProducto.precio);
        formData.append("categoria", nuevoProducto.categoria);
        formData.append("subcategoria", nuevoProducto.subcategoria);

        // Imagen obligatoria
        if (nuevoProducto.nuevaImagen) formData.append("imagen", nuevoProducto.nuevaImagen);
        else                           throw new Error("Debe seleccionar una imagen para el producto");
        
        // Envio los datos al backend
        const res = await fetch(`${dominioBackend}:${puertoBackend}/productos`, {
            method: "POST",
            body: formData
        });

        // Respuesta del backend
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.mensaje || "Error en la petición");
        }

        const data = await res.json();
        toast.success("Producto agregado correctamente", { position: "bottom-right", autoClose: 4000 });

        setProductos([...productos, data]);
        resetForm(); // Limpia formulario en el modal
        onClose();   // Cierra modal
    } 
    catch (err) 
    {
        console.error("Error agregando producto:", err);
        toast.error(err.message, { position: "bottom-right", autoClose: 4000 });
    }
}
