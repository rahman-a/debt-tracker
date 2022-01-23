import User from '../models/users.model.js'
import sendSMS from '../sms/send.js'
import sendEmail from '../emails/email.js'
import randomstring from 'randomstring'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// create user document using email and password
export const register = async (req, res, next) => {
    const {username, emails} = req.body
    const newUser = new User(req.body) 

    try {
        const isUsernameFound = await User.findOne({username})
        if(isUsernameFound) {
            res.status(404)
            throw new Error('username already found, please choose another username')
        }
        for(const email of emails) {
            const isFound = await User.findOne({"emails.email":email.email})
            if(isFound) {
                res.status(404)
                throw new Error(`${email.email} already exist please choose another email`)
            }
        }
        const user = await newUser.save()    
        res.send({
            success:true,
            code:201,
            user:user._id
        })
    } catch (error) {
        next(error)
    }
}

// complete the user information ['fullNameInEnglish', 'fullNameInArabic', 'company',
// 'insideAddress','outsideAddress', 'insidePhones','outsidePhones']
export const completeRegistration = async (req, res, next) => {
    const {id} = req.params
    const userData = req.body 
    try {
        const allowedKeys = ['fullNameInEnglish', 'fullNameInArabic', 'company',
        'insideAddress','outsideAddress', 'insidePhones','outsidePhones', 'country']

        if(Object.keys(userData).length === 0) {
            res.status(400)
            throw new Error('Please Provide the Required Data')
        }
        const user  = await User.findById(id)
        for(let key in userData) {
            if(!(allowedKeys.includes(key))) {
                res.status(404)
                throw new Error(`${key} is not recognized`)
            }
            user[key] = userData[key]
        }
       
        await user.save()
        res.send({
            success:true,
            code:200,
            isDone:true
        })
    } catch (error) {
        next(error)
    }
}

// upload the required documents to verify the user
// [personal image, verification image, identity, passport, residential]
export const registerDocument = async (req, res, next) => {
    const {id} = req.params 

    try {
        const expireAt = JSON.parse(req.body.expireAt);
        const user = await User.findById(id) 
        let docObject;
        let fileType;
        for(let key in req.files){
            if(key === 'avatar' || key === 'verificationImage') {
                user[key] = req.files[key][0].filename
            }else {
                user[key] = {
                    image:req.files[key][0].filename, 
                    expireAt: expireAt[key]
                }
                fileType = key;
                docObject = {
                    image:req.files[key][0].filename, 
                    expireAt: expireAt[key]
                }
            }
        }
        await user.save()
       
        // TO DO ==>  UN COMMIT WHEN DONE
        // await sendConfirmCodeToPhone(user._id) 
        res.send({
            success:true,
            doc:docObject,
            type:fileType,
            code:200,
            isDone:true
        })
    } catch (error) {
        next(error)
    }
}

// sent the code to user phone to verify the phone
export const sendConfirmCodeToPhoneHandler = async (req, res, next) => {
    const {id} = req.params
    const {email} = req.query
    
    try {
        if(!id && email) {
            await sendConfirmCodeToPhone(undefined, email)
        }else {
            await sendConfirmCodeToPhone(id)
        }
        res.send({
            success:true,
            code:200,
            message:'Code has been sent to your phone'
        })
    } catch (error) {
        next(error)
    }
}

// verify the user phone
export const verifyConfirmPhoneCodeHandler = async (req, res, next) => {
    const {id} = req.params 
    const {code, email} = req.query
    try {
        let user;
        if(!id && email) {
            user = await User.findOne({"emails.email":email})
        }else {
            user  = await User.findById(id) 
        }
        if(user.phoneCode !== code) {
            res.status(400)
            throw new Error('Code isn\'t valid please type a valid one or click sent code again')
        }
        user.isPhoneConfirmed = true 
        await user.save()
        id && !email && await sendConfirmLinkToEmail(id, req)
        res.send({
            success:true,
            code:200,
            message:'Your Phone has been verified'
        })
    } catch (error) {
        next(error)
    }
}

