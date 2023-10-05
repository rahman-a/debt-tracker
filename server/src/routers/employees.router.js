import express from 'express'
const router = express.Router()
import { isAuth, checkRoles } from '../middlewares/auth.js'

import { uploadDocumentsHandler } from '../middlewares/uploads.js'

import {
  createEmployee,
  listAllEmployees,
  getEmployeeData,
  deleteEmployee,
  toggleBlockEmployee,
} from '../controllers/Employees.controllers.js'

import { listAllMemberOperations } from '../controllers/operations.controller.js'

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
router.get('/:employeeId/entries', isAuth, listAllMemberOperations)
router.get('/:employeeId', isAuth, getEmployeeData)
router.patch('/:employeeId/block', isAuth, toggleBlockEmployee)
router.delete('/:employeeId/delete', isAuth, deleteEmployee)

export default router
