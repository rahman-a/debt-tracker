import express from 'express'
const router = new express.Router()

import { isAuth, checkRoles } from '../middlewares/auth.js'
import { uploadHandler } from '../middlewares/uploads.js'
import {
  createSlider,
  deleteSlider,
  listSliders,
  updateSlider,
  createContent,
  deleteContent,
  updateContent,
  listAllNewsContent,
  getContent,
} from '../controllers/content.controllers.js'

router.post(
  '/',
  isAuth,
  checkRoles('manager', 'hr', 'cs'),
  uploadHandler.single('image'),
  createContent
)
router.delete('/:id', isAuth, checkRoles('manager', 'hr', 'cs'), deleteContent)
router.patch(
  '/:id',
  isAuth,
  checkRoles('manager', 'hr', 'cs'),
  uploadHandler.single('image'),
  updateContent
)
router.get('/', getContent)
router.get('/news', listAllNewsContent)

router.post(
  '/slider',
  isAuth,
  checkRoles('manager', 'hr', 'cs'),
  uploadHandler.single('slider'),
  createSlider
)
router.patch(
  '/slider/:id',
  isAuth,
  checkRoles('manager', 'hr', 'cs'),
  uploadHandler.single('slider'),
  updateSlider
)
router.get('/slider', listSliders)
router.delete(
  '/slider/:id',
  isAuth,
  checkRoles('manager', 'hr', 'cs'),
  deleteSlider
)

export default router
