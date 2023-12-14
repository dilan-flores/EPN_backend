import {Schema,model} from 'mongoose'
// Encriptar el password del Admin
import bcrypt from "bcryptjs"

const AdminSchema = new Schema({
    Nombre_admin:{
        type:String,
        require:true,
        trim:true
    },
    Email_admin:{
        type:String,
        require:true,
        trim:true,
        // No almacena correos previamente establecidos
        unique:true
    },
    Password_admin:{
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
// Método para cifrar el password del veterinario
AdminSchema.methods.encrypPassword = async function(Password_admin){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(Password_admin,salt)
    return passwordEncryp
}

// Método para verificar si el password ingresado es el mismo de la BDD
AdminSchema.methods.matchPassword = async function(Password_admin){
    const response = await bcrypt.compare(Password_admin,this.Password_admin)
    return response
}

// Método para crear un token 
AdminSchema.methods.crearToken = function(){
    const tokenGenerado = this.token = Math.random().toString(36).slice(2)
    return tokenGenerado
}

export default model('Admin',AdminSchema)