import "./Producto.css";

export default function ProductoHistorial({ producto }) {
  return (
    <div className="card shadow-sm mb-3" id={producto.id}>

      <div className="card-img-container">
        <img 
          className="card-img-top" 
          src={producto.fuenteImagen} 
          alt={producto.nombre} 
        />
      </div>

      <div className="card-body">
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text text-muted">{producto.descripcion}</p>

        <p className="card-text">
          <strong>Categoría:</strong> {producto.categoria}<br />
          <strong>Subcategoría:</strong> {producto.subcategoria}
        </p>

        <p><strong>Cantidad:</strong> {producto.cantidad}</p>

        {/* Oferta o producto individual */}
        {producto.oferta_id ? (
          <div className="alert alert-warning p-2">
            Oferta aplicada: <strong>{producto.oferta_nombre}</strong><br />
            Precio oferta: ${producto.precio_oferta.toLocaleString("es-AR")}
          </div>
        ) : (
          <>
            <p><strong>Precio unitario:</strong> ${producto.precio.toLocaleString("es-AR")}</p>
            <p><strong>Subtotal:</strong> ${(producto.precio * producto.cantidad).toLocaleString("es-AR")}</p>
            <p className="badge bg-secondary">Producto individual</p>
          </>
        )}
      </div>
    </div>
  );
}
