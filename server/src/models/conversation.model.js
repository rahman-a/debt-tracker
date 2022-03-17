import mongoose from 'mongoose'


const conversationSchema = new mongoose.Schema ({
    name:String,
    isRoom:{
        type:Boolean,
        default:false
    },
    image:String,
    lastMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
}, {timestamps:true})

export default mongoose.model('Conversation', conversationSchema)