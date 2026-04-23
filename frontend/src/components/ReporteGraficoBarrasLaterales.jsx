// Para crear gráficos de barras
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend); // Registra los módulos necesarios de Chart.js

export default function ReporteGraficoBarras({ productos }) 
{
    // Configuración de datos para el gráfico de barras
    const data = {
        labels: productos.map((p) => p.nombre),
        datasets: [
        {
            label: "Ingresos Generados",
            data: productos.map((p) => p.ingresos_generados),
            backgroundColor: "rgba(54, 162, 235, 0.6)", // color base
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
        },
        ],
    };


    // Opciones del gráfico
    const options = {
        indexAxis: "y", // Esto hace que las barras sean horizontales
        responsive: true,
        plugins: {
            legend: {
                display: false, // Ocultamos la leyenda porque solo hay un dataset
            },
            tooltip: { // Personaliza el texto del tooltip para mostrar valor
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const porcentaje = ((value / total) * 100).toFixed(2);

                        // Formatea con separador de miles
                        const valorFormateado = value.toLocaleString("es-AR");

                        return `$${valorFormateado} (${porcentaje}%)`;
                    },
                },
            },
        },
        scales: {
            x: { // Eje horizontal, empieza en cero y muestra título.
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Ingresos Generados ($)",
                },
            },
            y: { // eje vertical, muestra los nombres de los productos.
                title: {
                    display: true,
                    text: "Productos",
                },
            },
        },
    };

    return (
        <div className="container mt-4">
        <h2 className="mb-4">Ingresos por Producto</h2>
        <Bar data={data} options={options} />
        </div>
    );
}
