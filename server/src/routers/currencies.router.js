import express from 'express'
const router = express.Router()

import {
  createCurrency,
  listAllCurrency,
  deleteCurrency,
} from '../controllers/currencies.controller.js'

import { isAuth, checkRoles } from '../middlewares/auth.js'

import { uploadHandler } from '../middlewares/uploads.js'

router.post(
  '/new',
  isAuth,
  checkRoles('manager'),
  uploadHandler.single('flag'),
  createCurrency
)

router.get('/', isAuth, listAllCurrency)

router.delete('/:id', isAuth, deleteCurrency)

export default router
