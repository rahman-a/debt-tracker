import express from 'express'
const router  = express.Router()

import {
    register,
    completeRegistration,
    registerDocument,
    sendConfirmCodeToPhoneHandler,
    verifyConfirmPhoneCodeHandler,
    sendEmailVerificationLink,
    sendPasswordResetLink,
    verifyAuthLink,
    login,
    verifyLoginCodeHandler,
    sendUserData,
    sendLoginCodeHandler,
    logoutHandler,
    updateUserPassword,
    findUserHandler
} from '../controllers/users.controller.js'

import {
    isAuth
} from '../middlewares/auth.js'

import {uploadHandler} from '../middlewares/uploads.js'

const imagesFields = [
    {name:'avatar', maxCount:1},
    {name:'verificationImage', maxCount:1},
    {name:'passport', maxCount:1},
    {name:'identity', maxCount:1},
    {name:'residential', maxCount:1},
]

router.post('/register', register)
router.patch('/register/:id', completeRegistration)
router.patch('/register/documents/:id', uploadHandler.fields(imagesFields) ,registerDocument)
router.get('/phone/:id?', sendConfirmCodeToPhoneHandler)
router.get('/email/:id', sendEmailVerificationLink)
router.patch('/phone/verify/:id?', verifyConfirmPhoneCodeHandler )
router.patch('/verify', verifyAuthLink)
router.post('/login', login)
router.get('/login/code/new/:id', sendLoginCodeHandler)
router.patch('/login/code/verify/:id', verifyLoginCodeHandler)
router.get('/password/reset', sendPasswordResetLink)
router.get('/me', isAuth, sendUserData)
router.post('/logout', isAuth, logoutHandler)
router.patch('/password/update',isAuth,  updateUserPassword)
router.get('/search',isAuth,  findUserHandler)

export default router