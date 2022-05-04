import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    operation: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Operation'
    },
    report: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Report'
    },
    title:{
       en:{
           type:String
       },
       ar:{
           type:String
       }
    },
    body:{
        en:{
            type:String,
            required:true
        },
        ar:{
            type:String,
            required:true
        }
    },
    payload:Object,
    isRead:{
        type:Boolean,
        default:false
    },
    isSent:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

export default mongoose.model('Notification', notificationSchema)