import express from 'express'
const router = express.Router()

import {
    isAuth
} from '../middlewares/auth.js'

import {
    createReport,
    listAllReports,
    updateReportValues
} from '../controllers/reports.controller.js'


router.post('/new', isAuth, createReport)
router.get('/', isAuth, listAllReports)
router.patch('/:id', isAuth, updateReportValues)

export default router 