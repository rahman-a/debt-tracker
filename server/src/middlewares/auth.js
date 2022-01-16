import User from '../models/users.model.js'
import jwt from 'jsonwebtoken'

export const isAuth = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            if(req.cookies['token']) {
                const token = req.cookies['token'] 
                const decode = jwt.verify(token, process.env.JWT_SECRET, (decode, error) => {
                    if(error) throw new Error('Please Login First') 
                    return decode
                })
                const user = await User.findById(decode._id)
                if(!user) {
                    res.status(401)
                    throw new Error('Please Login First')
                }
                
                if(allowedRoles?.length) {
                    const result = user.roles?.map(role => allowedRoles.includes(role))
                    .find(val => val === true)
                    if(!result) {
                        res.status(401)
                        throw new Error('Not Authorized')
                    }
                }
                req.user = user 
                req.token = token
            }else {
                res.status(401)
                throw new Error('Please Login First')
            }
        } catch (error) {
            next(error)
        }
    }
}