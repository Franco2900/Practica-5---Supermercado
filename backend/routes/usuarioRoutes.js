// URL base: http://DOMINIO/usuario/

// Modulos
const router = require('express').Router(); // Permite definir rutas
const multer = require("multer"); // Para manejar la subidad de archivos
const path = require("path");     // Para manejar rutas de archivos

// Configuración de almacenamiento
const storage = multer.diskStorage({

    // Destino donde se guardo la imagen
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../frontend/public/images/perfil")); 
    },

    // Nombre de la imagen
    filename:
    (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.originalname}`);  // Nombre único: timestamp + extensión original
    }

});

const upload = multer({ storage });

const controller = require('../controllers/usuarioController.js');

// Defino las rutas de navegación del usuario
router.post("/buscarSugerencias",         controller.postBuscarSugerenciasUsuarios);
router.post("/:id",                       controller.postCambiarRol);

router.put ("/", upload.single("imagen"), controller.putActualizarDatos);

router.get ("/:id",                       controller.getUsuarioPorId);

module.exports = router;