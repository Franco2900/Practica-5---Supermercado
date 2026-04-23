// ================== MÓDULOS Y DEPENDENCIAS ==================
const express      = require('express');      // Modulo para la navegación web y creación del servidor
const bodyParser   = require('body-parser');  // Modulo para parsear los cuerpos de las solicitudes HTTP
const cors         = require('cors');         // Modulo para permitir las solicitudes desde otro origen

// ================== CONFIGURACIÓN DE LA APP ==================
const app = express(); // Inicialización de la aplicación Express

// Variables de entorno
require('dotenv').config(); // Carga las variables del archivo .env en process.env
const puerto  = process.env.PUERTO_BACKEND;
const dominio = process.env.DOMINIO_BACKEND;


console.log(process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);
    
// ================== MIDDLEWARES GLOBALES ================== 
// Los middlewares en Express son funciones que se ejecutan antes de que una solicitud 
// llegue a una ruta específica. Estos se aplican a **todas** las solicitudes de la aplicación

app.use(bodyParser.urlencoded({ extended: true })); // Permite parsear formularios
app.use(express.json());                            // Permite parsear JSON

// Habilita CORS para todas las rutas 
app.use(cors({ 
    origin: "http://localhost:5173", // indico que puede recibir solicitudes de mi app frontend 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true 
}));

// ================== MIDDLEWARES PARA RUTAS ESPECÍFICAS ==================
// Algunos middlewares solo se aplican a ciertas rutas, permitiendo modificar 
// su comportamiento sin afectar a toda la aplicación. 

// ================== RUTAS DE NAVEGACIÓN DEL USUARIO ==================
app.use('/auth/register', require('./routes/registerRoutes.js') )
app.use('/auth/login',    require('./routes/loginRoutes.js') );
app.use('/auth/recuperarContrasenia', require('./routes/recuperarContraseniaRoutes.js') );

app.use('/contacto',     require('./routes/contactoRoutes.js') );
app.use('/productos',    require('./routes/productosRoutes.js') );
app.use('/favoritos',    require('./routes/favoritosRoutes.js') );
app.use('/carrito',      require('./routes/carritoRoutes.js') );
app.use('/historial',    require('./routes/historialRoutes.js') );
app.use('/ofertas',      require('./routes/ofertasRoutes.js') );
app.use('/usuario',      require('./routes/usuarioRoutes.js') )
app.use('/comentarios',  require('./routes/comentariosRoutes') );
app.use('/valoraciones', require('./routes/valoracionesRoutes'));
app.use('/reportes',     require('./routes/reportesRoutes.js') );

// ================== INICIO DEL SERVIDOR ==================
const servidor = app.listen(puerto, () => {

    console.info(`Aplicación iniciada en el puerto: ${puerto}`);
    console.info(`Servidor corriendo en el dominio: ${dominio}`);
});

module.exports = app;