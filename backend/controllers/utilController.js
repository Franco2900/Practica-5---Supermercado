// ================== VARIABLES DE ENTORNO ==================
require('dotenv').config();
const puerto  = process.env.PUERTO_BACKEND;
const dominio = process.env.DOMINIO_BACKEND;

// ================== FUNCIONES ÚTILES ==================
function logURL(metodo, ruta) {
    const ahora = new Date();
    const fechaHora = ahora.toLocaleString('es-AR', {
        weekday: 'long',   // día de la semana
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    console.log('***********************************************************');
    console.log(`URL actual: ${metodo} ${dominio}:${puerto}${ruta}`);
    console.log(`Fecha y hora: ${fechaHora}\n`);
}

module.exports = { 
    logURL,
};
