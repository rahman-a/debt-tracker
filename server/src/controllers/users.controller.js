import fs from 'fs'
import path from 'path'
import randomstring from 'randomstring'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {DateTime} from 'luxon'
import cron from 'node-cron'
import {fileURLToPath} from 'url'
import User from '../models/users.model.js'
import Operation from '../models/operations.model.js'
import Notification from '../models/notifications.model.js'
import sendSMS from '../sms/send.js'
import sendEmail from '../emails/email.js'
import { takeAction } from '../config/takeAction.js'
import {labels} from '../config/labels.js'
const __dirname = path.dirname(fileURLToPath(import.meta.url)) 

// create user document using email and password
export const register = async (req, res, next) => {
    const {username, emails} = req.body
    const newUser = new User(req.body) 

    try {
        const isUsernameFound = await User.findOne({username})
        if(isUsernameFound) {
            res.status(400)
            throw new Error('username already found, please choose another username')
        }
        for(const email of emails) {
            const isFound = await User.findOne({"emails.email":email.email})
            if(isFound) {
                res.status(400)
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
                res.status(400)
                throw new Error(`${key} is not recognized`)
            }
            user[key] = userData[key]
        }

        const code = createUserCode(user.fullNameInEnglish, user.country.name)
        user.code = code.toLocaleUpperCase()
        await user.save()
        
        const notification = {
            title:'New Registration',
            body:`${user.fullNameInEnglish} initiate new registration process with code ${code.toLocaleUpperCase()}`
        }
        
        await sendNotificationToAdminPanel(['manager','hr'], notification)
        
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
    const {snapshot} = req.query
    try {
        let expireAt = null
        if(snapshot === 'not_taken') {
            expireAt = JSON.parse(req.body.expireAt);
        }
        const user = await User.findById(id) 
        let docObject;
        let fileType;
        for(let key in req.files){
            

            if(user[key] && user[key]?.image) {
                fs.unlinkSync(
                    path.join(__dirname, 'server', '../../../uploads', user[key].image)
                )
            }

            if(key === 'avatar' || key === 'verificationImage') {
                
                user[key] = req.files[key][0].filename
            } else {
                
                user[key] = {
                    image:req.files[key][0].filename, 
                    expireAt: expireAt[key]
                }

                let documentState = null
                
                if(key === 'identity') {
                    documentState = user.colorCode.state.filter(
                        st => st.label['en'] !== labels['idExpired']['en']
                              && st.label['en'] !== labels['idUpload']['en']
                    )
                }else if (key === 'passport') {
                    documentState = user.colorCode.state.filter(
                        st => st.label['en'] !== labels['passExpired']['en']
                              && st.label['en'] !== labels['passUpload']['en']
                    )
                }else if (key === 'residential') {
                    documentState = user.colorCode.state.filter(
                        st => st.label['en'] !== labels['resiExpired']['en']
                             && st.label['en'] !== labels['resiUpload']['en']
                    )
                }

                user.colorCode.state =  documentState 
                              
                
                fileType = key;
                docObject = {
                    image:req.files[key][0].filename, 
                    expireAt: expireAt[key]
                }
            }
        } 
        await user.save()
        
        await takeAction(user._id, 'green')  
        
        if(snapshot === 'not_taken') {
            await sendConfirmCodeToPhone(user._id) 
        }

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
        
        if(!user) {
            res.status(404)
            throw new Error('This E-mail isn\'t connected with any account')
        }
        
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


// SEARCH FOR USERS BY [CODE - PHONE - USERNAME]

export const findUserHandler = async (req, res, next) => {
    const {code, phone, username} = req.query

    try {
        let users;
        
        if(phone) {
            users = await User.find({"insidePhones.phone": phone})
            if(users.length === 0) {
                res.status(404)
                throw new Error('no users found, search again')
            }
        }else {
            let searchFilter = {}
    
            if(code) {
                searchFilter = {code}
            }
            if(username) {
                searchFilter = {username}
            }
            
            users = await User.find({...searchFilter})
            if(users.length === 0) {
                res.status(404)
                throw new Error('no users found, search again')
            }  
        }
        const allUsers = users.map(user => (
            {
                _id:user._id,
                name:user.fullNameInEnglish,
                image:user.avatar
            }
        ))
        res.send({
            success:true,
            code:200,
            users:allUsers
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
        const {id} = req.params 
    try {
        let user = null 
        
        if(id) {
            if(req.user.roles.includes('manager')
            || req.user.roles.includes('hr')
            || req.user.roles.includes('cs')) {
                const userData = await User.findById(id)
                user = {...userData._doc}
            } else {
                res.status(401)
                throw new Error('Not Authorized to handle request')
            }
        } else {
            user ={...req.user._doc} 
        }
        
        if(user.identity){
            const now = DateTime.now().ts
            const date = new Date(user.identity.expireAt)
            const expiry = DateTime.fromJSDate(date).ts
            
            const identity = {
                image:user.identity.image,
                isExpired: now > expiry
            }
            user.identity = identity
        }
        
        if(user.passport){
            const now = DateTime.now().ts
            const date = new Date(user.passport.expireAt)
            const expiry = DateTime.fromJSDate(date).ts
            const passport = {
                image:user.passport.image,
                isExpired: now > expiry
            }
            user.passport = passport
        }
        
        if(user.residential) {
            const now = DateTime.now().ts
            const date = new Date(user.residential.expireAt)
            const expiry = DateTime.fromJSDate(date).ts
            
            const residential = {
                image:user.residential.image,
                isExpired: now > expiry
            }
            user.residential = residential
        }
        
        res.send({
            success:true,
            code:200,
            user
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


////////////////////////////////////////////////////
//////////////// Dashboard Routers
/////////////////////////////////////////////////// 

// LIST ALL USERS FOR ADMIN DASHBOARD 
export const listAllUsers = async (req, res, next) => {
    const {
        skip, 
        arabicName, 
        englishName, 
        code, 
        username,
        color,
        isProvider,
        isActive,
        email,
        phone,
        country
    }  = req.query
    
    let searchFilter = {}
    
    try {
        if(code) {
            searchFilter = {
                ...searchFilter,
                code
            }
        }
        if(arabicName) {
            searchFilter = {
                ...searchFilter,
                fullNameInArabic: {
                    $regex:arabicName,
                    $options:'i'
                }
            }
        }
        if(englishName) {
            searchFilter = {
                ...searchFilter,
                fullNameInEnglish: {
                    $regex:englishName,
                    $options:'i'
                }
            }
        }
        if(email) {
            searchFilter = {
                ...searchFilter,
                "emails.email": email
            }
        }
        if(phone) {
            searchFilter = {
                ...searchFilter,
                "insidePhones.phone":phone
            }
        }
        if(country) {
            searchFilter = {
                ...searchFilter,
                "country.name": {
                    $regex:country,
                    $options:'i'
                }
            }
        }
        if(username) {
            searchFilter = {
                ...searchFilter,
                username
            }
        }
        if(color) {
            searchFilter = {
                ...searchFilter,
                "colorCode.code":color
            }
        }
        if(isProvider) {
            searchFilter = {
                ...searchFilter,
                isProvider: isProvider === 'true'
            }
        }

        if(isActive) {
            searchFilter = {
                ...searchFilter,
                isAccountConfirmed: isActive === 'true'
            }
        }

       const users = await User.find({},{
          code:1, 
          colorCode:1,
          fullNameInEnglish:1,
          createdAt:1,
          avatar:1,
          isAccountConfirmed:1,
           isProvider:1
        })
        
        if(!users.length) {
            res.status(404)
            throw new Error('No Users Found in the Database')
        }
        
        const count = await User.count({...searchFilter})
        
        res.send({
            code:200,
            success:true,
            users,
            count
        })
    } catch (error) {
        next(error)
    }
}


// DELETE USER ROUTER 
export const deleteUser = async (req, res, next) => {
    const {id} = req.params 

    try {
        const user = await User.findById(id) 
        if(!user) {
            res.status(404)
            throw new Error('No User Found to Delete')
        }
        await user.remove()
        res.send({
            code:200,
            success:true,
            message:`${user.fullNameInEnglish} has been deleted`
        })
    } catch (error) {
        next(error)
    }
}


// TOGGLE USER ACTIVATION 

export const toggleUserActivation = async (req, res, next) => {
    const {id} = req.params 

    try {
        const user = await User.findById(id) 
        if(!user) {
            res.status(404) 
            throw new Error('No User Found')
        }
        user.isAccountConfirmed = !user.isAccountConfirmed
        await user.save() 
    
        res.send({
            success:true,
            code:200,
            isConfirmed: user.isAccountConfirmed
        })

    } catch (error) {
        next(error)
    }
}

export const changeUserColorCode = async (req, res, next) => {
    const {id} = req.params 
    const {code, state} = req.body 
    
    try {
        const user = await User.findById(id) 
        
        if(!user) {
            res.status(404)
            throw new Error('No User Found')
        }
        
        console.log({code}, {state});
        
        if(code === '#037A12') {
            user.colorCode = {
                code,
                state:[]
            }
        }else {
            user.colorCode = {
                code,
                state:[...user.colorCode.state, state]
            }
        }

        await user.save() 
        
        res.send({
            success:true,
            code:200,
            message:'Color Code has been changed'
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
        const country = user.country.name
        user.phoneCode = code 
        await user.save()
        sendSMS(phone,code,country)
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

        
        const info = {
            code:code,
            name:user.fullNameInEnglish,
            email:user.emails.find(email => email.isPrimary === true).email
        }
        await sendEmail(info, 'code')

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
        const resetUrl = `${req.protocol}://${req.hostname}/#/${type}?TOKEN=${token}`
        // const resetUrl = `${req.protocol}://localhost:3000/${type}?TOKEN=${token}`
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



const sendNotificationToAdminPanel = async (roles, data) => {
    try {
        
        const users = await User.find({roles:{$in:roles}})
        const usersIds = users.map(user => user._id)
        if(usersIds.length) {
            for(const id of usersIds) {
                data.user = id 
                const newNotification = new Notification(data) 
                await newNotification.save()
            }
        }
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



// CREATE USER UNIQUE CODE
const createUserCode = (name, country) => {
    console.log({country});
    const randomNumbers = [0,1,2,3,4,5,6,7,8,9]
    const splittedName = name.split(' ')
    const firstNameLetter = splittedName[0][0]
    const lastNameLetter = splittedName[splittedName.length - 1][0] 
    const countryFirstLetter = country[0]
    let codeNumber = '';    
    for(let i = 0; i < 6; i++) {
       const num = randomNumbers[Math.floor(Math.random() * randomNumbers.length)]
       codeNumber += num
    }
    return firstNameLetter + lastNameLetter + countryFirstLetter + codeNumber
}


const scanUserDocuments = async () => {
    let date = DateTime.now().setZone('Africa/Cairo').toLocaleString(DateTime.DATETIME_MED)
    console.log(`Start Users Scanning.... at ${date}`);
    try {
      
        const users = await User.find({})
        
        if(users.length) {
            
            for(const user of users) {
                
                if(user.identity && user.identity.expireAt) {
                   await documentExpiredHandler(user._id, 'identity', 'idExpired')
                }
                
                if(user.passport &&  user.passport.expireAt) {
                    await documentExpiredHandler(user._id, 'passport', 'passExpired')
                } else {
                    await documentMissingHandler(user._id, 'passport', 'passUpload')
                }
                
                if(user.residential && user.residential.expireAt) {
                    await documentExpiredHandler(user._id, 'residential', 'resiExpired')
                } else {
                    await documentMissingHandler(user._id, 'residential', 'resiUpload')
                }
            }
        }

    date = DateTime.now().setZone('Africa/Cairo').toLocaleString(DateTime.DATETIME_MED)
    console.log(`Done Users Scanning!!!! at ${date}`);
    
    } catch (error) {
        date = DateTime.now().setZone('Africa/Cairo').toLocaleString(DateTime.DATETIME_MED)
        console.error("\x1b[31m", `Done Users Scanning!!!! at ${date} with ERROR: ${error.message}`);
        console.log(error);
    }
}

const documentExpiredHandler  = async (id, document, action) => {
    
    const user = await User.findById(id)
    
    const now = DateTime.now().setZone('Asia/Dubai').ts 
    
    const expiryDateObject = new Date(user[document].expireAt) 
    const expiryDate = DateTime.fromJSDate(expiryDateObject).setZone('Asia/Dubai').ts 
    
    if (now > expiryDate) {
       await takeAction(user._id, 'yellow', action)
    } else {
        
        const now = DateTime.now().setZone('Asia/Dubai')
        
        const expiryDateObject = new Date(user[document].expireAt) 
        const expiryDate = DateTime.fromJSDate(expiryDateObject).setZone('Asia/Dubai')
        
        const weekDiff = expiryDate.diff(now, ['days','hours'])
        const weekDiffInDays = weekDiff.values.days 
        if(weekDiffInDays < 8 && weekDiffInDays > 6) {
            const newNotification = {
                user:user._id, 
                title:`Your ${capitalize(document)} About to Expire`,
                body:`We Remind you to upload your new ${document} because you only have less than a week
                before your ${document} EXPIRE`
            }
            // sent notification to user
            const notification = new Notification(newNotification)
            await notification.save()

            const info = {
                name:user.fullNameInEnglish,
                email:user.emails.find(email => email.isPrimary === true).email,
                message:`We Remind you to upload your new ${document} because you only have less than a week
                before your ${document} EXPIRE`,
                label:`Your ${capitalize(document)} About to Expire`
            }

            // send email to inform the user
            await sendEmail(info, 'notice')
        }
    }
}


const documentMissingHandler = async (id, document, action) => {
    
    const user = await User.findById(id)
    
    const now = DateTime.now().setZone('Asia/Dubai')
    const registrationDateObject = new Date(user.createdAt) 
    const registrationDate = DateTime.fromJSDate(registrationDateObject).setZone('Asia/Dubai')
    
    const diff = now.diff(registrationDate, ['days', 'hours'])
    const sinceRegistrationInDays = diff.values.days 
    
    if(sinceRegistrationInDays > 29 && sinceRegistrationInDays < 31) {
        await takeAction(user._id, 'yellow', action)
    }else if(sinceRegistrationInDays < 30){
        const operationCount = await Operation.count({
            $or:[
                {"initiator.user": user._id},
                {"peer.user":user._id}
            ]
        })
        if(operationCount >= 5) {
            if(user.lastEmailSend) {
            
                const now = DateTime.now().setZone('Asia/Dubai')
                
                const lastEmailSendDateObject = new Date(user.lastEmailSend) 
                const lastEmailSendDate = DateTime.fromJSDate(lastEmailSendDateObject).setZone('Asia/Dubai')
                
                const diff = now.diff(lastEmailSendDate, ['days', 'hours'])
                const lastEmailSendInDays = diff.values.days  
                
                if(lastEmailSendInDays > 2 && lastEmailSendInDays < 4) {
                    const info = {
                        name:user.fullNameInEnglish,
                        email:user.emails.find(email => email.isPrimary === true).email,
                        message:`This is a reminder E-mail to upload your ${document} because we notice you start create
                        operations and engage with other clients`,
                        label:`Reminder to upload Your ${capitalize(document)}`
                    }

                    // send email to inform the user
                    await sendEmail(info, 'notice')
                }
            }else {
                const info = {
                    name:user.fullNameInEnglish,
                    email:user.emails.find(email => email.isPrimary === true).email,
                    message:`This is a reminder E-mail to upload your ${document} because we notice you start create
                    operations and engage with other clients`,
                    label:`Reminder to upload Your ${capitalize(document)}`
                }

                // send email to inform the user
                await sendEmail(info, 'notice')

                user.lastEmailSend = new Date()
                await user.save()
            }
        }
    }
}

function capitalize(string){
    return string.charAt(0).toLocaleUpperCase() + string.slice(1)
} 

function expireAt(day) { 
    const today = new Date()
    const expiry = new Date(today)
    return expiry.setDate(today.getDate() + day)
}

cron.schedule('* 8 * * *', scanUserDocuments, {
    timezone:'Asia/Dubai'
})