/*
Con React Router tenemos que usar un nuevo componente: <Link>

Diferencia entre <a> y <Link>

<a href="..."> (HTML clásico)

    Hace que el navegador recargue toda la página.
    Pierde el comportamiento de SPA (Single Page Application).
    Se vuelve más lento porque React tiene que volver a montar todo desde cero.

<Link to="..."> (React Router)

    Cambia la URL sin recargar la página.
    Mantiene el estado de la aplicación.
    Solo renderiza el componente correspondiente a la ruta.
    Es la forma recomendada para navegar dentro de una app React.
*/

import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { CarritoContext } from "../context/CarritoContext.jsx";
import { UsuarioContext } from "../context/UsuarioContext.jsx";

import { Link } from "react-router-dom";

import { buscarProductos } from "./Navbar.helpers.js";
import MostrarSugerenciasProductos from "./MostrarSugerenciasProductos.jsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags, faBoxOpen, faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() 
{
  const navigate = useNavigate();

  // Variables de contexto
  const { carrito } = useContext(CarritoContext); 
  const { usuario, logout } = useContext(UsuarioContext);

  const { query, setQuery, resultados } = buscarProductos();

  return (
    <nav className="navbar navbar-expand-lg bg-primary">
      <div className="container-fluid">

        {/* Marca del supermercado. También redirige a Home */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          Sol Ultra
          <img 
            src="/images/sol argentino.png" 
            alt="icono" 
            style={{ width: "48px", height: "48px", marginLeft: "4px" }} 
          />    
        </Link>

        {/* Botón hamburguesa. Pone todo acá en caso de que no alcance el ancho de pantalla */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido colapsable */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          
          {/* Menú de navegación */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            {/* Ofertas */}
            <li className="nav-item">
              <Link className="nav-link" to="/ofertas">
                <FontAwesomeIcon icon={faTags} className="me-2" />
                Ofertas
              </Link>
            </li>

            {/* Productos */}
            <li className="nav-item">
              <Link className="nav-link" to="/productos">
                <FontAwesomeIcon icon={faBoxOpen} className="me-2" />
                Productos
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contacto">
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                Contacto
              </Link>
            </li>
          </ul>

          {/* Buscador */}
          <form 
            className="d-flex mx-auto position-relative" 
            role="search" 
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="position-relative w-100">

              <input 
                className="form-control me-2" 
                type="search" 
                placeholder="Buscar producto" 
                aria-label="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: "400px" }}
              />

              <MostrarSugerenciasProductos resultados={resultados} />

            </div>
            
            <button className="btn btn-outline-dark" type="submit">Buscar</button>
            
          </form>

          {/* Login/Register o Usuario*/}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

            {usuario ? ( // Si tengo datos del usuario

              <li className="nav-item dropdown d-flex align-items-center">

                {/* Carrito */}
                <Link className="nav-link d-flex align-items-center" to="/carrito">
                  <i className="bi bi-cart me-2"></i> 
                  Carrito 
                  <span className="badge bg-danger rounded-pill ms-2">
                    {carrito.length}
                  </span>
                </Link>

                {/* Dinero del usuario */}
                <span className="me-3 d-flex align-items-center">
                  <i className="bi bi-currency-dollar me-2"></i>
                  {usuario.dinero_disponible.toLocaleString("es-AR")}
                </span>

                {/* Imagen de perfil del usuario */}
                <img 
                  src={usuario.fuente_imagen || "/images/perfil/perfil generico.jpg"} 
                  alt="Foto de perfil" 
                  className="rounded-circle me-2"
                  style={{ width: "35px", height: "35px", objectFit: "cover" }}
                />

                {/* Nombre del usuario */}
                <a 
                  className="nav-link dropdown-toggle" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  {usuario.nombre}
                </a>

                <ul className="dropdown-menu dropdown-menu-end">
                  
                  {/* Ver y editar datos personales */}
                  <li>
                    <Link className="dropdown-item" to="/perfil">
                      <i className="bi bi-person-circle me-2"></i>
                      Mi perfil
                    </Link>
                  </li>   
                  
                  {/* Historial de compras, estado de pedidos actuales. */}
                  <li>
                    <Link className="dropdown-item" to="/historial">
                      <i className="bi bi-bag-check me-2"></i>
                      Historial
                    </Link>
                  </li> 
                  
                  {/* Productos favoritos */}
                  <li>
                    <Link className="dropdown-item" to="/favoritos">
                      <i className="bi bi-heart me-2"></i>
                      Favoritos
                    </Link>
                  </li> 
                
            
                  <li><hr className="dropdown-divider" /></li>

                  {/* Opciones solo para admin */}
                  {usuario.rol === "Admin" && (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/gestionProductos">
                          <i className="bi bi-box-seam me-2"></i>
                          Gestión productos
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/gestionOfertas">
                          <i className="bi bi-gift me-2"></i>
                          Gestión ofertas
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/gestionUsuarios">
                          <i className="bi bi-people me-2"></i>
                          Gestión usuarios
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/reportes">
                          <i className="bi bi-bar-chart me-2"></i>
                          Reportes
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                    </>
                  )}
                  
                  <li>
                    <button 
                      type="button" 
                      className="dropdown-item bg-danger" 
                      onClick={() => {logout(); navigate("/");}}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar sesión
                    </button>
                  </li>

                </ul>
              </li>

            ) : ( // Si no tengo datos del usuario

              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>

            )}
          </ul>

        </div>
      </div>
    </nav>
  );
}
