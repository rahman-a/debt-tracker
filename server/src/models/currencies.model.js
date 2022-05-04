import mongoose from 'mongoose'

const currencySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    abbr:{
        type:String,
        required:true 
    },
    image:{
        type:String,
        required:true
    }
},{timestamps:true})

export default mongoose.model('Currency', currencySchema)