import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
    operation: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Operation'
    },
    credit:{
        type:Number,
        default:0.0,
        required:true
    },
    debt:{
        type:Number,
        default:0.0,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
    currency:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Currency'
    },
    waitingForClear:Date,
    dueDate:Date,
    paymentDate:Date
},{timestamps:true})

export default mongoose.model('Report', reportSchema)