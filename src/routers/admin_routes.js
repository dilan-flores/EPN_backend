// Importación de la función router por parte de express
import {Router} from 'express'
// Inicialización la función en la variable router
const router = Router()
// Importación para la protección de rutas
import verificarAutenticacion from '../middlewares/autenticacion.js'

import {
    registrarAdmin,
    confirmEmailAdmin,
    loginAdmin
}from "../controllers/admin_controller.js";

router.post('/admin/login',loginAdmin);
router.post('/admin/registro',registrarAdmin);
router.get("/admin/confirmar/:token", confirmEmailAdmin);

export default router