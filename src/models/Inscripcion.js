import mongoose, {Schema,model} from 'mongoose'

const InscripcionSchema = new Schema({
    Tutor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tutor'
    },
    Nino:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Nino'
    },
    Actividad:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Actividad'
    }
},{
    timestamps:true
})

export default model('Inscripcion',InscripcionSchema)