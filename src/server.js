// Importaciones
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routerTutor from './routers/tutor_routes.js'
import routerNino from './routers/nino_routes.js'
import routerAdmin from './routers/admin_routes.js'
import routerInscripcion from './routers/inscripcion_routes.js'
import routerActividad from './routers/actividad_routes.js'
import routerProgreso from './routers/progreso_routes.js'
import routerLogro from './routers/logro_routes.js'
//Documentación
import swaggerUI from 'swagger-ui-express'
import swaggerSpec from './docs/swagger.js';

// Cierre de sesión
import session from 'express-session';
import passport from 'passport';
import './config/passport.js';  // Importa la configuración de Passport.js

// Importar el módulo 'crypto'
import { randomBytes } from 'crypto';

// Generar una cadena secreta aleatoria
const generateSecretKey = () => {
  return randomBytes(32).toString('hex');
};
// Obtener la cadena secreta
const secretKey = generateSecretKey();

// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 
app.set('port', process.env.port || 3000)
app.use(cors())

// Middlewares 
app.use(express.json())

// Variables globales
// app.use((req,res,next)=>{
//     res.locals.user = req.user?.name || null
//     // Proceso de serialización y envía el ID
//     // Deserialización para obtener los datos de tutor
//     //console.log("*****", user.locals.id); // variable global que utiliza todos
//     // se puede inyectar user en cualquier parte: HTML({{user}})
//     next()
// })

// Configuración de sesión para Passport.js
app.use(session({
    secret: secretKey,  // Puedes cambiar esto a un secreto más seguro
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/api', routerTutor)
app.use('/api', routerNino)
app.use('/api', routerAdmin)
app.use('/api', routerActividad)
app.use('/api', routerInscripcion)
app.use('/api', routerProgreso)
app.use('/api', routerLogro)
//Ruta de la documentación
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"))
// Archivos estáticos
//app.use(express.static(path.join(__dirname,'public'))) // otro middlewares // path para especificar la ruta // es un directorio público

export default app