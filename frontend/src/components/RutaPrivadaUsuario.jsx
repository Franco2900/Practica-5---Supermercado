import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext.jsx";

export default function RutaPrivadaUsuario({ children }) {
  const { usuario } = useContext(UsuarioContext);

  // Si no hay usuario logueado, redirige al login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario logueado (sin importar rol), renderiza el contenido
  return children;
}
