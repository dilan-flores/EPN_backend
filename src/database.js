import mongoose from 'mongoose'

    // Si defino 5 campos, 5 campos se tienen que guardar en la base de datos
mongoose.set('strictQuery', true)
const connection = async()=>{
    try {
        const {connection} = await mongoose.connect(process.env.MONGODB_URI,{
            useUnifiedTopology:true,
            useNewUrlParser:true,
        })
        console.log(`BDD conectada en ${connection.host} - ${connection.port}`)
    } catch (error) {
        console.log(error);
    }
}

//Exportar la cadena de conexión
export default  connection