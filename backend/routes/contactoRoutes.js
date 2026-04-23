// URL base: http://DOMINIO/contacto

// Modulos
const router = require('express').Router(); // Permite definir rutas

const controller = require('../controllers/contactoController.js');

// Defino las rutas de navegación del usuario
router.post ('/', controller.postEnviarEmail );

module.exports = router;