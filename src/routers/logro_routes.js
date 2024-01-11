// Importación de la función router por parte de express
import { Router } from 'express'
// Inicialización la función en la variable router
const router = Router()
// Importación para la protección de rutas
import verificarAutenticacion from '../middlewares/autenticacion.js'

import {
    CrearInsignia,
    VisualizarLogro
} from "../controllers/logro_controller.js"

router.post('/insignia/registro', verificarAutenticacion, CrearInsignia);
router.get('/insignias',verificarAutenticacion, VisualizarLogro);

export default router