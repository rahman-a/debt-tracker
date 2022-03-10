import express from 'express'
const router =  express.Router()


import {
    createConversation, 
    createConversationRoom,
    updateConversation,
    addMemberToRoom,
    removeMemberFromRoom,
    listUserConversation,
    removeConversationRoom,
    // messages
    createMessage,
    listConversationMessages,
    // users
    findConversationsByName
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
router.patch('/:id', isAuth, 
            checkRoles('manager', 'cs', 'hr'),
            chatRoomImageHandler.single('image'), 
            updateConversation
        )
router.patch('/:id/members', isAuth, checkRoles('manager', 'cs', 'hr'), addMemberToRoom)
router.delete('/:id/members', isAuth, checkRoles('manager', 'cs', 'hr'), removeMemberFromRoom)
router.get('/', isAuth, checkRoles('manager', 'cs', 'hr'), listUserConversation)


// Message Router

router.post('/:conversationId/messages/new', isAuth, chatUploadHandler.single('file'), createMessage)
router.get('/:conversationId/messages', isAuth, listConversationMessages)

// User Router
router.get('/users', isAuth, findConversationsByName)

export default router