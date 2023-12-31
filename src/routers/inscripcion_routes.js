// Importación de la función router por parte de express
import { Router } from 'express'
// Inicialización la función en la variable router
const router = Router()
// Importación para la protección de rutas
import verificarAutenticacion from '../middlewares/autenticacion.js'

import {
    InscripcionRegistro,
    RenderAllInscripcion
} from "../controllers/inscripcion_controller.js"

router.post('/inscripcion/registro/:ninoId/:actividadId', verificarAutenticacion, InscripcionRegistro);
router.get('/inscripciones/:ninoid',verificarAutenticacion, RenderAllInscripcion);

export default router