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
    findUserHandler,
    listAllUsers,
    deleteUser,
    toggleUserActivation,
    changeUserColorCode
} from '../controllers/users.controller.js'

import {
    login as staffLogin,
    logoutHandler as staffLogout,
    changeUserRole,
    createProviderAccount
} from '../controllers/admin.controllers.js'

import {
    isAuth,
    checkRoles
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
router.get('/me/:id?', isAuth, sendUserData)
router.post('/logout', isAuth, logoutHandler)
router.patch('/password/update',isAuth,  updateUserPassword)
router.get('/search',isAuth,  findUserHandler)

// DASHBOARD ROUTERS
router.post('/staff/login', staffLogin)
router.post('/staff/logout', staffLogout)
router.get('/all', isAuth, checkRoles('manager', 'hr'), listAllUsers)
router.delete('/:id', isAuth, checkRoles('manager', 'hr'), deleteUser)
router.patch('/activate/:id', isAuth, checkRoles('manager', 'hr'), toggleUserActivation)
router.patch('/color/:id', isAuth, checkRoles('manager', 'hr'), changeUserColorCode)
router.patch('/role/:id', isAuth, checkRoles('manager'), changeUserRole)
router.post('/provider', isAuth, checkRoles('manager', 'hr'), uploadHandler.fields(imagesFields), createProviderAccount)

export default router