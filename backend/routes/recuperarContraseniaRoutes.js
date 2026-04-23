// URL base: http://DOMINIO/auth/recuperarContrasenia

// Modulos
const router = require('express').Router(); // Permite definir rutas
const controller = require('../controllers/recuperarContraseniaController.js');

// Defino las rutas de navegación del usuario
router.post( '/',        controller.postSolicitudRecuperarContraseña ); 
router.get ( '/',        controller.getCambiarContraseña); 
router.post( '/cambiar', controller.postCambiarContraseña);


module.exports = router;