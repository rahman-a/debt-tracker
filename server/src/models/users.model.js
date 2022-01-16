import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userSchema = new mongoose.Schema({
    code: {
        type:String,
        trim:true,
        required:true
    },
    username : {
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    fullNameInEnglish: {
        type:String,
        required:true,
    },
    fullNameInArabic: {
        type:String,
        required:true,
    },
    emails:[
        {
            type:String,
            email:{
                type:String,
                required:true,
                lowercase:true
            }
        }
    ],
    password: {
        type:String,
        required:true,
        minlength:[8, 'Password must be at least 8 character'],
    },
    company: String,
    insideAddress : {
        type:String,
        required:true
    },
    outsideAddress:String,
    insidePhones:[
        {
            type:String,
            phone:{
                type:String,
                required:true,
            }
        }
    ],
    outsidePhones:[
        {
            type:String,
            phone:{
                type:String,
                required:true,
            }
        }
    ],
    avatar : {
        type:String,
        required:true
    },
    identity:{
        image:{
            type:String,
            required:true
        },
        expireAt :{
            type:Date,
            required:true
        }
    },
    passport: {
        image:{
            type:String,
        },
        expireAt :{
            type:Date,
        }
    },
    residential: {
        image:{
            type:String,
        },
        expireAt :{
            type:Date,
        }
    },
    verificationImage: {
        type: String,
        required:true,
    },
    roles:Array,
    colorCode:{
        code:{
            type:String,
            default:'#037A12'
        },
        state:Array
    },
    isPhoneConfirmed:{
        type:Boolean,
        default:false
    },
    isEmailConfirmed:{
        type:Boolean,
        default:false
    },
    isAccountConfirmed:{
        type:Boolean,
        default:false
    },
    isProvider:{
        type:Boolean,
        default:false
    },
}, {timestamps:true})

userSchema.statics.toJSON = () => {
    const user = this.toObject()
    delete user.password
    delete user.isPhoneConfirmed
    delete user.isEmailConfirmed
    delete user.isAccountConfirmed
    delete user.isProvider
    delete user.roles
    delete user.verificationImage

    return user
}

userSchema.statics.AuthUser = async function (email, password, res) {
    const user = await User.findOne({email})
    if(!user) {
        res.status(401)
        throw new Error('Wrong Email or Password')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        res.status(401)
        throw new Error('Wrong Email or Password')
    }
    if(!(user.isPhoneConfirmed)) {
        res.status(401)
        throw new Error('Please Confirm Your Phone First')
    }
    if(!(user.isEmailConfirmed)) {
        res.status(401)
        throw new Error('Please Confirm Your E-mail First')
    }
    if(!(user.isAccountConfirmed)) {
        res.status(401)
        throw new Error('The Account has not been approved yet')
    }
    return user
}

userSchema.methods.generateToken = function (days = '1 days') {
    const token = jwt.sign({_id:this._id.toString(),}, process.env.JWT_SECRET, {expiresIn:days})
    return token 
}

userSchema.pre('save', async function(next){
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

const User = mongoose.model('User', userSchema)

export default User