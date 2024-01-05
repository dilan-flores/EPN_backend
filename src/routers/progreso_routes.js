// Importación de la función router por parte de express
import { Router } from 'express'
// Inicialización la función en la variable router
const router = Router()
// Importación para la protección de rutas
import verificarAutenticacion from '../middlewares/autenticacion.js'

import {
    ProgresoRegistro,
    VisualizarProgreso
} from "../controllers/progreso_controller.js"

router.post('/progreso/registro/:ActividadId', verificarAutenticacion, ProgresoRegistro);
router.get('/progreso/:actividadID',verificarAutenticacion, VisualizarProgreso);

export default router