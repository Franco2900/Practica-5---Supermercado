// URL base: http://DOMINIO/auth/login

// Modulos
const router = require('express').Router(); // Permite definir rutas

// Defino las rutas de navegación del usuario
router.post( '/', require('../controllers/loginController.js').postLogin );

module.exports = router;