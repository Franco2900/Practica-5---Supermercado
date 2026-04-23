// URL base: http://DOMINIO/carrito

// Modulos
const router = require('express').Router(); // Permite definir rutas

// Defino las rutas de navegación del usuario
router.post   ( '/agregarProducto',  require('../controllers/carritoController.js').postAgregarProducto );
router.post   ( '/obtenerCarrito', require('../controllers/carritoController.js').postObtenerCarrito );
router.post   ( '/comprarCarrito',   require('../controllers/carritoController.js').postComprarCarrito );

router.put    ( '/modificarCantidad', require('../controllers/carritoController.js').putModificarCantidadEnCarrito );

router.delete ( '/quitarProducto',   require('../controllers/carritoController.js').deleteQuitarProducto );
router.delete ( '/quitarTodosLosProductos', require('../controllers/carritoController.js').deleteQuitarTodosLosProductos );

module.exports = router;