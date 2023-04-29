import express from 'express'
const router = express.Router()

import { isAuth, checkRoles } from '../middlewares/auth.js'

import {
  createReport,
  listAllMemberReports,
  updateReportValues,
  closeReportHandler,
  listAllReports,
  requestDueDateChange,
  approveDueDateChange,
  generateReportsForPrinting,
  generatePDFBuffer,
} from '../controllers/reports.controller.js'

router.post('/new', isAuth, createReport)
router.get('/', isAuth, listAllMemberReports)
router.get('/all', isAuth, checkRoles('manager'), listAllReports)
router.patch('/close/:id', isAuth, closeReportHandler)
router.patch('/:id', isAuth, updateReportValues)
router.patch('/:id/due', isAuth, requestDueDateChange)
router.patch('/:id/due/approve', isAuth, approveDueDateChange)
router.post('/generate_report', isAuth, generateReportsForPrinting)
router.post('/print_report', isAuth, generatePDFBuffer)

export default router
