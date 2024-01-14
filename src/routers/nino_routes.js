// Importación de la función router por parte de express
import {Router} from 'express'
// Inicialización la función en la variable router
const router = Router()
// Importación para la protección de rutas
import verificarAutenticacion from '../middlewares/autenticacion.js'

import{
    renderAllNino,
    registrarNino,
    confirmCuenta,
    loginNino,
    perfilNino,
    actualizarNino,
    eliminarNino,
    recuperarPasswordNino,
    comprobarTokenPaswordNino,
    nuevoPasswordNino,
    logoutNino
}from "../controllers/nino_controller.js"
/**
 * @swagger
 * tags:
 *   name: Nino
 *   description: API para gestionar usuario Niño
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NinoDatosLogin:
 *       type: object
 *       required:
 *         - Usuario_nino
 *         - Password_nino
 *       properties:
 *         Usuario_nino:
 *           type: string
 *           description: Usuario del Niño
 *         Password_nino:
 *           type: String
 *           description: Contraseña del usuario Niño
 *       example:
 *         Usuario_nino: dilan.flores@epn.edu.ec
 *         Password_nino: DAFQ1234
 */

/**
 * @swagger
 * /api/nin@s/login:
 *   post:
 *     summary: Login de usuario Niño
 *     tags: [Nino]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DatosLoginNino'
 *     responses:
 *       200:
 *         description: Usuario Niño logiado exitosamente
 *       400:
 *         description: Problema en el envío de datos
 */
router.post('/nin@s/login',loginNino);

/**
 * @swagger
 * components:
 *   schemas:
 *     NinoDatosRegistro:
 *       type: object
 *       required:
 *         - Nombre_nino
 *         - FN_nino
 *         - Celular_tutor
 *         - Usuario_nino
 *         - Password_nino
 *       properties:
 *         Nombre_nino:
 *           type: string
 *           description: Nombre completo del usuario Niño
 *         FN_nino:
 *           type: date
 *           description: Fecha de nacimiento del Niño
 *         Usuario_nino:
 *           type: string
 *           description: Usuario del Niño
 *         Password_nino:
 *           type: string
 *           description: Contraseña del Niño
 *       example:
 *         Nombre_nino: "AlexYyy"
 *         FN_nino: "2012-12-05"
 *         Usuario_nino: "alexyyy"
 *         Password_nino: "AAYF1727"
 */
/**
 * @swagger
 * /api/nin@s/registro:
 *   post:
 *     summary: Registro de usuario Niño
 *     tags: [Nino]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NinoDatosRegistro'
 *     responses:
 *       200:
 *         description: Usuario Niño registrado exitosamente
 *       400:
 *         description: Campos vacíos
 *       401:
 *         description: No autorizado
 */
router.post('/nin@s/registro',verificarAutenticacion,registrarNino);
router.get("/nin@s/confirmar/:token", confirmCuenta);

/**
 * @swagger
 * /api/nin@s:
 *   get:
 *     summary: Visualizar usuarios Niño registrados
 *     tags: [Nino]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Visualización de todo Niño registrado
 *       401:
 *         description: Usuario no autorizado
 */
router.get('/nin@s',verificarAutenticacion,renderAllNino);

/**
 * @swagger
 * /api/nin@s/:id:
 *   get:
 *     summary: Visualizar un usuario Niño
 *     tags: [Nino]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id del Tutor o Niño
 *         schema:
 *           type: string
 *           example: 659f56ea027b10d5fb47b581
 *     responses:
 *       200:
 *         description: Visualización de un Niño
 *       401:
 *         description: Usuario no autorizado
 *       404:
 *         description: Id no válido o no encontrado
 */
router.get('/nin@s/:id',verificarAutenticacion,perfilNino);

/**
 * @swagger
 * components:
 *   schemas:
 *     NinoDatosActualizar:
 *       type: object
 *       required:
 *         - Nombre_nino
 *         - FN_nino
 *         - Usuario_nino
 *       properties:
 *         Nombre_nino:
 *           type: string
 *           description: Nuevo nombre de Niño
 *         FN_nino:
 *           type: Date
 *           description: Nuevo Fecha de Nacimiento de Niño
 *         Usuario_nino:
 *           type: string
 *           description: Nuevo usuario de Niño
 *       example:
 *         Nombre_nino: "Alex :)"
 *         FN_nino: "2013-08-02"
 *         Usuario_nino: "AlexAlex"
 */
