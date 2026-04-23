// URL base: http://DOMINIO/ofertas

// Modulos
const router = require('express').Router(); // Permite definir rutas
const controller = require('../controllers/ofertasController.js');


const multer = require("multer"); // Para manejar la subidad de archivos
const path = require("path");     // Para manejar rutas de archivos

// Configuración de almacenamiento
const storage = multer.diskStorage({

    // Destino donde se guardo la imagen
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../frontend/public/images/ofertas")); 
    },

    // Nombre de la imagen
    filename:
    (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.originalname}`);  // Nombre único: timestamp + extensión original
    }

});

const upload = multer({ storage });


// Defino las rutas de navegación del usuario
router.get ( '/soloActivas',   controller.getOfertasActivas );
router.get ( '/todas',         controller.getTodasLasOfertas);

router.get ( '/:id/productos', controller.getProductosDeLaOferta);
router.put ( '/:id/productos', controller.putProductosDeLaOferta);

router.post  ( '/', upload.single("imagen"), controller.postCrearOferta );

router.post ( '/agregarOfertaAlCarrito',  controller.postAgregarOfertaAlCarrito);

router.get   ( '/:id',                          controller.getOfertaDetalle );
router.delete( '/:id',                          controller.deleteOferta );
router.put   ( '/:id', upload.single("imagen"), controller.putOferta );

module.exports = router;