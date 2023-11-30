// Importación de la función router por parte de express
import {Router} from 'express'
// Inicialización la función en la variable router
const router = Router()
// Importación para la protección de rutas
import verificarAutenticacion from '../middlewares/autenticacion.js'

import{
    login,
    registrar,
    confirmEmail,
    perfilTutor,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,
    logoutTutor
}from "../controllers/tutor_controller.js";

router.post('/login',login)
router.post('/registro',registrar)
router.get("/confirmar/:token", confirmEmail);
router.get("/recuperar-password", recuperarPassword);
router.get("/recuperar-password/:token", comprobarTokenPasword);
router.post("/nuevo-password/:token", nuevoPassword);

// Rutas privadas
router.get('/tutor/:id',verificarAutenticacion,perfilTutor);
router.post('/logout', verificarAutenticacion,logoutTutor);

export default router