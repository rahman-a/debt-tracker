import express from 'express'
const router = new express.Router()

import { isAuth, checkRoles } from '../middlewares/auth.js'
import { uploadHandler } from '../middlewares/uploads.js'

import {
  createSocial,
  listSocial,
  deleteSocial,
} from '../controllers/social.controllers.js'

router.get('/', listSocial)
router.post('/', isAuth, checkRoles('manager', 'hr', 'cs'), createSocial)
router.delete('/:id', isAuth, checkRoles('manager', 'hr', 'cs'), deleteSocial)

export default router
