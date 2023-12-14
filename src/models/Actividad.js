import { Schema, model } from 'mongoose'

const dificultad = ['Alta', 'Media', 'Baja'];

const ActividadSchema = new Schema({
    Nombre_act: {
        type: String,
        require: true,
        trim: true
    },
    Detalle_act: {
        type: String,
        require: true,
        trim: true
    },
    Nivel_dificultad: {
        type: String,
        require: true,
        trim: true,
        enum: dificultad
    },
    Recurso_video: {
        type: String,
        require: true,
        trim: true
    },
    Recurso_ejercicio: {
        type: Schema.Types.Mixed, // Permite cualquier tipo de datos
        required: true,
    },
}, {
    timestamps: true
})

export default model('Actividad', ActividadSchema)