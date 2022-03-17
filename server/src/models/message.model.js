import mongoose from 'mongoose'


const messageSchema = new mongoose.Schema({

    conversation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Conversation',
        required:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    
    isReceived:{
        type:Boolean,
        default:false
    },
    isSent:{
        type:Boolean,
        default:true
    },
    content:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    }
},{timestamps:true})

export default mongoose.model('Message', messageSchema)