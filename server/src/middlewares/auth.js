import User from '../models/users.model.js'
import jwt from 'jsonwebtoken'

export const isAuth = async (req, res, next) => {
  try {
    if (req.cookies['token'] || req.cookies['tkid']) {
      const token = req.cookies['token'] || req.cookies['tkid']
      const decode = jwt.verify(
        token,
        process.env.JWT_TOKEN,
        (error, decode) => {
          if (error) {
            res.status(401)
            throw new Error(req.t('please_login_first'))
          }
          return decode
        }
      )
      const user = await User.findById(decode._id)
      if (!user) {
        res.status(401)
        throw new Error(req.t('please_login_first'))
      }

      req.user = user
      req.token = token
      next()
    } else {
      res.status(401)
      throw new Error(req.t('please_login_first'))
    }
  } catch (error) {
    next(error)
  }
}

export const checkRoles = (...requiredRoles) => {
  return (req, res, next) => {
    try {
      const allowedRoles = [...requiredRoles]
      const userRoles = req.user.roles
      const isFound = userRoles
        .map((role) => allowedRoles.includes(role))
        .find((val) => val === true)

      if (!isFound) {
        res.status(401)
        throw new Error(req.t('not_authorized_to_handle_request'))
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

export const verifyAPIKey = async (req, res, next) => {
  try {
    if (req.headers.apikey) {
      if (req.headers.apikey !== process.env.API_KEY) {
        throw new Error(req.t('provide_valid_api_key'))
      }
      next()
    } else {
      throw new Error(req.t('not_authorized_to_access_api'))
    }
  } catch (error) {
    next(error)
  }
}
