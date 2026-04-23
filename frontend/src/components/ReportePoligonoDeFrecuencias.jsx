import { useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin);

export default function ReportePoligonoDeFrecuencias({ ingresos }) 
{
    const chartRef = useRef(null);

    const labels = ingresos.map((i) => `${i.anio}-${String(i.mes).padStart(2, "0")}`); // Genera etiquetas tipo "2024-01", "2024-02", etc.
    const valores = ingresos.map((i) => Number(i.ingresos_mes)); // Convierte los ingresos mensuales (que vienen como string) a números

    // Defino los datos a graficar
    const data = {
        labels,
        datasets: [
            {
                label: "Ingresos Totales por Mes",
                data: valores,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: false,
                tension: 0.3, // suaviza la línea
            },
        ],
    };


    // Opciones del gráfico
    const options = {
        responsive: true,
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true, // zoom con la rueda del mouse
                    },
                    pinch: {
                        enabled: true, // zoom con gestos táctiles
                    },
                    mode: "x", // podés usar "x", "y" o "xy"
                },
                pan: {
                    enabled: true,
                    mode: "x", // desplazamiento horizontal
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        return `$${value.toLocaleString("es-AR")}`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: "Ingresos ($)" },
                ticks: {
                    callback: (value) => `$${value.toLocaleString("es-AR")}`,
                },
            },
            x: {
                title: { display: true, text: "Meses" },
            },
        },
    };


    return (
        <div className="container mt-4">
            <h2 className="mb-4">Ingresos Totales por Mes</h2>
            
            <button 
                onClick={() => chartRef.current.resetZoom()} // Reinicia el zoom del grafico
                style={{
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginBottom: "15px",
                    fontWeight: "bold"
                }}
            >
                Reset Zoom
            </button>

            <Line ref={chartRef} data={data} options={options} />
        </div>
    );
}
