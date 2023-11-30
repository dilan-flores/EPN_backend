import mongoose, {Schema,model} from 'mongoose'

const LogroSchema = new Schema({
    Descripcion_logro:{
        type:String,
        require:true,
        trim:true
    },
    Nino:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Nino'
    }
},{
    timestamps:true
})

export default model('Logro',LogroSchema)