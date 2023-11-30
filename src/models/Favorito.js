import mongoose, {Schema,model} from 'mongoose'

const FavoritoSchema = new Schema({
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

export default model('Favorito',FavoritoSchema)