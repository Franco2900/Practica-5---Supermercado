// Metodos importados de 'util.js'
const { logURL } = require('./utilController.js');

const 
{ 
    actualizarDatos,
    verificarNombre,
    traerUsuario,
    buscarUsuariosPorNombre,
    cambiarRol
} 
= require('../models/usuarioModel.js');

const jwt = require("jsonwebtoken"); // Modulo para crear los tokens de sesión

async function putActualizarDatos(req, res)
{
    logURL(`PUT`, `/usuario/`);

    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    const { usuario_id, nombre, telefono, direccion } = req.body;

    const fuente_imagen = req.file 
    ? `/images/perfil/${req.file.filename}` 
    : null;

    // En caso de que no lleguen todos los datos
    if ( !usuario_id || !nombre || !telefono || !direccion ) return res.status(400).json({ mensaje: "Faltan datos" });

    try
    {
        // Chequeo que el nuevo nombre no este reservado por otro usuario 
        const nombreEstaReservado = await verificarNombre(usuario_id, nombre);

        // Cambio el nombre del usuario si no esta reservado
        if(!nombreEstaReservado) await actualizarDatos(usuario_id, nombre,  telefono, direccion, fuente_imagen);
        else                     return res.status(400).json({ mensaje: "Nombre ya reservado" });

        // Consigo los datos actualizados del usuario
        const usuario = await traerUsuario(usuario_id);

        // Genero nuevo token
        const token = jwt.sign(
        {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            dinero_disponible: usuario.dinero_disponible,
            puntos_canje: usuario.puntos_canje,
            fuente_imagen: usuario.fuente_imagen,
            telefono: usuario.telefono,
            direccion: usuario.direccion,
            fecha_creacion: usuario.fecha_creacion,
            rol: usuario.rol
        },
        process.env.JWT_SECRET, // Clave secreta en el .env
        { expiresIn: "1h" }     // Duración del token 
        );

        // Respuesta del backend al frontend
        return res.json({ mensaje: "Datos actualizados", usuario, token });
    }
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
}


async function postBuscarSugerenciasUsuarios(req, res) 
{
    logURL(`POST`, `/usuarios/buscarSugerencias`);

    console.log("Datos ingresados por el usuario:", req.body);

    const { consulta } = req.body;

    if (!consulta || consulta.length < 3) {
        return res.status(400).json({ mensaje: "La búsqueda debe tener al menos 3 caracteres" });
    }

    try 
    {
        const usuarios = await buscarUsuariosPorNombre(consulta);

        return res.status(200).json(usuarios);
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
}


async function getUsuarioPorId(req, res) 
{
    logURL(`GET`, `/usuarios/:id`);

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ mensaje: "Falta el id del usuario" });
    }

    try 
    {
        const usuario = await traerUsuario(id);

        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        return res.status(200).json(usuario);
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
}


async function postCambiarRol(req, res) 
{
    logURL(`POST`, `/usuario/cambiarRol`);

    const { usuario_id } = req.body;

    if (!usuario_id) {
        return res.status(400).json({ mensaje: "Falta el id del usuario" });
    }

    try {
        // Traigo el usuario actual
        const usuario = await traerUsuario(usuario_id);

        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        // Determino el nuevo rol (solo alterna entre Admin y Cliente)
        let nuevoRol;
        if      (usuario.rol === "Admin")   nuevoRol = "Cliente";
        else if (usuario.rol === "Cliente") nuevoRol = "Admin";

        // Actualizo en la base de datos
        await cambiarRol(usuario_id, nuevoRol);

        // Devuelvo respuesta
        return res.status(200).json({ 
            mensaje: `Rol cambiado a ${nuevoRol}`, 
            nuevoRol 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
}

module.exports = { 
    putActualizarDatos,
    postBuscarSugerenciasUsuarios,
    getUsuarioPorId,
    postCambiarRol
};