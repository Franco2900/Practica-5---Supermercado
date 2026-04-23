import "./Carrusel.css";

export default function Carrusel() 
{
  return (
    <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
      
      <div className="carousel-inner">

        {/* Slide 1: Frutas */}
        <div className="carousel-item active">
          <div
            className="hero-slide"
            style={{ backgroundImage: "url('/images/frutas.jpg')" }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1 className="display-3 fw-bold">Frutas Frescas</h1>
              <p className="lead">Color, sabor y salud</p>
              {/*<a href="#frutas" className="btn btn-light btn-lg mt-3">Ver frutas</a>*/}
            </div>
          </div>
        </div>


        {/* Slide 2: Limpieza */}
        <div className="carousel-item">
          <div
            className="hero-slide"
            style={{ backgroundImage: "url('/images/limpieza.jpg')" }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1 className="display-3 fw-bold">Limpieza</h1>
              <p className="lead">Todo para tu hogar</p>
              {/*<a href="#limpieza" className="btn btn-light btn-lg mt-3">Ver productos</a>*/}
            </div>
          </div>
        </div>


        {/* Slide 3: Ropa */}
        <div className="carousel-item">
          <div
            className="hero-slide"
            style={{ backgroundImage: "url('/images/ropa.jfif')" }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1 className="display-3 fw-bold">Ropa</h1>
              <p className="lead">Moda y comodidad</p>
              {/*<a href="#ropa" className="btn btn-light btn-lg mt-3">Ver ropa</a>*/}
            </div>
          </div>
        </div>

      </div>

      {/* Botones de navegación */}
      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>

    </div>
  );
};