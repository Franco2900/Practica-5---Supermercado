// URL base: http://DOMINIO/favoritos

// Modulos
const router = require('express').Router(); // Permite definir rutas

// Defino las rutas de navegación del usuario
router.post  ( '/agregarFavorito', require('../controllers/favoritosController.js').postAgregarFavorito );
router.delete( '/quitarFavorito',  require('../controllers/favoritosController.js').deleteQuitarFavorito );
router.post  ( '/soloProductosFavoritos', require('../controllers/favoritosController.js').postSoloProductosFavoritos );


module.exports = router;