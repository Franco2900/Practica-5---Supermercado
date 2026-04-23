const conexionDB = require('../../conexionDB.js');
const { chequearExistenciaTablaSimple } = require('./loadUtils.js');

async function cargaDatosDePruebaTablaOfertas()
{
    console.log('Cargando datos de prueba a la tabla ofertas');

    const ofertas = [
        { nombre: 'Desayuno Saludable',   descripcion: 'Combo de Pan Integral + Leche Entera + Café Molido',                              fuenteImagen: '/images/ofertas/desayuno saludable.avif',       precio_original: 4950,       precio_oferta: 4300,        fecha_inicio: '2026-03-01 00:00:00',        fecha_fin: '2026-04-31 23:59:59',   activo: 1,      cantidad_vendido: 0,    ingresos_generados: 0 },
        { nombre: 'Picada de Campo',      descripcion: 'Combo de Queso Cremoso + Vino Tinto Malbec + Pan Integral',                       fuenteImagen: '/images/ofertas/picada campo.jfif',             precio_original: 8500,       precio_oferta: 7500,        fecha_inicio: '2026-03-01 00:00:00',        fecha_fin: '2026-05-25 23:59:59',   activo: 1,      cantidad_vendido: 0,    ingresos_generados: 0 },
        { nombre: 'Limpieza Total',       descripcion: 'Combo de Detergente Líquido + Lavandina + Limpiador Multiuso',                    fuenteImagen: '/images/ofertas/limpieza total.webp',           precio_original: 3000,       precio_oferta: 2500,        fecha_inicio: '2026-03-01 00:00:00',        fecha_fin: '2026-06-20 23:59:59',   activo: 1,      cantidad_vendido: 0,    ingresos_generados: 0 },
        { nombre: 'Outfit Urbano',        descripcion: 'Combo de Remera Algodón + Pantalón Jeans + Zapatillas Deportivas',                fuenteImagen: '/images/ofertas/outfit urbano.webp',            precio_original: 23200,      precio_oferta: 21000,       fecha_inicio: '2026-03-01 00:00:00',        fecha_fin: '2026-07-03 23:59:59',   activo: 1,      cantidad_vendido: 0,    ingresos_generados: 0 },
        { nombre: 'Dúo Refrescante',      descripcion: 'Combo de Agua Mineral + Jugo de Naranja',                                         fuenteImagen: '/images/ofertas/duo refrescante.jfif',          precio_original: 1800,       precio_oferta: 1500,        fecha_inicio: '2026-03-01 00:00:00',        fecha_fin: '2026-08-15 23:59:59',   activo: 1,      cantidad_vendido: 0,    ingresos_generados: 0 },
        { nombre: 'Pareja Dulce',         descripcion: 'Combo de Miel Orgánica + Galletitas de Avena',                                    fuenteImagen: '/images/ofertas/pareja dulce.webp',             precio_original: 3700,       precio_oferta: 3300,        fecha_inicio: '2026-03-01 00:00:00',        fecha_fin: '2026-09-17 23:59:59',   activo: 1,      cantidad_vendido: 0,    ingresos_generados: 0 },
        { nombre: 'Pack Limpieza Hogar',  descripcion: 'Combo de Detergente Líquido + Lavandina + Jabón en Polvo + Limpiador Multiuso',   fuenteImagen: '/images/ofertas/pack limpieza hogar.jpg',       precio_original: 5300,       precio_oferta: 4600,        fecha_inicio: '2026-03-01 00:00:00',        fecha_fin: '2026-10-08 23:59:59',   activo: 1,      cantidad_vendido: 0,    ingresos_generados: 0 },
        { nombre: 'Combo Fitness',        descripcion: 'Combo de Zapatillas Deportivas + Pelota de Fútbol + Agua Mineral + Té Verde',     fuenteImagen: '/images/ofertas/combo fitness.webp',            precio_original: 21200,      precio_oferta: 19500,       fecha_inicio: '2026-03-01 00:00:00',        fecha_fin: '2026-12-31 23:59:59',   activo: 1,      cantidad_vendido: 0,    ingresos_generados: 0 }
    ];

    for (const oferta of ofertas) {
        await cargarOferta(oferta);
    }

    console.log('Datos completamente cargados en la tabla ofertas');
}


async function cargarOferta(oferta)
{
    var existeOferta = await chequearExistenciaTablaSimple('ofertas', 'nombre', oferta.nombre);

    if(existeOferta) console.log('ERROR: Ya existe la oferta ' + oferta.nombre);
    else
    {
        try
        {
            await conexionDB.query('INSERT INTO ofertas SET ?', oferta);
            console.log('Se hizo el alta de la oferta: ' + oferta.nombre);
        }
        catch(error) {console.log(error);}
    }
}

module.exports = { cargaDatosDePruebaTablaOfertas };