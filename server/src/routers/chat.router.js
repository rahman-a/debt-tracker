import express from 'express'
const router =  express.Router()


import {
    createConversation, 
    createConversationRoom,
    updateConversation,
    listUserConversation,
    removeConversationRoom,
    initiateConversation,
    createSupportGroup,
    // messages
    createMessage,
    listConversationMessages,
    // users
    findConversationsByName,
    markMessageAsReceived,
    listLatestMessage,
} from '../controllers/chat.controllers.js'

import {
    isAuth,
    checkRoles
} from '../middlewares/auth.js'

import {
    chatRoomImageHandler,
    chatUploadHandler
} from '../middlewares/uploads.js'



router.post('/new', isAuth, createConversation)
router.post('/room', isAuth, 
        checkRoles('manager', 'cs', 'hr'), 
        chatRoomImageHandler.single('image'), 
        createConversationRoom
    )
router.delete('/:id', isAuth, checkRoles('manager', 'cs', 'hr'), removeConversationRoom)
router.patch('/:id', isAuth, checkRoles('manager', 'cs', 'hr'), chatRoomImageHandler.single('image'), updateConversation)
router.get('/', isAuth, listUserConversation)

router.get('/initiate/:userId', isAuth, initiateConversation)
router.post('/support-group', isAuth, createSupportGroup)

// Message Router

router.post('/:conversationId/messages/new', isAuth, chatUploadHandler.single('file'), createMessage)
router.get('/:conversationId/messages', isAuth, listConversationMessages)

// User Router
router.get('/users', isAuth, findConversationsByName)
router.patch('/messages/bulk', isAuth, markMessageAsReceived)
router.patch('/messages/:id?', isAuth, markMessageAsReceived)
router.get('/latest', isAuth, listLatestMessage)


export default router