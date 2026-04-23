export default function MostrarSugerenciasUsuarios({ usuarios, onSelect, limpiarBusqueda }) {
  if (!usuarios || usuarios.length === 0) return null;

  return (
    <ul 
      className="list-group position-absolute shadow-sm" 
      style={{ 
        top: "100%",   
        left: 0, 
        width: "100%", 
        zIndex: 1050 
      }}
    >
      {usuarios.map(user => (
        <li 
          key={user.id} 
          className="list-group-item d-flex align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => {
            onSelect(user.id)
            limpiarBusqueda("");
        }}
        >

            <img 
              src={user.fuente_imagen || "/default-avatar.png"} 
              alt={user.nombre} 
              style={{ 
                width: "35px", 
                height: "35px", 
                objectFit: "cover", 
                marginRight: "10px", 
                borderRadius: "50%" 
              }}
            />
            <span className="fw-bold">{user.nombre}</span>

        </li>
      ))}
    </ul>
  );
}
