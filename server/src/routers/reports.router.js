import express from 'express'
const router = express.Router()

import {
    isAuth,
    checkRoles
} from '../middlewares/auth.js'

import {
    createReport,
    listAllMemberReports,
    updateReportValues,
    closeReportHandler,
    listAllReports
} from '../controllers/reports.controller.js'


router.post('/new', isAuth, createReport)
router.get('/', isAuth, listAllMemberReports)
router.get('/all', isAuth, checkRoles('manager'), listAllReports)
router.patch('/close/:id', isAuth, closeReportHandler)
router.patch('/:id', isAuth, updateReportValues)

export default router 