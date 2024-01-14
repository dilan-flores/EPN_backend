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

/**
 * @swagger
 * tags:
 *   name: Actividades
 *   description: API para gestionar actividades
 */

/**
 * @swagger
 * /api/actividades:
 *   get:
 *     summary: Visualizar actividades
 *     tags: [Actividades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Visualización de actividades registradas
 *       401:
 *         description: Usuario no autorizado
 *       500:
 *         description: Error de servidor
 */
router.get('/actividades',verificarAutenticacion,renderAllActividades);

/**
 * @swagger
 * components:
 *   schemas:
 *     ActividadesDatosRegistro:
 *       type: object
 *       required:
 *         - Nombre_act
 *         - Detalle_act
 *         - Nivel_dificultad
 *         - Recurso_video
 *         - Recurso_ejercicio
 *       properties:
 *         Nombre_act:
 *           type: string
 *           description: Nombre de la actividad
 *         Detalle_act:
 *           type: string
 *           description: Detalle de la actividad
 *         Nivel_dificultad:
 *           type: string
 *           description: Nivel de dificultad (Alta, Media, Baja)
 *         Recurso_video:
 *           type: string
 *           description: Recurso de video asociado a la actividad
 *         Recurso_ejercicio:
 *           type: object
 *           description: Recurso asociado al ejercicio de la actividad
 *       example:
 *         Nombre_act: "Puzzle"
 *         Detalle_act: "Rompecabezas de números"
 *         Nivel_dificultad: "Baja"
 *         Recurso_video: "https://www.youtube.com/watch?v=H14uumkORzQ"
 *         Recurso_ejercicio:
 *           Imagen_rompecabeza: "https://torange.biz/photofxnew/20/HD/de-imagen-perfil-fondo-halloween-con-la-luna-20101.jpg"
 */
/**
 * @swagger
 * /api/actividad/registro:
 *   post:
 *     summary: Registro de actividad
 *     tags: [Actividades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActividadesDatosRegistro'
 *     responses:
 *       200:
 *         description: Actividad registrada exitosamente
 *       400:
 *         description: Problemas en el endpoint
 *       401:
 *         description: No autorizado
 *       422:
 *         description: Validaciones fallidas; sintaxis incorrecta
 *       500:
 *         description: Error del servidor
 */
router.post('/actividad/registro',verificarAutenticacion,registrarActividad);

/**
 * @swagger
 * /api/actividad/{id}:
 *   get:
 *     summary: Visualizar actividad
 *     tags: [Actividades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id de la actividad
 *         schema:
 *           type: string
 *           example: 659f56ea027b10d5fb47b581
 *     responses:
 *       200:
 *         description: Visualización de actividad
 *       404:
 *         description: Id no válido; Usuario no encontrado
 *       500:
 *         description: Error de servidor
 */
router.get('/actividad/:id',verificarAutenticacion,visualizarActividad);

/**
 * @swagger
 * components:
 *   schemas:
 *     ActividadesDatosActualizar:
 *       type: object
 *       required:
 *         - Nombre_act
 *         - Detalle_act
 *         - Nivel_dificultad
 *         - Recurso_video
 *       properties:
 *         Nombre_act:
 *           type: string
 *           description: Nuevo nombre de la actividad
 *         Detalle_act:
 *           type: Date
 *           description: Nuevo detalle de la actividad
 *         Nivel_dificultad:
 *           type: string
 *           description: Nuevo nivel de dficultad
 *         Recurso_video:
 *           type: string
 *           description: Nuevo video de actividad
 *       example:
 *         Nombre_act: "Rompecabezas"
 *         Detalle_act: "Rompecabezas de números"
 *         Nivel_dificultad: "Media"
 *         Recurso_video: "https://www.youtube.com/watch?v=H14uumkORzQ"
 */
/**
 * @swagger
 * /api/actividad/actualizar/{id}:
 *   put:
 *     summary: Actualizar campos necesarios de actividades
 *     tags: [Actividades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de actividad
 *         schema:
 *           type: string
 *           example: 659f56ea027b10d5fb47b581
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActividadesDatosActualizar'
 *     responses:
 *       200:
 *         description: Actualización de actividad exitoso
 *       400:
 *         description: Campos vacíos o solicitud mal formada
 *       401:
 *         description: Usuario no autorizado
 *       404:
 *         description: Id no válido; Usuario no encontrado
 *       422:
 *         description: Validaciones fallidas, sintaxis incorrecta
 *       500:
 *         description: Error del servidor
 */
router.put('/actividad/actualizar/:id',verificarAutenticacion,actualizarActividad);

/**
 * @swagger
 * /api/actividad/eliminar/{id}:
 *   delete:
 *     summary: Eliminar actividad
 *     tags: [Actividades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de actividad
 *         schema:
 *           type: string
 *           example: 659f56ea027b10d5fb47b581
 *     responses:
 *       200:
 *         description: Eliminación de niño exitoso
 *       401:
 *         description: Usuario no autorizado
 *       404:
 *         description: Id no válido; Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/actividad/eliminar/:id',verificarAutenticacion,eliminarActividad);

export default router
