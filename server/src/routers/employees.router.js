import express from 'express'
const router = express.Router()
import { isAuth, checkRoles } from '../middlewares/auth.js'

import {
  uploadDocumentsHandler,
  uploadHandler,
} from '../middlewares/uploads.js'

import {
  createEmployee,
  listAllEmployees,
  deleteEmployee,
} from '../controllers/Employees.controllers.js'

const imagesFields = [
  { name: 'avatar', maxCount: 1 },
  { name: 'passport', maxCount: 1 },
  { name: 'identity-front', maxCount: 1 },
  { name: 'identity-back', maxCount: 1 },
]

router.post(
  '/new',
  isAuth,
  uploadDocumentsHandler.fields(imagesFields),
  createEmployee
)

router.get('/list/:manager', isAuth, listAllEmployees)
router.delete('/delete/:employeeId', isAuth, deleteEmployee)

export default router
