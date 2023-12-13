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
    eliminarNino
}from "../controllers/nino_controller.js"

router.post('/nin@s/login',loginNino);
router.get("/nin@s/confirmar/:token", confirmCuenta);

// Rutas privadas
router.get('/nin@s',verificarAutenticacion,renderAllNino);
router.get('/nin@s/:id',verificarAutenticacion,perfilNino);
router.post('/nin@s/registro',verificarAutenticacion,registrarNino);
router.put('/nin@s/actualizar/:id',verificarAutenticacion,actualizarNino);
router.delete('/nin@s/eliminar/:id',verificarAutenticacion,eliminarNino);
export default router