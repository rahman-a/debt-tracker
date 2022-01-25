import express from 'express'
const router =  express.Router()


import {
    createCurrency,
    listAllCurrency,
    deleteCurrency
} from '../controllers/currencies.controller.js'

import {
    isAuth,
} from '../middlewares/auth.js'

import {
    uploadHandler
} from '../middlewares/uploads.js'


// TO DO ==> ADD ADMIN ROLE TO THIS ENDPOINT
router.post('/new', isAuth,uploadHandler.single('flag'), createCurrency)

router.get('/', isAuth, listAllCurrency)

router.delete('/:id', isAuth, deleteCurrency)

export default router