// Metodos importados de 'util.js'
const { logURL } = require('./utilController.js');

const { existeUsuario, registrarUsuarioNuevo } = require('../models/registerModel.js');

async function postRegister(req, res) 
{
    logURL(`POST`, `/auth/register`);

    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    const { nombre, email, password } = req.body;
    
    try 
    {
        const existe = await existeUsuario(nombre, email); 
        if (existe) return res.status(409).json({ mensaje: "El usuario ya existe" });

        const nuevoUsuario = await registrarUsuarioNuevo(nombre, email, password);
        
        return res.status(201).json({
            mensaje: "Usuario registrado exitosamente", 
            usuario: { id: nuevoUsuario.insertId, nombre, email } 
        });
    
    } 
    catch (error) 
    {
        console.error(error); 
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
}

module.exports = { postRegister };