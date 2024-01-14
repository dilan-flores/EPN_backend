// Importación de la función router por parte de express
import { Router } from 'express'
// Inicialización la función en la variable router
const router = Router()
// Importación para la protección de rutas
import verificarAutenticacion from '../middlewares/autenticacion.js'

import {
    login,
    registrar,
    confirmEmail,
    perfilTutor,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,
    logoutTutor
} from "../controllers/tutor_controller.js";
/**
 * @swagger
 * components: 
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 */


/**
 * @swagger
 * tags:
 *   name: Tutor
 *   description: API para gestionar usuario Tutor
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DatosLogin:
 *       type: object
 *       required:
 *         - Email_tutor
 *         - Password_tutor
 *       properties:
 *         _id:
 *           type: string
 *           description: ID generado automáticamente por MongoDB
 *         Email_tutor:
 *           type: string
 *           format: email
 *           description: Nombre completo del usuario
 *         Password_tutor:
 *           type: String
 *           description: Número de teléfono del usuario
 *       example:
 *         Email_tutor: dilan.flores@epn.edu.ec
 *         Password_tutor: DAFQ1234
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login de usuario Tutor
 *     tags: [Tutor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DatosLogin'
 *     responses:
 *       200:
 *         description: Usuario Tutor logiado exitosamente
 *       400:
 *         description: Problema en el envío de datos
 */
router.post('/login', login)

/**
 * @swagger
 * components:
 *   schemas:
 *     DatosRegistro:
 *       type: object
 *       required:
 *         - Nombre_tutor
 *         - Rol_tutor
 *         - Celular_tutor
 *         - Email_tutor
 *         - Password_tutor
 *       properties:
 *         Nombre_tutor:
 *           type: string
 *           description: Nombre completo del tutor
 *         Rol_tutor:
 *           type: string
 *           description: Rol del tutor (puede ser "Familiar", "Padre", etc.)
 *         Celular_tutor:
 *           type: string
 *           description: Número de teléfono del tutor
 *         Email_tutor:
 *           type: string
 *           format: email
 *           description: Correo electrónico del tutor
 *         Password_tutor:
 *           type: string
 *           description: Contraseña del tutor
 *       example:
 *         Nombre_tutor: "Alexander Quimbia"
 *         Rol_tutor: "Familiar"
 *         Celular_tutor: "0985436487"
 *         Email_tutor: "dilan.flores@epn.edu.ec"
 *         Password_tutor: "DAFQ1234"
 */
/**
 * @swagger
 * /api/registro:
 *   post:
 *     summary: Registro de usuario Tutor
 *     tags: [Tutor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DatosRegistro'
 *     responses:
 *       200:
 *         description: Usuario Tutor registrado exitosamente
 *       400:
 *         description: Problema en el envío de datos o correo electrónico ya registrado
 */
router.post('/registro', registrar);
router.get("/confirmar/:token", confirmEmail);

/**
 * @swagger
 * components:
 *   schemas:
 *     DatosRestablecer-Password:
 *       type: object
 *       required:
 *         - Email_tutor
 *       properties:
 *         Email_tutor:
 *           type: string
 *           format: email
 *           description: Correo electrónico del tutor para recuperar la contraseña
 *       example:
 *         Email_tutor: "dilan.flores@epn.edu.ec"
 */
/**
 * @swagger
 * /api/recuperar-password:
 *   post:
 *     summary: Restablecer contraseña de usuario Tutor (Endpoint no disponible)
 *     tags: [Tutor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DatosRestablecer-Password'
 *     responses:
 *       200:
 *         description: Se envió un email para verificar el restablecer contraseña
 *       400:
 *         description: Problema en el envío de datos o correo electrónico no registrado
 */
router.post("/recuperar-password", recuperarPassword);
router.get("/recuperar-password/:token", comprobarTokenPasword);

/**
 * @swagger
 * components:
 *   schemas:
 *     DatosNuevo-Password:
 *       type: object
 *       required:
 *         - password
 *         - confirmpassword
 *       properties:
 *         password:
 *           type: string
 *           description: Nueva contraseña del tutor
 *         confirmpassword:
 *           type: string
 *           description: Confirmación de la nueva contraseña
 *       example:
 *         password: "DA123"
 *         confirmpassword: "DA123"
 */
/**
 * @swagger
 * /api/nuevo-password/{token}:
 *   post:
 *     summary: Nueva contraseña con token de confirmación
 *     tags: [Tutor]
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
 *             $ref: '#/components/schemas/DatosNuevo-Password'
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *       400:
 *         description: Problema en el envío de datos o token no válido
 */
router.post("/nuevo-password/:token", nuevoPassword);
/**
 * @swagger
 * /api/tutor/{id}:
 *   get:
 *     summary: Obtener el perfil de usuario Tutor autenticado
 *     tags: [Tutor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del tutor
 *         schema:
 *           type: string
 *           example: 659f56ea027b10d5fb47b581
 *     responses:
 *       200:
 *         description: Perfil del tutor obtenido exitosamente
 *       401:
 *         description: No autorizado, token inválido o caducado
 *       404:
 *         description: Tutor no encontrado
 */
router.get('/tutor/:id', verificarAutenticacion, perfilTutor);
/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Cerrar sesión de usuario Tutor autenticado
 *     tags: [Tutor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *       401:
 *         description: No autorizado, token inválido o caducado
 */
router.post('/logout', verificarAutenticacion, logoutTutor);

export default router