// send E-mail verification link to user E-mail 
export const sendEmailVerificationLink = async (req, res, next) => {
    const {id} = req.params 
    try {
        await sendConfirmLinkToEmail(id, req)
        res.send({
            success:true,
            code:200,
            message:'Verification Link has been sent to your E-mail'
        })
    } catch (error) {
        next(error)
    }
}




// User Authentication using email and password
export const login = async (req, res, next) => {
    const {email, password} = req.body 
    try {
      const user = await User.AuthUser(email, password, res) 
      res.send({
          success:true,
          code:200,
          user:user._id,
          message:'A code has been sent to your E-mail'
      })
    } catch (error) {
        next(error)
    }
}

// logout handler
export const logoutHandler = async (req, res, next) => {
    try {
        res.clearCookie('token')
        res.send({
            success:true,
            code:200
        })
    } catch (error) {
        next(error)
    }
}

// send Password Reset Link to user Email
export const sendPasswordResetLink = async (req, res, next) => {
    const {email} = req.query 
    try {
        const user = await User.findOne({"emails.email": email})
        await sendAuthLink(user, req, 'reset')
        res.send({
            success:true,
            code:200,
            message:'The Link has been sent to Your E-mail'
        })
    } catch (error) {
        next(error)
    }
} 

// send login code 
export const sendLoginCodeHandler = async (req, res, next) => {
    const {id} = req.params 
    try {
    await sendLoginCodeToEmail(id)
      res.send({
          success:true,
          code:200,
          message:'A code has been sent to your E-mail'
      })
    } catch (error) {
        next(error)
    }
}


export const verifyAuthLink = async (req, res, next) => {
    const {token, type, password} = req.body 

    try {
        // decode the token to extract user id
        const decode = jwt.verify(token, process.env.RESET_TOKEN, (err, decode) => {
            if(err){
                throw new Error('The Link is Invalid')
            }
            return decode
        })
        // find the user using id from token
        const user = await User.findOne({_id:decode.id})
        
        // if not user send error
        if(!user) throw new Error('No User Found')
       
        // check if reset code == the user reset code
        const isResetCodeMatch = await bcrypt.compare(decode.code, user.authString)
        
        // if not send error
        if(!isResetCodeMatch) throw new Error('The Link is Invalid')
        
        if(type === 'activate') {
            user.isEmailConfirmed = true
            await user.save()
            res.json({
                success:true,
                code:200,
                message:'E-mail has been Verified'
            })
        }else if(type ==='reset') {
            user.password = password
            await user.save()
            // send success from server
            res.json({
                success:true,
                code:200,
                message:'Password has been reset'
            })
        }
    } catch (error) {
       next(error) 
    }
}

// verify the code that sent to email during every authentication 
//  to add more security when authenticate user
export const verifyLoginCodeHandler = async (req, res, next) => {
    const {code,rememberDays} = req.body 
    const {id} = req.params
    try {
        const user = await User.findById(id)
        if(user.emailCode !== code) {
            res.status(400)
            throw new Error('The Code isn\'t valid, please type the right code or send it again')
        }
        if(!(user.isEmailConfirmed)) {
            user.isEmailConfirmed = true 
            await user.save()
        }
        const tokenExpiry = rememberDays ? `${rememberDays} days` : '1d'
        const token = user.generateToken(tokenExpiry)
        res.cookie('token', token, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * (rememberDays || 1)})
        res.json({
            success:true, 
            code:200,
            user: user,
            expiryAt: expireAt(rememberDays || 1),
        })
    } catch (error) {
        next(error)
    }
}

// Send the user data
export const sendUserData = async (req, res, next) => {
    try {
        res.send({
            success:true,
            code:200,
            user:req.user
        })
    } catch (error) {
        next(error)
    }
}

