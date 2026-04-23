import Hero from "../components/Hero"
import OfertasHorizontales from "../components/OfertasHorizontales"
import ProductosDestacados from "../components/ProductosDestacados"

export default function Home()
{
    return (
      <>
      <Hero 
      textoPrincipal = "Tu supermercado de confianza. Productos frescos, ofertas únicas y la mejor atención cada día."
      textoSecundario='-Sol Ultra' 
      />

      <OfertasHorizontales/>
      <ProductosDestacados />
      </>
    )
}