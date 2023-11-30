import mongoose, {Schema,model} from 'mongoose'

const ProgresoSchema = new Schema({
    Puntuacion:{
        type:String,
        require:true,
        trim:true
    },
    Completado:{
        type:Number,
        require:true,
        trim:true,
        default:0, // valor inicial:0
    },
    Actividad:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Actividad'
    },
    Nino:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Nino'
    }
},{
    timestamps:true
})

export default model('Progreso',ProgresoSchema)