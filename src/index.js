// Importación de la variable app por medio de modulos
import app from './server.js'
import connection from './database.js';

connection()

//Ejecutar el servidor por medio del puerto 3000
app.listen(app.get('port'),()=>{
    console.log(`Server en http://localhost:${app.get('port')}`);
})