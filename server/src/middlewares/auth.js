// @ts-nocheck
import Session from '../models/sessions.model.js'
import jwt from 'jsonwebtoken'

export const isAuth = async (req, res, next) => {
  // session token that hold the session id and expire in 60sec
  const { token } = req.query
  try {
    if (token) {
      const decode = await handleToken(
        { token, secret: process.env.SESSION_TOKEN_SECRET },
        req,
        res
      )
      const session = await handleSession(decode.sessionId, req, res)
      res.cookie('token', session.authToken, {
        httpOnly: true,
        domain: 'localhost',
        path: '/',
        expires: session.expireAt,
      })
      req.user = session.user
      req.token = session.authToken
      next()
    } else if (req.cookies['token'] || req.cookies['tkid']) {
      const token = req.cookies['token'] || req.cookies['tkid']
      const decode = await handleToken(
        { token, secret: process.env.JWT_TOKEN, isAuth: true },
        req,
        res
      )
      const session = await handleSession(decode.sessionId, req, res)
      req.user = session.user
      req.token = session.authToken
      req.sessionId = session._id
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

async function handleToken({ token, secret, isAuth }, req, res) {
  const decode = jwt.verify(token, secret, (error, payload) => {
    if (error) {
      const filter = isAuth ? { authToken: token } : { sessionToken: token }
      Session.findOne(filter).then((data) => {
        data && data.remove()
      })
      console.log('Session Error: ', error)
      res.status(401)
      throw new Error(req.t('please_login_first'))
    }
    return payload
  })
  return decode
}

async function handleSession(id, req, res) {
  const session = await Session.findById(id).populate('user')
  if (!session) {
    res.status(401)
    throw new Error(req.t('please_login_first'))
  }
  const currentData = new Date()
  const sessionDate = new Date(session.expireAt)
  if (sessionDate.getTime() < currentData.getTime()) {
    await session.remove()
    res.status(401)
    throw new Error(req.t('please_login_first'))
  }
  return session
}