export const updateUserPassword = async (req, res, next) => {
    const {password} = req.body 
    try {
        req.user.password = password 
        await req.user.save()
        res.send({
            success:true,
            code:200,
            message:'Password has been updated'
        })
    } catch (error) {
        next(error)
    }
}


/*******************************************************************/
/******************** HELPER FUNCTION 
/******************************************************************/ 


///////////////////////////////////////////
/////////// PHONE VERIFICATION PROCESS
///////////////////////////////////////////
async function sendConfirmCodeToPhone(id, email) {
    try {   
        let user;
        if(!id && email) {
            user = await User.findOne({'emails.email': email})
        }else {
            user = await User.findById(id)
        }
        if(!user) {
            res.status(404)
            throw new Error('No User Found')
        }
        const phone = user.insidePhones.find(phone => phone.isPrimary === true).phone
        const code = generateRandomCode(6)
        user.phoneCode = code 
        await user.save()
        sendSMS(phone,code)
    } catch (error) {
        throw new Error(error)
    }  
}



///////////////////////////////////////////
/////////// E-MAIL VERIFICATION PROCESS
///////////////////////////////////////////
async function sendConfirmLinkToEmail(id, req) {
    try {
        const user = await User.findById(id) 
        await sendAuthLink(user, req, 'activate')
    } catch (error) {
        throw new Error(error)
    }
}


///////////////////////////////////////////
/////////// E-MAIL CODE PROCESS
///////////////////////////////////////////
async function sendLoginCodeToEmail(id) {
    try {
        const user = await User.findById(id) 
        const code = generateRandomCode(7, 'string')
        user.emailCode = code 
        await user.save()

        // TODO => UN COMMIT UNTIL FINISH
        // const info = {
        //     code:code,
        //     name:user.fullNameInEnglish,
        //     email:user.emails.find(email => email.isPrimary === true).email
        // }
        // await sendEmail(info, 'code')

    } catch (error) {
        throw new Error(error)
    }
}


async function sendAuthLink (user, req, type) {
    try {
           
        // create randomstring
        const resetCode = randomstring.generate()
        // create token
        const token = jwt.sign(
        {
            id:user._id.toString(), 
            code:resetCode
        }, 
        process.env.RESET_TOKEN, 
        {expiresIn:'1 day'}
        );

        // crypt this random string
        const cryptResetCode = await bcrypt.hash(resetCode, 10)
        // store in db
        user.authString = cryptResetCode
        await user.save()
        
        // compose the url
        // const resetUrl = `${req.protocol}://${req.hostname}/${type}?TOKEN=${token}`
        const resetUrl = `${req.protocol}://localhost:3000/${type}?TOKEN=${token}`
        const info = {
            link:resetUrl,
            name:user.fullNameInEnglish,
            email:user.emails.find(email => email.isPrimary === true).email
        }
        await sendEmail(info, type)
    } catch (error) {
       throw new Error(error)
    }
}


const generateRandomCode = (count, type) => {
    const numbers =  [0,1,2,3,4,5,6,7,8,9];
    const alphanumeric = ['A', 0, 'B', 1, 'C', 2, 'D', 3, 'E', 4, 'F', 5, 'G', 6, 'H',7, 'I', 8, 'J'
    ,'K','L',3 ,'M','N', 9, 'O','P',2,'Q','R', 1, 'S','T','Y', 0 , 'Z'];
    let randomArray;
    if(type === 'string') {
        randomArray =  [...Array(count)].map(_ => {
            return alphanumeric[Math.ceil(Math.random() * (numbers.length - 1))]
        })
    }else {
        randomArray =  [...Array(count)].map(_ => {
            return numbers[Math.ceil(Math.random() * (numbers.length - 1))]
        })
    }

    return randomArray.join('')
}


function expireAt(day) { 
    const today = new Date()
    const expiry = new Date(today)
    return expiry.setDate(today.getDate() + day)
}