import User from '../models/users.model.js'

export const login = async (req, res, next) => {
    const {email, password} = req.body 
    
    try {
        const staff = await User.AuthUser(email, password, res)
        if(!staff.roles.length){
            res.status(401)
            throw new Error('Not Authorized to Access The Dashboard')
        }

        const tokenExpiry = '7 days'
        
        const token = staff.generateToken(tokenExpiry)
        
        res.cookie('tkid', token, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7})
        
        res.json({
            success:true, 
            code:200,
            staff: {_id:staff._id, avatar:staff.avatar, roles:staff.roles},
            expiryAdAt: expireAt(7),
        })

    } catch (error) {
        next(error)
    }
}

// logout handler
export const logoutHandler = async (req, res, next) => {
    try {
        res.clearCookie('tkid')
        res.send({
            success:true,
            code:200
        })
    } catch (error) {
        next(error)
    }
}


export const createProviderAccount = async(req, res, next ) => {
    const {username,country, emails, insidePhones, expiryAt} = req.body 
    const newProvider = new User(req.body)

    try {
        
        let expire = null
        if(expiryAt) {
          expire = JSON.parse(expiryAt)
        }
        if(emails) {
            newProvider.emails = JSON.parse(emails)
        }
        if(insidePhones) {
            newProvider.insidePhones = JSON.parse(insidePhones)
        }
        
        const isUsernameFound = await User.findOne({username})
        if(isUsernameFound) {
            res.status(400)
            throw new Error('username already found, please choose another one')
        }

        const primaryEmail = newProvider.emails.find(email => email.isPrimary === true)
        const isEmailFound = await User.findOne({"emails.email": primaryEmail.email}) 
        if(isEmailFound) {
            res.status(400)
            throw new Error('email already found, please choose another one')
        }
        
        const primaryPhone = newProvider.insidePhones.find(phone => phone.isPrimary === true)
        const isPhoneFound = await User.findOne({"insidePhones.phone": primaryPhone.phone}) 
        if(isPhoneFound) {
            res.status(400)
            throw new Error('phone already found, please choose another one')
        }

        for(let key in req.files) {
            if(key === 'avatar') {
                newProvider['avatar'] = req.files[key][0].filename
            } else {
                newProvider[key] = {
                    image:req.files[key][0].filename,
                    expireAt: expire[key]
                }
            }
        }

        if(country) {
            newProvider.country = JSON.parse(country)
        }

        const code  = createUserCode(newProvider.fullNameInEnglish, newProvider.country.name)
        newProvider['code'] = code.toLocaleUpperCase()
        
        await newProvider.save()
        
        res.send({
            success:true,
            code:201,
            message:'Provider Account has been Created'
        })
    } catch (error) {
        console.log(error);
        next(error)
    }
}

export const changeUserRole = async (req, res, next) => {
    const {id} = req.params
    const {role} = req.query 
    const roles = {
        user:'Member',
        manager:'Panel Manager',
        cs:'Complains Administrator',
        hr:'Members Administrator'
    }
    try {
        if(!role) {
            res.status('400')
            throw new Error('please define role first')
        }
        const user = await User.findById(id) 
        if(!user) {
            res.status(404) 
            throw new Error('No User Found')
        }
        
        if(user.roles.includes(role)) {
            res.status(400)
            throw new Error(`Member Already set as ${roles[role]}`)
        }
        user.roles = role === 'user'
        ? []
        : [role]    
        
        await user.save() 
        
        res.send({
            success:true,
            code:200,
            message:`User has been set as ${roles[role]}`
        })
    } catch (error) {
        next(error)
    }
}


// CREATE USER UNIQUE CODE
const createUserCode = (name, country) => {
    console.log(name, country);
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

function expireAt(day) { 
    const today = new Date()
    const expiry = new Date(today)
    return expiry.setDate(today.getDate() + day)
}