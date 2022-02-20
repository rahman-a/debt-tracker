import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userSchema = new mongoose.Schema({
    code: {
        type:String,
        trim:true,
    },
    username : {
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    fullNameInEnglish:String,
    fullNameInArabic:String,
    emails:[
        {
            isPrimary:Boolean,
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

    country: {
        name:String,
        abbr:String,
        image:String
    },
    
    insideAddress : String,
    outsideAddress:String,
    
    insidePhones:[
        {
            isPrimary:Boolean,
            phone:String
        }
    ],
    
    outsidePhones:[{
        type: String,
    }],
    
    avatar : String,
    
    identity:{
        image:String,
        expireAt:Date,
    },
    
    passport: {
        image:String,
        expireAt :Date
    },
    
    residential: {
        image: String,
        expireAt: Date,
    },
    
    verificationImage:String,
    
    roles:Array,
    
    colorCode:{
        code:{
            type:String,
            default:'#037A12'
        },
        state:[
            {
                message: {
                    en:String,
                    ar:String
                },
                label:{
                    en:String,
                    ar:String
                },
                report: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref:'Report'
                }
            }
        ]
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
    phoneCode:String,
    emailCode:String,
    authString:String,
    lastEmailSend:Date
}, {timestamps:true})

userSchema.methods.toJSON = function(){
    const user = this.toObject()
    delete user.password
    delete user.isPhoneConfirmed
    delete user.isEmailConfirmed
    // delete user.isProvider
    delete user.roles
    delete user.verificationImage
    delete user.phoneCode
    delete user.emailCode
    delete user.authString

    return user
}

userSchema.statics.AuthUser = async function (email, password, res) {
    const user = await User.findOne({"emails.email":email})
    if(!user) {
        res.status(401)
        throw new Error('invalid login or password')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        res.status(401)
        throw new Error('invalid login or password')
    }
    
    if(!(user.isPhoneConfirmed)) {
        res.status(401)
        throw new Error('phone not confirmed')
    }

    if(!(user.isAccountConfirmed)) {
        res.status(401)
        throw new Error('please wait, until you account approved by adminstration')
    }
    
    return user
}

userSchema.methods.generateToken = function (days = '1d') {
    const token = jwt.sign({_id:this._id.toString()}, process.env.JWT_TOKEN, {expiresIn:days})
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