import mongoose, {Schema,model} from 'mongoose'

const ProgresoSchema = new Schema({
    Puntuacion:{
        type:Number,
        require:true,
        trim:true,
        default:0, // valor inicial:0
    },
    Completado:{
        type:Number,
        require:true,
        trim:true,
        default:0, // valor inicial:0
    },
    ActividadId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Actividad'
    },
    NinoId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Nino'
    }
},{
    timestamps:true
})

export default model('Progreso',ProgresoSchema)