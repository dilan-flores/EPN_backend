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

/**
 * @swagger
 * tags:
 *   name: Insignia
 *   description: API para gestionar los logros de Niño
 */

/**
 * @swagger
 * /api/insignia/registro:
 *   post:
 *     summary: Registrar un logro para un niño autenticado
 *     tags: [Insignia]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Insignia registrada exitosamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post('/insignia/registro', verificarAutenticacion, CrearInsignia);

/**
 * @swagger
 * /api/insignias:
 *   get:
 *     summary: Visualizar logros del Niño
 *     tags: [Insignia]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de logros del Niño
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/insignias',verificarAutenticacion, VisualizarLogro);

export default router