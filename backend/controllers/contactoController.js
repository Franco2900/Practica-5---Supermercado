// Metodos importados de 'util.js'
const { logURL } = require('./utilController.js');

const nodemailer = require('nodemailer'); // Modulo para enviar emails

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


async function postEnviarEmail(req, res) 
{
    logURL(`POST`, `/contacto`);

    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    const { nombre, email, mensaje } = req.body;
    
    // En caso de que no lleguen todos los datos
    if (!nombre || !email || !mensaje) return res.status(400).json({ mensaje: "Faltan datos" });

    try 
    {
        // Mensaje a enviar
        const htmlBody = `
            <p>
                Este es un mensaje de consulta enviado por ${nombre} - ${email}<br>
                Mensaje: <br>
                ${mensaje}
                <br></br>

                Mensaje automatico. Por favor, no responder.
            </p>
        `;

        // Envio un correo con la consulta del usuario
        await transporter.sendMail({
            from: { name: 'Supermercado Sol Ultra', address: emailEmisorio },
            to: `${emailEmisorio}`,                      // Email (o emails - separados por coma) del destinatario
            subject: `Consulta de ${nombre}`, // Asunto del correo
            html: htmlBody                               // Versión en HTML del cuerpo. Permite etiquetas, estilos y formatos enriquecidos.
        });

        
        return res.status(201).json({ mensaje: "Su consulta fue enviada correctamente" });
    } 
    catch (error) 
    {
        console.error(error); 
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
}


module.exports = { 
    postEnviarEmail
};