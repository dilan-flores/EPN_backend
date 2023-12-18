import mongoose, {Schema,model} from 'mongoose'

const InscripcionSchema = new Schema({
    tutor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tutor'
    },
    nino:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Nino'
    },
    actividad:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Actividad'
    }
},{
    timestamps:true
})

export default model('Inscripcion',InscripcionSchema)