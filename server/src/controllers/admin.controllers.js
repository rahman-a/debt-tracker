import User from '../models/users.model.js'

export const login = async (req, res, next) => {
    const {email, password} = req.body 
    
    try {
        const staff = await User.AuthUser(email, password, res)
        if(!staff.roles.length){
            res.status(401)
            throw new Error('Not Authorized to Access The Dashboard')
        }

        const tokenExpiry = '7d'
        
        const token = staff.generateToken(tokenExpiry)
        
        res.cookie('tkid', token, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7})
        
        res.json({
            success:true, 
            code:200,
            staff: {_id:staff._id, name:staff.fullNameInEnglish},
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

function expireAt(day) { 
    const today = new Date()
    const expiry = new Date(today)
    return expiry.setDate(today.getDate() + day)
}