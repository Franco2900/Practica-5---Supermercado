const conexionDB = require('../../conexionDB.js');
const { chequearExistenciaTablaSimple } = require('./loadUtils.js');

async function cargaDatosDePruebaTablaUsuarios()
{
    console.log('Cargando datos de prueba a la tabla usuarios');

    const usuarios = [
        { nombre: 'franco',             email: 'franco2900@gmail.com',          password: '$2b$08$.YBs99SrVWWPt1VEVBrHc.4YLQFqT88kWlrN8IPqGfcX./72cgVu6',    dinero_disponible: 35000,      dinero_gastado: 0,          puntos_canje: 0,        fuente_imagen: '/images/perfil/medieval knight.jpg',         telefono: '11-2222-3333',      direccion: 'Calle Siempre Viva 4787',       fecha_creacion: '2026-03-01 00:00:00',      fecha_ultimo_login: null,                       rol: 'Admin' },
        { nombre: 'María López',        email: 'maria.admin@gmail.com',         password: '$2b$08$abc12345hashEjemploAdmin',                                 dinero_disponible: 50000,      dinero_gastado: 1200,       puntos_canje: 200,      fuente_imagen: '/images/perfil/perfil generico.jpg',         telefono: '11-3333-4444',      direccion: 'Av. Rivadavia 1234',            fecha_creacion: '2026-03-05 10:30:00',      fecha_ultimo_login: '2026-03-29 18:00:00',      rol: 'Admin' },
        { nombre: 'Carlos Pérez',       email: 'carlos.admin@gmail.com',        password: '$2b$08$xyz67890hashEjemploAdmin',                                 dinero_disponible: 45000,      dinero_gastado: 5000,       puntos_canje: 350,      fuente_imagen: '/images/perfil/perfil generico.jpg',         telefono: '11-5555-6666',      direccion: 'San Martín 890',                fecha_creacion: '2026-03-07 09:15:00',      fecha_ultimo_login: null,                       rol: 'Admin' },
        { nombre: 'Lucía Fernández',    email: 'lucia.cliente@gmail.com',       password: '$2b$08$hashCliente123',                                           dinero_disponible: 12000,      dinero_gastado: 800,        puntos_canje: 50,       fuente_imagen: '/images/perfil/perfil generico.jpg',         telefono: '11-7777-8888',      direccion: 'Belgrano 456',                  fecha_creacion: '2026-03-10 14:20:00',      fecha_ultimo_login: '2026-03-28 20:00:00',      rol: 'Cliente' },
        { nombre: 'Javier Gómez',       email: 'javier.cliente@gmail.com',      password: '$2b$08$hashCliente456',                                           dinero_disponible: 8000,       dinero_gastado: 1500,       puntos_canje: 30,       fuente_imagen: '/images/perfil/perfil generico.jpg',         telefono: '11-9999-0000',      direccion: 'Mitre 321',                     fecha_creacion: '2026-03-12 16:45:00',      fecha_ultimo_login: null,                       rol: 'Cliente' },
        { nombre: 'Sofía Martínez',     email: 'sofia.cliente@gmail.com',       password: '$2b$08$hashCliente789',                                           dinero_disponible: 15000,      dinero_gastado: 2500,       puntos_canje: 75,       fuente_imagen: '/images/perfil/perfil generico.jpg',         telefono: '11-1212-3434',      direccion: 'Dorrego 678',                   fecha_creacion: '2026-03-15 11:00:00',      fecha_ultimo_login: '2026-03-29 09:00:00',      rol: 'Cliente' }
    ];

    for (const usuario of usuarios) {
        await cargarUsuario(usuario);
    }

    console.log('Datos completamente cargados en la tabla usuarios');
}


async function cargarUsuario(usuario)
{
    var existeUsuario = await chequearExistenciaTablaSimple('usuarios', 'email', usuario.email);

    if(existeUsuario) console.log('ERROR: Ya existe el usuario ' + usuario.email);
    else
    {
        try
        {
            await conexionDB.query('INSERT INTO usuarios SET ?', usuario);
            console.log('Se hizo el alta del usuario: ' + usuario.nombre);
        }
        catch(error) {console.log(error);}
    }
}

module.exports = { cargaDatosDePruebaTablaUsuarios };