// URL base: http://DOMINIO/comentarios

// Modulos
const router = require('express').Router(); // Permite definir rutas

const controller = require('../controllers/comentariosController.js');

// Defino las rutas de navegación del usuario
router.get  ( '/:id', controller.getComentarios );
router.post ('/',     controller.postAñadirComentario );

module.exports = router;