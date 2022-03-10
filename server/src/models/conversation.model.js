import mongoose from 'mongoose'


const conversationSchema = new mongoose.Schema ({
    name:String,
    isRoom:{
        type:Boolean,
        default:false
    },
    image:{
        data:{
            type:Buffer
        },
        mimeType:String
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
}, {timestamps:true})

export default mongoose.model('Conversation', conversationSchema)