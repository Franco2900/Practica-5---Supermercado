import { toast } from "react-toastify";

const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

export async function handleSaveOferta(ofertaEditada, cerrar, ofertas, setOfertas, setOfertaSeleccionada) 
{
    try 
    {
        const formData = new FormData();
        formData.append("nombre",          ofertaEditada.nombre);
        formData.append("descripcion",     ofertaEditada.descripcion || "");
        formData.append("precio_original", ofertaEditada.precio_original);
        formData.append("precio_oferta",   ofertaEditada.precio_oferta);
        formData.append("fecha_inicio",    ofertaEditada.fecha_inicio || "");
        formData.append("fecha_fin",       ofertaEditada.fecha_fin || "");

        if (ofertaEditada.nuevaImagen) {
            formData.append("imagen", ofertaEditada.nuevaImagen);
            if (ofertaEditada.fuenteImagen) {
                formData.append("imagenVieja", ofertaEditada.fuenteImagen);
            }
        }

        const res = await fetch(`${dominioBackend}:${puertoBackend}/ofertas/${ofertaEditada.id}`, {
            method: "PUT",
            body: formData
        });
        if (!res.ok) throw new Error("Error al actualizar la oferta");
        const ofertaActualizada = await res.json();

        const resProd = await fetch(`${dominioBackend}:${puertoBackend}/ofertas/${ofertaEditada.id}/productos`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                (ofertaEditada.productosDeLaOferta || []).map(p => ({
                    producto_id: p.id || p.producto_id,
                    cantidad:    p.cantidad || 1
                }))
            )
        });
        if (!resProd.ok) throw new Error("Error al actualizar productos de la oferta");

        setOfertas(ofertas.map((o) => o.id === ofertaActualizada.id ? ofertaActualizada : o));
        if (cerrar) setOfertaSeleccionada(null);

        toast.success(`Oferta "${ofertaActualizada.nombre}" actualizada correctamente`);
    } 
    catch (err) 
    {
        console.error(err);
        toast.error("Error al actualizar la oferta");
    }
}

export async function handleEliminar(id, nombre, ofertas, setOfertas) 
{
    try 
    {
        const seguro = window.confirm(`¿Estás seguro de que querés eliminar la oferta: ${nombre} ?`);
        if (!seguro) return;

        const res = await fetch(`${dominioBackend}:${puertoBackend}/ofertas/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });
        if (!res.ok) throw new Error("Error al eliminar la oferta");

        setOfertas(ofertas.filter((o) => o.id !== id));
        toast.success(`Oferta "${nombre}" eliminada correctamente`);
    } 
    catch (err) 
    {
        console.error(err);
        toast.error("Error al eliminar la oferta");
    }
}

export async function handleCreateOferta(nuevaOferta, ofertas, setOfertas, setCrearOfertaVisible) 
{
    try 
    {
        const formData = new FormData();
        formData.append("nombre",          nuevaOferta.nombre);
        formData.append("descripcion",     nuevaOferta.descripcion || "");
        formData.append("precio_original", nuevaOferta.precio_original);
        formData.append("precio_oferta",   nuevaOferta.precio_oferta);
        formData.append("fecha_inicio",    nuevaOferta.fecha_inicio || "");
        formData.append("fecha_fin",       nuevaOferta.fecha_fin || "");

        if (nuevaOferta.nuevaImagen) {
            formData.append("imagen", nuevaOferta.nuevaImagen);
        }

        const res = await fetch(`${dominioBackend}:${puertoBackend}/ofertas`, {
            method: "POST",
            body: formData
        });
        if (!res.ok) throw new Error("Error al crear la oferta");
        const ofertaCreada = await res.json();

        const resProd = await fetch(`${dominioBackend}:${puertoBackend}/ofertas/${ofertaCreada.id}/productos`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                (nuevaOferta.productosDeLaOferta || []).map(p => ({
                    producto_id: p.id || p.producto_id,
                    cantidad:    p.cantidad || 1
                }))
            )
        });
        if (!resProd.ok) throw new Error("Error al asociar productos a la oferta");

        setOfertas([...ofertas, ofertaCreada]);
        setCrearOfertaVisible(false);
        toast.success(`Oferta "${ofertaCreada.nombre}" creada correctamente`);
    } 
    catch (err) 
    {
        console.error(err);
        toast.error("Error al crear la oferta");
    }
}
