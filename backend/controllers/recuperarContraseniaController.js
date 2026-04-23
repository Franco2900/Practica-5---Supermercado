// Metodos importados de 'util.js'
const { logURL } = require('./utilController.js');

const { existeEmail, actualizarContraseña } = require('../models/recuperarContraseniaModel.js');

const nodemailer = require('nodemailer'); // Modulo para enviar emails
const jwt = require("jsonwebtoken"); // Modulo para crear los tokens de sesión

// Variables de entorno
require('dotenv').config(); // Carga las variables del archivo .env en process.env
const emailEmisorio = process.env.EMAIL_EMISORIO;
const passwordEmail = process.env.PASSWORD_EMAIL;

// Configuración del SMTP (Simple Mail Transfer Protocol), protocolo usado para enviar los emails.
let transporter = nodemailer.createTransport({

    host: 'smtp.gmail.com', // Dirección del servidor SMTP de Gmail que recibe y procesa el envio
    port: 587,              // Puerto TCP en el que el servidor SMTP de Gmail escucha peticiones
    secure: false,          // Indico si la conexión esta cifrada
    auth: {                 // Datos de autentificación de la cuenta de email desde el que se envia el correo
        user: emailEmisorio,
        pass: passwordEmail
    }

});

async function postSolicitudRecuperarContraseña(req, res) 
{
    logURL(`POST`, `/auth/recuperarContrasenia`);

    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    const { email } = req.body;
    
    try 
    {
        // Verifico si el email existe
        const existe = await existeEmail(email); 
        if (!existe) return res.status(409).json({ mensaje: "No existe el email del que se quiere recuperar la contraseña" });


        // Genera token temporal
        const token = jwt.sign(
            { email }, 
            process.env.JWT_SECRET, 
            { expiresIn: "20m" }
        );

        // Link al que ingresa el usuario para cambiar la contraseña
        const resetLink = `http://localhost:5173/recuperarContrasenia?token=${token}`;

        // Mensaje a enviar
        const htmlBody = `
            <p>
                Este es un mensaje enviado por Supermercado Sol Ultra. <br>
                Para recuperar su contraseña ingrese en el siguiente enlace: <br>
                <a href="${resetLink}">Recuperar contraseña</a> <br>
                
                <br></br>
                
                Nuestra información de contacto: <br>
                Email: emailFalso123@gmail.com <br>
                Télefono fijo: 1111-2222 <br>
                Whatsapp: 11-2222-3333

                <br></br>

                Mensaje automatico. Por favor, no responder.
            </p>
        `;

        // Si el email existe, envio un correo para que el usuario recupere su contraseña
        transporter.sendMail({
            from: { name: 'Supermercado Sol Ultra', address: emailEmisorio },
            to: `${email}`,                  // Email (o emails - separados por coma) del destinatario
            subject: 'Recuperar contraseña', // Asunto del correo
            html: htmlBody                   // Versión en HTML del cuerpo. Permite etiquetas, estilos y formatos enriquecidos.
        });

        
        return res.status(201).json({
            mensaje: "Verifique su correo electronico",  
        });
    } 
    catch (error) 
    {
        console.error(error); 
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
}



async function getCambiarContraseña(req, res) 
{
    const { token } = req.query;

    try 
    {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ mensaje: "Token válido", email: decoded.email });
    } 
    catch (error) 
    {
        return res.status(400).json({ mensaje: "Token inválido o expirado" });
    }
}


async function postCambiarContraseña(req, res) 
{
    const { token, nuevaContraseña } = req.body;

    try 
    {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        // Actualizo la contraseña en la base de datos
        await actualizarContraseña(email, nuevaContraseña);

        return res.status(200).json({ mensaje: "Contraseña actualizada correctamente" });
    } 
    catch (error) 
    {
        return res.status(400).json({ mensaje: "Token inválido o expirado" });
    }
}



module.exports = { 
    postSolicitudRecuperarContraseña, 
    getCambiarContraseña,
    postCambiarContraseña 
};