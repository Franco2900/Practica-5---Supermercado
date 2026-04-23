// URL base: http://DOMINIO/auth/register

// Modulos
const router = require('express').Router(); // Permite definir rutas

// Defino las rutas de navegación del usuario
router.post( '/', require('../controllers/registerController.js').postRegister );

module.exports = router;