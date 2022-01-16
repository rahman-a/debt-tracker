import mongoose from 'mongoose'

const operationSchema = new mongoose.Schema({
    initiator: {
        type:String,
        required:true,
        value:Number
    },
    peer: {
        type:String,
        required:true,
        value:Number
    },
    note:String,
    currency:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Currency'
    },
    state:{
        type:String,
        default:'pending',
        required:true
    },
    dueDate:Date
},{timestamps:true})

export default mongoose.model('Operation', operationSchema)