import mongoose, {Schema,model} from 'mongoose'
// Encriptar el password del Tutor
import bcrypt from "bcryptjs"

const NinoSchema = new Schema({
    Nombre_nino:{
        type:String,
        require:true,
        trim:true
    },
    FN_nino:{// Fecha de nacimiento
        type:Date,
        require:true,
        // trim:true
    },
    Usuario_nino:{
        type: String,
        required: true,
        unique:true,
        trim:true
    },
    Password_nino:{
        type: String,
        required:true
    },
    image:{
        public_id:String,
        secure_url:String
    },
    tutor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tutor',
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
    token:{
        type:String,
        default:null
    },
    confirm_tutor:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

// Método para cifrar el password del niño
NinoSchema.methods.encrypPassword = async function(Password_nino){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(Password_nino,salt)
    return passwordEncryp
}

// Método para verificar si el password ingresado es el mismo de la BDD
NinoSchema.methods.matchPassword = async function(Password_nino){
    const response = await bcrypt.compare(Password_nino,this.Password_nino)
    return response
}

// Método para crear un token 
NinoSchema.methods.crearToken = function(){
    const tokenGenerado = this.token = Math.random().toString(36).slice(2)
    return tokenGenerado
}

export default model('Nino',NinoSchema)