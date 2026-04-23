import { useEffect, useState } from 'react';

import ReporteTopProductos           from "../components/ReporteTopProductos";
import ReporteTodosLosProductos      from "../components/ReporteTodosLosProductos";
import ReporteGraficoTorta           from "../components/ReporteGraficoTorta"
import ReporteGraficoBarrasLaterales from '../components/ReporteGraficoBarrasLaterales';
import ReportePoligonoDeFrecuencias  from "../components/ReportePoligonoDeFrecuencias"

const puertoBackend  = import.meta.env.VITE_PUERTO_BACKEND;
const dominioBackend = import.meta.env.VITE_DOMINIO_BACKEND;

export default function Reportes() 
{
    const [productosMasVendidos, setProductosMasVendidos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [ingresos, setIngresos] = useState([]);

    useEffect(() => {
    
        //  Para obtener los productos más vendidos
        fetch(`${dominioBackend}:${puertoBackend}/reportes/top5`)
        .then(res => {
            if (!res.ok) throw new Error("Error al obtener el top 5 de más vendidos");
            return res.json();
        })
        .then(data => {
            console.log(data)
            setProductosMasVendidos(data)
        })
        .catch(err => console.error(err));


        // Para obtener todos los productos
        fetch(`${dominioBackend}:${puertoBackend}/reportes/productos`)
        .then(res => {
            if (!res.ok) throw new Error("Error al obtener todos los productos");
            return res.json();
        })
        .then(data => setProductos(data))
        .catch(err => console.error(err));


        // Para obtener los ingresos de todos los productos ordenados por mes y año
        fetch(`${dominioBackend}:${puertoBackend}/reportes/ingresos`)
        .then(res => {
            if (!res.ok) throw new Error("Error al obtener todos los ingresos");
            return res.json();
        })
        .then(data => setIngresos(data))
        .catch(err => console.error(err));

    }, []);


    return (
        <>
            <ReporteTopProductos productos={productosMasVendidos} />
            <ReporteGraficoTorta productos={productosMasVendidos} tamanio={50} />

            <ReporteTodosLosProductos productos={productos} />
            <ReporteGraficoBarrasLaterales productos={productos} />

            <ReportePoligonoDeFrecuencias ingresos={ingresos} />
        </>
    );
};