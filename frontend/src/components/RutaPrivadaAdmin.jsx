import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext.jsx";

export default function RutaPrivadaAdmin({ children }) 
{
  const { usuario } = useContext(UsuarioContext);

  // Si no hay usuario logueado o no es admin, redirige
  if (!usuario || usuario.rol !== "Admin") {
    return <Navigate to="/" replace />;
  }

  // Si es admin, renderiza el contenido
  return children;
}
