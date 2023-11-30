import {Schema,model} from 'mongoose'
// Encriptar el password del Tutor
import bcrypt from "bcryptjs"

const TutorSchema = new Schema({
    Nombre_tutor:{
        type:String,
        require:true,
        // Borra todos los espacios en blanco de alredodor de la palabra
        trim:true
    },
    Rol_tutor:{
        type:String,
        require:true,
        trim:true
    },
    Celular_tutor:{
        type:String,
        require:true,
        trim:true
    },
    Email_tutor:{
        type:String,
        require:true,
        trim:true,
        // No almacena correos previamente establecidos
        unique:true
    },
    Password_tutor:{
        type:String,
        require:true,
        //trim:true
    },
    // Verifica si el correo está activo
    status:{
        type:Boolean,
        default:true
    },
    token:{
        type:String,
        default:null
    },
    // Para confirmar el correo y luego iniciar sesión
    confirmEmail:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

    // Para el login
// Método para cifrar el password del tutor
TutorSchema.methods.encrypPassword = async function(Password_tutor){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(Password_tutor,salt)
    return passwordEncryp
}

// Método para verificar si el password ingresado es el mismo de la BDD
TutorSchema.methods.matchPassword = async function(Password_tutor){
    const response = await bcrypt.compare(Password_tutor,this.Password_tutor)
    return response
}

// Método para crear un token 
TutorSchema.methods.crearToken = function(){
    const tokenGenerado = this.token = Math.random().toString(36).slice(2)
    return tokenGenerado
}
export default model('Tutor',TutorSchema)
