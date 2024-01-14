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

/**
 * @swagger
 * tags:
 *   name: Progreso
 *   description: API para gestionar progreso de Niño
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProgresoDatosRegistro:
 *       type: object
 *       required:
 *         - Puntuacion
 *         - Completado
 *       properties:
 *         Puntuacion:
 *           type: integer
 *           description: Puntuación obtenida en la actividad
 *         Completado:
 *           type: integer
 *           description: Número de veces completada la actividad
 *       example:
 *         Puntuacion: 100
 *         Completado: 3
 */

/**
 * @swagger
 * /api/progreso/registro/{ActividadId}:
 *   post:
 *     summary: Registrar progreso de una actividad para un niño
 *     tags: [Progreso]
 *     parameters:
 *       - name: ActividadId
 *         in: path
 *         description: ID de la actividad
 *         required: true
 *         schema:
 *           type: string
 *           example: 659f56ea027b10d5fb47b581
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProgresoDatosRegistro'
 *     responses:
 *       200:
 *         description: Progreso registrado exitosamente
 *       400:
 *         description: Campos vacíos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Id no es válido
 *       422:
 *         description: Validaciones fallidas; sintaxis incorrecta
 *       500:
 *         description: Error del servidor
 */

router.post('/progreso/registro/:ActividadId', verificarAutenticacion, ProgresoRegistro);

/**
 * @swagger
 * /api/progreso/{actividadID}:
 *   get:
 *     summary: Obtener progreso de una actividad para un niño
 *     tags: [Progreso]
 *     parameters:
 *       - name: actividadID
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
 *         description: Progreso obtenido exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Actividad no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/progreso/:actividadID',verificarAutenticacion, VisualizarProgreso);

export default router