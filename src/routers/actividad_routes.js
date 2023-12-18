// Importación de la función router por parte de express
import {Router} from 'express'
// Inicialización la función en la variable router
const router = Router()
// Importación para la protección de rutas
import verificarAutenticacion from '../middlewares/autenticacion.js'

import {
    renderAllActividades,
    registrarActividad,
    visualizarActividad,
    actualizarActividad,
    eliminarActividad
} from "../controllers/actividad_controller.js"

router.get('/actividades',verificarAutenticacion,renderAllActividades);
router.post('/actividad/registro',verificarAutenticacion,registrarActividad);
router.get('/actividad/:id',verificarAutenticacion,visualizarActividad);
router.put('/actividad/actualizar/:id',verificarAutenticacion,actualizarActividad);
router.delete('/actividad/eliminar/:id',verificarAutenticacion,eliminarActividad);

export default router
