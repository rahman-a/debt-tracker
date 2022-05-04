import express from 'express'
const router = new express.Router()

import {
    createOperation,
    findMutualOperations,
    updateOperationState,
    listAllMemberOperations,
    getOneOperation,
    listAllOperation
} from '../controllers/operations.controller.js'

import {
    isAuth,
    checkRoles
} from '../middlewares/auth.js'

router.get('/mutual/:initiator/:peer', isAuth, findMutualOperations)
router.post('/new', isAuth, createOperation)
router.get('/', isAuth, listAllMemberOperations)
router.get('/all', isAuth, checkRoles('manager'), listAllOperation)
router.get('/:id', isAuth, getOneOperation)
router.patch('/:id/:notification?', isAuth, updateOperationState)


export default router