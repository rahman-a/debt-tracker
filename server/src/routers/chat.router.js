import express from 'express'
const router = express.Router()

import {
  // users
  searchForUsers,
} from '../controllers/chat.controllers.js'

import { isAuth } from '../middlewares/auth.js'

// User Router
router.get('/users', isAuth, searchForUsers)

export default router
