import VistaProductos from "../components/VistaProductos";
import ListadoProductosUsuarioLogueado from "../components/ListadoProductosUsuarioLogueado.jsx";

export default function Favoritos() {
  const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
  const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

  return (
    <VistaProductos
      endpoint={`${dominioBackend}:${puertoBackend}/favoritos/soloProductosFavoritos`}
      ComponenteProducto={ListadoProductosUsuarioLogueado}
    />
  );
}
 