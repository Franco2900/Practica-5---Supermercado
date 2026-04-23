import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Modulo para decodificar el token JWT

// Las variables de estado son locales, solo pueden ser usadas por el componente que las creo
// Las variables de contexto son globales, pueden ser usadas por todos los componentess

export const UsuarioContext = createContext();

export function UsuarioProvider({ children }) 
{
  const [usuario, setUsuario] = useState(() => { // Las variables de contexto funcionan igual que las variables de estado
    
    const usuarioAlmacenado = localStorage.getItem("usuario");       // Leo el usuario que tengo guardado localmente
    return usuarioAlmacenado ? JSON.parse(usuarioAlmacenado) : null; // Si tengo un usuario guardado, arranco con ese
  });

  // localStorage es mejor que sessionStorage
  // localStorage guarda la sesión entre pestañas
  // sessionStorage solo guarda la sesión en una sola pestaña 

  useEffect(() => {

    const token = localStorage.getItem("token"); // Leo token de localStorage 

    if (token && !usuario) 
    {
      try 
      {
        const tokenDecodificado = jwtDecode(token); // Decodifico el token y obtengo sus datos
        setUsuario(tokenDecodificado); // Actualizo el usuario
        localStorage.setItem("usuario", JSON.stringify(tokenDecodificado)); // Guardo el objeto usuario en memoria local
      } 
      catch (error) 
      {
        console.error("Token inválido:", error);
      }
    }

  }, []); // Se ejecuta al montar el componente

  function login(token) 
  {
    localStorage.setItem("token", token);

    const tokenDecodificado = jwtDecode(token); 
    setUsuario(tokenDecodificado);
    localStorage.setItem("usuario", JSON.stringify(tokenDecodificado)); 
  }

  function logout() 
  {
    localStorage.removeItem("token");   // Elimino el token
    localStorage.removeItem("usuario"); // Elimino el usuario
    setUsuario(null);                   // Actualizo el estado
  }

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuario, login, logout }}>
      {children}
    </UsuarioContext.Provider>
  );
}
