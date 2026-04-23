import "./Hero.css";

export default function Hero( {textoPrincipal, textoSecundario} ) 
{
  return (
    <div
      className="hero"
      style={{ backgroundImage: "url('/images/hero.png')" }}
    >
      {/* Filtro oscuro */}
      <div className="hero-overlay"></div>

      {/* Contenido */}
      <div className="hero-content">
        <h1 className="display-3 fw-bold"> {textoPrincipal} </h1>
        <p className="lead"> {textoSecundario} </p>
      </div>
    </div>
  );
}
