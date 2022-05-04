import express from 'express'

const router = new express.Router()

import {
    listAllMemberTickets,
    listAllTickets,
    createNewTicket,
    updateTicketStatus,
    addTicketResponse,
    getTicketInformation
} from '../controllers/tickets.controllers.js'

import {
    isAuth,
    checkRoles
} from '../middlewares/auth.js'

import {
    fileUploadHandler
} from '../middlewares/uploads.js'

router.get('/', isAuth, checkRoles('manager', 'cs'), listAllTickets)
router.post('/new', isAuth,fileUploadHandler.single('file'), createNewTicket) 
router.get('/:id', isAuth, getTicketInformation)
router.get('/member/:id', isAuth, listAllMemberTickets)
router.patch('/:id/status', isAuth, checkRoles('manager', 'cs'), updateTicketStatus)
router.patch('/:id/response', isAuth, fileUploadHandler.single('file'), addTicketResponse)


export default router