/**
 * @swagger
 * /api/nin@s/actualizar/{id}:
 *   put:
 *     summary: Actualizar perfil de Niño
 *     tags: [Nino]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del Niño
 *         schema:
 *           type: string
 *           example: 659f56ea027b10d5fb47b581
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NinoDatosActualizar'
 *     responses:
 *       200:
 *         description: Actualización de niño exitoso
 *       400:
 *         description: Campos vacíos o solicitud mal formada
 *       401:
 *         description: Usuario no autorizado
 *       404:
 *         description: Id no válido o no encontrado
 *       422:
 *         description: Validaciones fallidas, sintaxis incorrecta
 *       500:
 *         description: Error del servidor
 */
router.put('/nin@s/actualizar/:id',verificarAutenticacion,actualizarNino);

/**
 * @swagger
 * /api/nin@s/eliminar/{id}:
 *   delete:
 *     summary: Eliminar perfil de Niño
 *     tags: [Nino]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario Tutor
 *         schema:
 *           type: string
 *           example: 659f56ea027b10d5fb47b581
 *     responses:
 *       200:
 *         description: Eliminación de niño exitoso
 *       401:
 *         description: Usuario no autorizado
 *       404:
 *         description: Id no válido o no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/nin@s/eliminar/:id',verificarAutenticacion,eliminarNino);

/**
 * @swagger
 * components:
 *   schemas:
 *     NinoDatosRestablecer-Password:
 *       type: object
 *       required:
 *         - Usuario_nino
 *       properties:
 *         Usuario_nino:
 *           type: string
 *           description: Usuario del niño para restablecer la contraseña (Se envía el email del tutor)
 *       example:
 *         "Usuario_nino": "alexyyy" 
 */
/**
 * @swagger
 * /api/nin@/recuperar-password:
 *   post:
 *     summary: Restablecer contraseña de usuario Tutor (Endpoint no disponible)
 *     tags: [Nino]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NinoDatosRestablecer-Password'
 *     responses:
 *       200:
 *         description: Se envió un email al tutor para verificar el restablecer contraseña del Niño
 *       400:
 *         description: Problema al obtener el email del tutor
 *       401:
 *         description: Usuario no autorizado
 *       500:
 *         description: Error del servidor  
 *         
 */
router.post("/nin@/recuperar-password", verificarAutenticacion, recuperarPasswordNino);
router.get("/nin@s/recuperar-password/:token", comprobarTokenPaswordNino);

/**
 * @swagger
 * components:
 *   schemas:
 *     NinoDatosNuevo-Password:
 *       type: object
 *       required:
 *         - password
 *         - confirmpassword
 *       properties:
 *         password:
 *           type: string
 *           description: Nueva contraseña de Niño
 *         confirmpassword:
 *           type: string
 *           description: Confirmación de la nueva contraseña
 *       example:
 *         password: "DAFQ1234"
 *         confirmpassword: "DAFQ1234"
 */
/**
 * @swagger
 * /api/nin@s/nuevo-password/{token}:
 *   post:
 *     summary: Nueva contraseña con token de confirmación
 *     tags: [Nino]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token enviado al email del tutor
 *         schema:
 *           type: string
 *           example: 659f56ea027b10d5fb47b581
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NinoDatosNuevo-Password'
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *       400:
 *         description: Problema en el envío de datos o token no válido
 *       401:
 *         description: Usuario no autorizado
 *       422:
 *         description: Validaciones fallidas, sintaxis incorrecta
 *       500:
 *         description: Error en el servidor
 */
router.post("/nin@s/nuevo-password/:token", nuevoPasswordNino);

/**
 * @swagger
 * /api/nin@s/logout:
 *   post:
 *     summary: Cerrar sesión de usuario Niño autenticado
 *     tags: [Nino]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *       401:
 *         description: No autorizado, token inválido o caducado
 */
router.post('/nin@s/logout', verificarAutenticacion,logoutNino);

export default router