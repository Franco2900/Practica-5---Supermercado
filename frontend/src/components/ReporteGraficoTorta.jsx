import { useEffect, useState } from 'react';

// Para crear graficos de torta
import { Pie } from "react-chartjs-2"; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"; 

ChartJS.register(ArcElement, Tooltip, Legend); // Registra los módulos necesarios de Chart.js

export default function ReporteGraficoTorta({productos, tamanio}) 
{
    // Función para generar colores aleatorios en formato hex
    function generarColores(cantidad) 
    {
        const colores = [];
        
        for (let i = 0; i < cantidad; i++) {
            const color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
            colores.push(color);
        }
        
        return colores;
    }


    // Configuración de datos para el gráfico de torta
    const data = {
        labels: productos.map((p) => p.nombre),
        datasets: [
        {
            label: "Ingresos Generados",
            data: productos.map((p) => p.ingresos_generados),
            backgroundColor: generarColores(productos.length),
            borderColor: "#fff",
            borderWidth: 2,
        },
        ],
    };

    // Opciones del gráfico
    const options = {
        responsive: true, // El gráfico se adapta al tamaño del contenedor
        plugins: {
            legend: {
                position: "bottom", // La leyenda aparece abajo.
            },
            tooltip: { // Personaliza el texto del tooltip para mostrar valor y porcentajes
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const porcentaje = ((value / total) * 100).toFixed(2);

                        // Formatea el número con separador de miles
                        const valorFormateado = value.toLocaleString("es-AR");

                        return `${context.label}: $${valorFormateado} (${porcentaje}%)`;
                    },
                },
            },
        },
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Distribución de Ingresos (Top 5 Productos)</h2>

            <div style={{ width: `${tamanio}%`, margin: "0 auto" }}>
                <Pie data={data} options={options} />
            </div>
        </div>
    );
};