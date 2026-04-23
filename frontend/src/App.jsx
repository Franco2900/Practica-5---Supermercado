import Navbar                        from "./components/Navbar.jsx"
import Home                          from "./views/Home.jsx"
import Contacto                      from "./views/Contacto.jsx";
import Login                         from "./views/Login.jsx";
import Register                      from "./views/Register.jsx";
import Carrito                       from "./views/Carrito.jsx";
import Favoritos                     from "./views/Favoritos.jsx";
import HistorialCompras              from "./views/HistorialCompras.jsx";
import ListadoOfertas                from "./views/ListadoOfertas.jsx";
import OfertaDetalle                 from "./views/OfertaDetalle.jsx";
import PerfilUsuario                 from "./views/PerfilUsuario.jsx";
import SolicitudRecuperarContrasenia from "./views/SolicitudRecuperarContrasenia.jsx";
import RecuperarContrasenia          from "./views/RecuperarContrasenia.jsx"
import ListadoProductos              from "./views/ListadoProductos.jsx";
import ProductoDetalle               from "./views/ProductoDetalle.jsx";
import GestionProductos              from "./views/GestionProductos.jsx";
import GestionOfertas                from "./views/GestionOfertas.jsx"
import GestionUsuarios               from "./views/GestionUsuarios.jsx";
import Reportes                      from "./views/Reportes.jsx";

import RutaPrivadaAdmin   from "./components/RutaPrivadaAdmin.jsx";
import RutaPrivadaUsuario from "./components/RutaPrivadaUsuario.jsx";

import { Routes, Route } from "react-router-dom"

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';;

import { useContext, useEffect } from "react";
import { UsuarioContext } from "./context/UsuarioContext.jsx";


const rutasProtegidasUsuario = [
  { path: "/carrito",   element: <Carrito /> },
  { path: "/favoritos", element: <Favoritos /> },
  { path: "/historial", element: <HistorialCompras /> },
  { path: "/perfil",    element: <PerfilUsuario /> },
];

const rutasProtegidasAdmin = [
  { path: "/gestionProductos", element: <GestionProductos /> },
  { path: "/gestionOfertas",   element: <GestionOfertas /> },
  { path: "/gestionUsuarios",  element: <GestionUsuarios /> },
  { path: "/reportes",         element: <Reportes /> }
];


export default function App() 
{ 
  // Variables de contexto 
  const { login } = useContext(UsuarioContext);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Si quedo en la memoria del navegador el token de usuario
    if (token)  login(token); // Vuelve a cargar el token de usuario en el contexto
  }, []);


  return (
    <>
      <Navbar />
      
      <Routes>
        
        {/* Rutas públicas */}
        <Route path="/"              element={<Home />} />
        <Route path="/ofertas"       element={<ListadoOfertas />} />
        <Route path="/ofertas/:id"   element={<OfertaDetalle />} />
        <Route path="/productos"     element={<ListadoProductos />} />
        <Route path="/productos/:id" element={<ProductoDetalle />} />
        <Route path="/contacto"      element={<Contacto />} />

        <Route path="/login"                          element={<Login />} />
        <Route path="/register"                       element={<Register />} />
        <Route path="/solicitudRecuperarContrasenia"  element={<SolicitudRecuperarContrasenia />} />
        <Route path="/recuperarContrasenia"           element={<RecuperarContrasenia />} />

        {/* Rutas protegidas para cualquier usuario logueado */}
        {rutasProtegidasUsuario.map((ruta) => (
          <Route
            path={ruta.path}
            element={<RutaPrivadaUsuario>{ruta.element}</RutaPrivadaUsuario>}
          />
        ))}
        

        {/* Rutas protegidas solo para admin */}
        {rutasProtegidasAdmin.map((ruta) => (
          <Route
            path={ruta.path}
            element={<RutaPrivadaAdmin>{ruta.element}</RutaPrivadaAdmin>}
          />
        ))}

      </Routes>

      <ToastContainer position="bottom-right" autoClose={4000}  />
    </>
  )
}

/*
<Routes>: es un contenedor que agrupa todas las rutas de tu aplicación.

<Route>: define una ruta específica, con dos partes:
  path="/"           → la URL que el usuario escribe o a la que navega.
  element={<Home />} → el componente que se renderiza cuando la URL coincide.

Si el usuario entra a http://localhost:5173/, verá el componente Home.
Si entra a http://localhost:5173/productos, verá el componente Productos.
Y así con las demás rutas.

Cuando cambia la URL, React Router decide qué componente mostrar.
El cambio de vista ocurre sin recargar toda la página (SPA).
El usuario solo percibe que “navega” entre páginas, pero en realidad React está montando
y desmontando componentes según la ruta.
*/