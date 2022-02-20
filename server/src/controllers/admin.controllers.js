import User from '../models/users.model.js'
import Operation from '../models/operations.model.js'
import Report from '../models/reports.model.js'
import Ticket from '../models/tickets.model.js'

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

export const mainDashboardInfo = async (req, res, next) => {
    try {
        const pendingOperationCount = await Operation.count({state:'pending'})
        const declinedOperationCount = await Operation.count({state:'decline'})
        const activeReportsCount = await Report.count({isActive:true})
        const closedReportsCount = await Report.count({isActive:false})
        const membersCount =  await User.count({})
        const openedTicketsCount = await Ticket.count({isOpen:true}) 

        res.send({
            success:true,
            code:200,
            info:{
                pending:pendingOperationCount,
                declined:declinedOperationCount,
                active:activeReportsCount,
                closed:closedReportsCount,
                members:membersCount,
                tickets:openedTicketsCount
            }
        })

    } catch (error) {
        next(error)
    }
}

export const pendingOperationsAtLastWeek = async (req, res, next) => {
    try {
        const today = new Date()
        const lastWeek  = new Date(new Date().setDate(new Date().getDate() - 7))
        
        const weekDayCount = {
            saturday:0,
            sunday:0,
            monday:0,
            tuesday:0,
            wednesday:0,
            thursday:0,
            friday:0
        }

        const operations = await Operation.aggregate([
            {
                $match:{
                    state:'pending',
                    createdAt:{
                        $gte:lastWeek,
                        $lte:today
                    }
                }
            },
            {
                $project:{
                    _id:0,
                    day:{$dayOfWeek:"$createdAt"}
                }
            }
        ])

        operations.forEach(({day}) => {
            if (day === 1) weekDayCount['sunday'] =+ weekDayCount['sunday'] + 1
            if (day === 2) weekDayCount['monday'] =+ weekDayCount['monday'] + 1
            if (day === 3) weekDayCount['tuesday'] =+ weekDayCount['tuesday'] + 1
            if (day === 4) weekDayCount['wednesday'] =+ weekDayCount['wednesday'] + 1
            if (day === 5) weekDayCount['thursday'] =+ weekDayCount['thursday'] + 1
            if (day === 6) weekDayCount['friday'] =+ weekDayCount['friday'] + 1
            if (day === 7) weekDayCount['saturday'] =+ weekDayCount['saturday'] + 1
        })

        res.send({
            success:true,
            code:200,
            operations:Object.values(weekDayCount)
        })
    } catch (error) {
        next(error)
    }
}

export const activeReportsAtLastWeek = async (req, res, next) => {
    try {
        const today = new Date()
        const lastWeek  = new Date(new Date().setDate(new Date().getDate() - 7))
        
        const weekDayCount = {
            saturday:0,
            sunday:0,
            monday:0,
            tuesday:0,
            wednesday:0,
            thursday:0,
            friday:0
        }

        const reports = await Report.aggregate([
            {
                $match:{
                    isActive:true,
                    createdAt:{
                        $gte:lastWeek,
                        $lte:today
                    }
                }
            },
            {
                $project:{
                    _id:0,
                    day:{$dayOfWeek:"$createdAt"}
                }
            }
        ])

        reports.forEach(({day}) => {
            if (day === 1) weekDayCount['sunday'] =+ weekDayCount['sunday'] + 1
            if (day === 2) weekDayCount['monday'] =+ weekDayCount['monday'] + 1
            if (day === 3) weekDayCount['tuesday'] =+ weekDayCount['tuesday'] + 1
            if (day === 4) weekDayCount['wednesday'] =+ weekDayCount['wednesday'] + 1
            if (day === 5) weekDayCount['thursday'] =+ weekDayCount['thursday'] + 1
            if (day === 6) weekDayCount['friday'] =+ weekDayCount['friday'] + 1
            if (day === 7) weekDayCount['saturday'] =+ weekDayCount['saturday'] + 1
        })

        res.send({
            success:true,
            code:200,
            reports:Object.values(weekDayCount)
        })
    } catch (error) {
        next(error)
    }
}

export const latestTenRegisteredMembers = async (req, res, next) => {
    try {
        
        const members = await User.find({},{
            fullNameInEnglish:1,
            fullNameInArabic:1,
            createdAt:1
        }).sort({createdAt:-1}).limit(10)
        
        
        res.send({
            success:true,
            code:200,
            members
        })
    } catch (error) {
        next(error)
    }
}

export const latestTenIssuedTickets = async (req, res, next) => {
    try {
        const tickets = await Ticket.find({},{
            title:1,
            createdAt:1
        }).sort({createdAt:-1}).limit(10)
        
        res.send({
            success:true,
            code:200,
            tickets
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