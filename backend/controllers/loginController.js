// Metodos importados de 'util.js'
const { logURL } = require('./utilController.js');

const { iniciarSesion } = require('../models/loginModel.js');
const { obtenerCarritoActualId, obtenerProductosDelCarritoActual } = require('../models/carritoModel.js');

const jwt = require("jsonwebtoken"); // Modulo para crear los tokens de sesión

// Variables de entorno
require('dotenv').config(); // Carga las variables del archivo .env en process.env

async function postLogin(req, res) 
{
    logURL(`POST`, `/auth/login`);

    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    const { nombreXemail, password } = req.body;

    try 
    {
        const usuario = await iniciarSesion(nombreXemail, password);

        // Usuario no encontrado
        if (!usuario) return res.status(401).json({ mensaje: "Usuario o contraseña inválidos" });

        // Usuario encontrado
        // Genero token JWT
        const token = jwt.sign( 
            {   
                id:                usuario.id, 
                nombre:            usuario.nombre, 
                email:             usuario.email, 
                dinero_disponible: usuario.dinero_disponible,
                //dinero_gastado:    usuario.dinero_gastado, // Dato que el usuario no necesita ver. Es para estadistica
                puntos_canje:      usuario.puntos_canje,
                fuente_imagen:     usuario.fuente_imagen,
                telefono:          usuario.telefono,
                direccion:         usuario.direccion,
                fecha_creacion:    usuario.fecha_creacion,
                //fecha_ultimo_login: usuario.fecha_ultimo_login, // Dato que el usuario no necesita ver. Es para estadistica
                rol:               usuario.rol
            }, 
            process.env.JWT_SECRET, // Clave secreta en el .env 
            { expiresIn: "1h" } // Duración del token 
        );

        // Obtengo el id del carrito actual
        const carrito_id  = await obtenerCarritoActualId(usuario.id);
        // Obtengo los productos del carrito
        const productos   = await obtenerProductosDelCarritoActual(carrito_id);

        // Respuesta del backend al frontend
        return res.status(200).json({
            mensaje: "Login exitoso",
            token,
            productos
        });
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
}


module.exports = { postLogin };