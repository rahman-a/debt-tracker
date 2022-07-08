import express from 'express'
const router = new express.Router()

import { isAuth, checkRoles } from '../middlewares/auth.js'
import { uploadHandler } from '../middlewares/uploads.js'
import {
  createContent,
  getContent,
  updateHeadline,
  createAboutItem,
  deleteAboutItem,
  updateAboutItem,
} from '../controllers/About.controllers.js'

router.post('/', isAuth, checkRoles('manager', 'hr', 'cs'), createContent)

router.get('/', isAuth, checkRoles('manager', 'hr', 'cs'), getContent)

router.put('/:id', isAuth, checkRoles('manager', 'hr', 'cs'), updateHeadline)

router.patch(
  '/item/:id',
  isAuth,
  checkRoles('manager', 'hr', 'cs'),
  uploadHandler.single('image'),
  createAboutItem
)

router.patch(
  '/item/update/:id',
  isAuth,
  checkRoles('manager', 'hr', 'cs'),
  uploadHandler.single('image'),
  updateAboutItem
)

router.delete(
  '/item/:id',
  isAuth,
  checkRoles('manager', 'hr', 'cs'),
  deleteAboutItem
)

export default router
