import mongoose from 'mongoose'


const messageSchema = new mongoose.Schema({

    conversation:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    
    isReceived:{
        type:Boolean,
        default:false
    },

    text:String,
    file:String,
    image:String,
    audio:String
},{timestamps:true})

export default mongoose.model('Message', messageSchema)