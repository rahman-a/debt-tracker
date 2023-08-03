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
  createFineIntent,
  sentStripePublishableKey,
  finalizeFinePayment,
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
router.post('/create_fine_intent', isAuth, createFineIntent)
router.get('/get_stripe_publishable_key', isAuth, sentStripePublishableKey)
router.post('/finalize_fine_payment', isAuth, finalizeFinePayment)

export default router
