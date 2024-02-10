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
 *         Email_tutor:
 *           type: string
 *           format: email
 *           description: Email del usuario Tutor
 *         Password_tutor:
 *           type: String
 *           description: Contraseña de usuario Tutor
 *       example:
 *         Email_tutor: "user.tutor.epn@gmail.com"
 *         Password_tutor: "tutor123EPN"
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
 *         description: Campos vacíos
 *       403:
 *         description: No se verificó la cuenta
 *       404:
 *         description: Usuario no registrado
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
 *         Celular_tutor: "0985436485"
 *         Email_tutor: "user.tutor.epn@gmail.com"
 *         Password_tutor: "tutor123EPN"
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
 *         description: Campos vacíos
 *       409:
 *         description: Usuario ya registrado
 *       422:
 *         description: Validaciones fallidas; sintaxis incorrecta
 *       500: 
 *         description: Error del servidor
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
 *         Email_tutor: "user.tutor.epn@gmail.com"
 */
/**
 * @swagger
 * /api/recuperar-password:
 *   post:
 *     summary: Restablecer contraseña de usuario Tutor
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
 *         description: Campos vacíos
 *       404:
 *         description: Tutor no encontrado
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
 *         password: "tutor123EPN2"
 *         confirmpassword: "tutor123EPN2"
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
 *         description: Problemas en la validación de cuenta; Campos vacíos
 *       401:
 *         description: Usuario no autorizado
 *       404:
 *         description: Password no coinciden
 *       422:
 *         description: Validaciones fallidas, sintaxis incorrecta
 *       500:
 *         description: Error del servidor
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
 *       400:
 *         description: La solicitud no fue procesada
 *       401:
 *         description: No autorizado, token inválido o caducado
 *       404:
 *         description: Tutor no encontrado
 *       500:
 *         description: Error del servidor
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
 *         description: Usuario no autorizado
 *       500:
 *         description: Error en el servidor
 */
router.post('/logout', verificarAutenticacion, logoutTutor);

export default router