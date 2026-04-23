// URL base: http://DOMINIO/reportes

// Modulos
const router = require('express').Router(); // Permite definir rutas

const controller = require('../controllers/reportesController.js');

// Defino las rutas de navegación del usuario
router.get( '/top5',      controller.getTop5Productos );
router.get( '/productos', controller.getProductos);
router.get( '/ingresos',  controller.getIngresos);

module.exports = router;