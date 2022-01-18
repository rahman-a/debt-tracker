import User from '../models/users.model.js'
import jwt from 'jsonwebtoken'

export const isAuth = async (req, res, next) => {
    try {
        if(req.cookies['token']) {
            const token = req.cookies['token'] 
            const decode = jwt.verify(token, process.env.JWT_TOKEN, (error, decode) => {
                if(error) throw new Error('Please Login First') 
                return decode
            })
            const user = await User.findById(decode._id)
            if(!user) {
                res.status(401)
                throw new Error('Please Login First')
            }
            
            req.user = user 
            req.token = token
            next()
        }else {
            res.status(401)
            throw new Error('Please Login First')
        }
    } catch (error) {
        next(error)
    }
}

export const verifyAPIKey = async (req, res, next) => {
    try {
        if(req.headers.apikey) {
            if(req.headers.apikey !== process.env.API_KEY) {
                throw new Error('Please Provide a valid API Key')
            }
            next()
        }else {
            throw new Error('Not Authorized to Access the API')
        }
    } catch (error) {
        next(error)
    }
}