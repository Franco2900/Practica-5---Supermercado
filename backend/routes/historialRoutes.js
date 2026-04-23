// URL base: http://DOMINIO/historial

// Modulos
const router = require('express').Router(); // Permite definir rutas

// Defino las rutas de navegación del usuario
router.post( '/',                  require('../controllers/historialController.js').postObtenerHistorial );
router.post( '/busquedaConFiltro', require('../controllers/historialController.js').postBusquedaConFiltro );

module.exports = router;