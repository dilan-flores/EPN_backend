import mongoose, {Schema,model} from 'mongoose'

const ActividadSchema = new Schema({
    Nombre_act:{
        type:String,
        require:true,
        trim:true
    },
    Detalle_act:{
        type:String,
        require:true,
        trim:true
    },
    Nivel_dificultad:{
        type:String,
        require:true,
        trim:true
    },
    Recurso_video:{
        type:String,
        require:true,
        trim:true
    },
    Recurso_ejercicio:{
        type:String,
        require:true,
        trim:true
    },
},{
    timestamps:true
})

export default model('Actividad',ActividadSchema)