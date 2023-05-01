import express from 'express'
const router = express.Router()

import {
  checkIfExist,
  registerNewUser,
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
  changeUserColorCode,
  updateUserPreferredLanguage,
  updateDocuments,
  sendContactEmail,
  updatePhoneAndAddress,
  updatePhoneNumber,
  getPreviousClients,
  checkIsUserLoggedIn,
} from '../controllers/users.controller.js'

import {
  login as staffLogin,
  logoutHandler as staffLogout,
  changeUserRole,
  createProviderAccount,
  mainDashboardInfo,
  latestTenRegisteredMembers,
  latestTenIssuedTickets,
  pendingOperationsAtLastWeek,
  activeReportsAtLastWeek,
  updateMemberData,
} from '../controllers/admin.controllers.js'

import { isAuth, checkRoles } from '../middlewares/auth.js'

import {
  uploadDocumentsHandler,
  uploadHandler,
} from '../middlewares/uploads.js'

const imagesFields = [
  { name: 'avatar', maxCount: 1 },
  { name: 'verificationImage', maxCount: 1 },
  { name: 'passport', maxCount: 1 },
  { name: 'identity-front', maxCount: 1 },
  { name: 'identity-back', maxCount: 1 },
]

router.post('/check-if-exist', checkIfExist)
router.post(
  '/register',
  uploadDocumentsHandler.fields(imagesFields),
  registerNewUser
)
router.get('/phone/:id?', sendConfirmCodeToPhoneHandler)
router.get('/email/:id', sendEmailVerificationLink)
router.patch('/phone/verify/:id?', verifyConfirmPhoneCodeHandler)
router.patch('/:id/phone/update/', updatePhoneNumber)
router.patch('/verify', verifyAuthLink)
router.post('/login', login)
router.get('/login/code/new/:id', sendLoginCodeHandler)
router.patch('/login/code/verify/:id', verifyLoginCodeHandler)
router.get('/password/reset', sendPasswordResetLink)
router.get('/me/:id?', isAuth, sendUserData)
router.post('/logout', isAuth, logoutHandler)
router.patch('/password/update', isAuth, updateUserPassword)
router.get('/search', isAuth, findUserHandler)
router.patch('/language', isAuth, updateUserPreferredLanguage)
router.patch(
  '/:id/documents',
  isAuth,
  uploadHandler.fields(imagesFields),
  updateDocuments
)
router.post('/contact', sendContactEmail)
router.patch('/info/update', isAuth, updatePhoneAndAddress)
router.get('/:id/clients', isAuth, getPreviousClients)
router.get('/is-logged-in', isAuth, checkIsUserLoggedIn)

// DASHBOARD ROUTERS
router.post('/staff/login', staffLogin)
router.post('/staff/logout', staffLogout)
router.get('/all', isAuth, checkRoles('manager', 'hr'), listAllUsers)
router.delete('/:id', isAuth, checkRoles('manager', 'hr'), deleteUser)
router.patch(
  '/activate/:id',
  isAuth,
  checkRoles('manager', 'hr'),
  toggleUserActivation
)
router.patch(
  '/color/:id',
  isAuth,
  checkRoles('manager', 'hr'),
  changeUserColorCode
)
router.patch('/role/:id', isAuth, checkRoles('manager'), changeUserRole)
router.post(
  '/provider',
  isAuth,
  checkRoles('manager', 'hr'),
  uploadHandler.fields(imagesFields),
  createProviderAccount
)
router.get(
  '/info',
  isAuth,
  checkRoles('manager', 'hr', 'cs'),
  mainDashboardInfo
)
router.get(
  '/latest',
  isAuth,
  checkRoles('manager', 'hr', 'cs'),
  latestTenRegisteredMembers
)
router.get(
  '/tickets',
  isAuth,
  checkRoles('manager', 'hr', 'cs'),
  latestTenIssuedTickets
)
router.get(
  '/operations',
  isAuth,
  checkRoles('manager', 'hr', 'cs'),
  pendingOperationsAtLastWeek
)
router.get(
  '/reports',
  isAuth,
  checkRoles('manager', 'hr', 'cs'),
  activeReportsAtLastWeek
)

router.patch(
  '/:id/update',
  isAuth,
  checkRoles('manager', 'hr'),
  updateMemberData
)

export default router
