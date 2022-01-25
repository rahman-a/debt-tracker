import express from 'express'
const router = new express.Router()

import {
    createOperation,
    findMutualOperations,
    updateOperationState,
    listAllOperations,
    getOneOperation
} from '../controllers/operations.controller.js'

import {
    isAuth
} from '../middlewares/auth.js'

router.get('/mutual/:initiator/:peer', isAuth, findMutualOperations)
router.post('/new', isAuth, createOperation)
router.get('/', isAuth, listAllOperations)
router.get('/:id', isAuth, getOneOperation)
router.patch('/:id', isAuth, updateOperationState)


export default router