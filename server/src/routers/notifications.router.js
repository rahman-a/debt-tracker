import express from 'express'
const router = express.Router()


import {
    createNewNotification,
    updateNotificationReadState,
    listAllUserNotifications,
    pushNotificationToClient
} from '../controllers/notifications.controller.js'

import {
    isAuth
} from '../middlewares/auth.js'


router.post('/new', isAuth, createNewNotification)
router.get('/', isAuth, listAllUserNotifications)
router.get('/push', isAuth, pushNotificationToClient)
router.patch('/:id', isAuth, updateNotificationReadState)

export default router