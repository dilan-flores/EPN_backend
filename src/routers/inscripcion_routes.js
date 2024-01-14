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
/**
 * @swagger
 * tags:
 *   name: Inscripcion
 *   description: API para gestionar Incripciones
 */

/**
 * @swagger
 * /api/inscripcion/registro/{ninoId}/{actividadId}:
 *   post:
 *     summary: Registro de inscripción
 *     tags: [Inscripcion]
 *     parameters:
 *       - name: ninoId
 *         in: path
 *         description: ID del niño
 *         required: true
 *         schema:
 *           type: string
 *           example: 659f56ea027b10d5fb47b581
 *       - name: actividadId
 *         in: path
 *         description: ID de la actividad
 *         required: true
 *         schema:
 *           type: string
 *           example: 659f56ea027b10d5fb47b581
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inscripción registrada exitosamente
 *       400:
 *         description: Campos vacíos o formato incorrecto
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Niño o actividad no encontrados
 *       500:
 *         description: Error del servidor
 */
router.post('/inscripcion/registro/:ninoId/:actividadId', verificarAutenticacion, InscripcionRegistro);

/**
 * @swagger
 * /api/inscripciones/{ninoid}:
 *   get:
 *     summary: Obtener todas las inscripciones de un niño
 *     tags: [Inscripcion]
 *     parameters:
 *       - name: ninoid
 *         in: path
 *         description: ID del niño
 *         required: true
 *         schema:
 *           type: string
 *           example: 659f56ea027b10d5fb47b581
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de inscripciones obtenida exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Inscripcion no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/inscripciones/:ninoid',verificarAutenticacion, RenderAllInscripcion);

export default router