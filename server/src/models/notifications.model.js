import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    operation: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Operation'
    },
    title:{
        type:String,
        default:'Initiate a New Operation',
    },
    body:{
        type:String,
        required:true
    },
    isRead:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

export default mongoose.model('Notification', notificationSchema)