import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    
    member:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    code:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true,
        minlength:50
    },
    file:String,
    isOpen:{
        type:Boolean,
        default:true
    },
    response:[
        {
            title:String,
            body:String,
            sender:String,
            file:String
        }
    ]

}, {timestamps:true})

export default mongoose.model('Ticket', ticketSchema)