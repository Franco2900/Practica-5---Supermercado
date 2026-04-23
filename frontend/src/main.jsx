import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";

import { CarritoProvider } from "./context/CarritoContext.jsx";
import { UsuarioProvider } from "./context/UsuarioContext.jsx";

import App from './App.jsx'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

// Bootstrap Icons
import "bootstrap-icons/font/bootstrap-icons.css";

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

// Cargo todos los íconos sólidos
library.add(fas);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      
      <UsuarioProvider>
      <CarritoProvider>
        <App />
      </CarritoProvider>
      </UsuarioProvider>
    
    </BrowserRouter>
  </StrictMode>
)

/*
StrictMode:
Es una herramienta de desarrollo que viene con React. Sirve para detectar problemas potenciales en tu 
código, como prácticas inseguras o efectos secundarios inesperados. En modo desarrollo, puede renderizar 
los componentes dos veces para ayudarte a encontrar errores ocultos. Importante: no afecta en producción, 
es decir, cuando tu aplicación está publicada, StrictMode no cambia nada.

BrowserRouter:
Es parte de React Router, y su función es manejar la navegación entre páginas dentro de tu aplicación. 
Permite que tu sitio sea una SPA (Single Page Application), donde el usuario puede moverse entre distintas 
vistas (ejemplo: /productos, /ofertas, /contacto) sin que el navegador recargue toda la página. 
Internamente usa la History API del navegador para cambiar la URL y mostrar el componente correspondiente.

CarritoProvider:
Pasa las variables de contexto de forma global a todos los componentes
*/