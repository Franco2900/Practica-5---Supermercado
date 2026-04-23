// URL base: http://DOMINIO/valoracioens

// Modulos
const router = require('express').Router(); // Permite definir rutas

const controller = require('../controllers/valoracionesController.js');

// Defino las rutas de navegación del usuario
router.post ( '/valoracionDelUsuario', controller.postValoracionDelUsuario );
router.post ( '/',                     controller.postAñadirValoracion );

module.exports = router;