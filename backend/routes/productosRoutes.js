// URL base: http://DOMINIO/productos

// Modulos
const router = require('express').Router(); // Permite definir rutas
const multer = require("multer"); // Para manejar la subidad de archivos
const path = require("path");     // Para manejar rutas de archivos

// Configuración de almacenamiento
const storage = multer.diskStorage({

    // Destino donde se guardo la imagen
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../frontend/public/images/productos")); 
    },

    // Nombre de la imagen
    filename:
    (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.originalname}`);  // Nombre único: timestamp + extensión original
    }

});

const upload = multer({ storage });

const controller = require('../controllers/productosController.js');

// Defino las rutas de navegación del usuario
router.get   ( '/',                          controller.getProductos );
router.post  ( '/', upload.single("imagen"), controller.postAgregarProducto );
router.post  ( '/productosMasFavoritos',     controller.postProductosMasFavoritos );
router.post  ( '/buscarSugerencias',         controller.postBusquedaSugerencias);
router.get   ( '/masVendidos',               controller.getMasVendidos);

router.get   ( '/:id',                          controller.getProductoDetalle );
router.delete( '/:id',                          controller.deleteProducto );
router.put   ( '/:id', upload.single("imagen"), controller.putProducto );

module.exports = router;