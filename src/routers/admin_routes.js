// Importación de la función router por parte de express
import {Router} from 'express'
// Inicialización la función en la variable router
const router = Router()
// Importación para la protección de rutas
import verificarAutenticacion from '../middlewares/autenticacion.js'

import {
    registrarAdmin,
    confirmEmailAdmin,
    loginAdmin,
    recuperarPasswordAdmin,
    comprobarTokenPaswordAdmin,
    nuevoPasswordAdmin,
    logoutAdmin,
    eliminacionCascada
}from "../controllers/admin_controller.js";

/**
 * @swagger
 * tags:
 *   name: Administrador
 *   description: API para gestionar usuario Administrador
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminDatosLogin:
 *       type: object
 *       required:
 *         - Email_admin
 *         - Password_admin
 *       properties:
 *         Email_admin:
 *           type: string
 *           description: Email del administrador
 *         Password_admin:
 *           type: String
 *           description: Contraseña del administrador
 *       example:
 *         Email_admin: dilan.flores@epn.edu.ec
 *         Password_admin: DAFQ1234
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Login de usuario Administrador
 *     tags: [Administrador]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminDatosLogin'
 *     responses:
 *       200:
 *         description: Usuario Niño logiado exitosamente
 *       400:
 *         description: Campos vacíos
 *       403:
 *         description: No se verificó la cuenta
 *       404:
 *         description: Usuario no registrado
 */
router.post('/admin/login',loginAdmin);

router.post('/admin/registro',registrarAdmin);
router.get("/admin/confirmar/:token", confirmEmailAdmin);

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminDatosRestablecer-Password:
 *       type: object
 *       required:
 *         - Email_admin
 *       properties:
 *         Email_admin:
 *           type: string
 *           format: email
 *           description: Email del usuario Administrador para restablecer la contraseña
 *       example:
 *         "Email_admin": "dilan.flores@epn.edu.ec" 
 */
/**
 * @swagger
 * /api/admin/recuperar-password:
 *   post:
 *     summary: Restablecer contraseña de usuario Administrador
 *     tags: [Administrador]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminDatosRestablecer-Password'
 *     responses:
 *       200:
 *         description: Se envió un email al administrador para restablecer contraseña
 *       400:
 *         description: Campos vacíos
 *       404:
 *         description: Administrador no encontrado
 *         
 */
router.post("/admin/recuperar-password", recuperarPasswordAdmin);
router.get("/admin/recuperar-password/:token", comprobarTokenPaswordAdmin);

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminDatosNuevo-Password:
 *       type: object
 *       required:
 *         - password
 *         - confirmpassword
 *       properties:
 *         password:
 *           type: string
 *           description: Nueva contraseña de Administrador
 *         confirmpassword:
 *           type: string
 *           description: Confirmación de la nueva contraseña
 *       example:
 *         password: "DAFQ1234"
 *         confirmpassword: "DAFQ1234"
 */
/**
 * @swagger
 * /api/admin/nuevo-password/{token}:
 *   post:
 *     summary: Nueva contraseña con token de confirmación
 *     tags: [Administrador]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token enviado al email del Administrador
 *         schema:
 *           type: string
 *           example: 659f56ea027b10d5fb47b581
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminDatosNuevo-Password'
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
router.post("/admin/nuevo-password/:token", nuevoPasswordAdmin);

/**
 * @swagger
 * /api/eliminacionCascada/{tutorId}:
 *   delete:
 *     summary: Eliminar perfil de usuarios en cascada
 *     tags: [Administrador]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: tutorId
 *         in: path
 *         required: true
 *         description: Id de usuario Tutor
 *         schema:
 *           type: string
 *           example: 659f56ea027b10d5fb47b581
 *     responses:
 *       200:
 *         description: Eliminación exitosa
 *       401:
 *         description: Usuario no autorizado
 *       404:
 *         description: Id no válido; Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.delete('/eliminacionCascada/:tutorId', verificarAutenticacion,eliminacionCascada);

/**
 * @swagger
 * /api/admin/logout:
 *   post:
 *     summary: Cerrar sesión de usuario Administrador autenticado
 *     tags: [Administrador]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *       401:
 *         description: No autorizado, token inválido o caducado
 *       500:
 *         description: Error en el servidor
 */
router.post('/admin/logout', verificarAutenticacion,logoutAdmin);

export default router