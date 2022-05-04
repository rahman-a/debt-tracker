import express from 'express'
const router = new express.Router()

import { isAuth, checkRoles } from '../middlewares/auth.js'
import { uploadHandler } from '../middlewares/uploads.js'

import {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
  increaseArticleViews,
} from '../controllers/Article.controllers.js'

router.post(
  '/',
  isAuth,
  checkRoles('manager', 'hr', 'cs'),
  uploadHandler.single('image'),
  createArticle
)
router.get('/', isAuth, checkRoles('manager', 'hr', 'cs'), getArticles)
router.get('/:id', getArticle)
router.patch(
  '/:id',
  isAuth,
  checkRoles('manager', 'hr', 'cs'),
  uploadHandler.single('image'),
  updateArticle
)

router.patch('/views/:id', increaseArticleViews)
router.delete('/:id', isAuth, checkRoles('manager', 'hr', 'cs'), deleteArticle)

export default router
