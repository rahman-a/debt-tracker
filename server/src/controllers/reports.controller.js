import { DateTime } from 'luxon'
import cron from 'node-cron'
import mongoose from 'mongoose'
import Report from '../models/reports.model.js'
import Operation from '../models/operations.model.js'
import User from '../models/users.model.js'
import Notification from '../models/notifications.model.js'
import { takeAction } from '../config/takeAction.js'
import { code } from '../config/code.js'

export const createReport = async (req, res, next) => {
  const { operation } = req.body

  try {
    const isFound = await Report.findOne({ operation })
    if (isFound) {
      res.status(400)
      throw new Error(req.t('report_already_exist'))
    }
    const targetedOperation = await Operation.findById(operation)

    if (!targetedOperation) {
      res.status(404)
      throw new Error(req.t('operation_not_exist'))
    }

    const newReport = {
      operation: targetedOperation._id,
      currency: targetedOperation.currency,
      credit:
        targetedOperation.initiator.type === 'credit'
          ? targetedOperation.initiator.value
          : targetedOperation.peer.value,
      debt:
        targetedOperation.initiator.type === 'debt'
          ? targetedOperation.initiator.value
          : targetedOperation.peer.value,
    }

    if (targetedOperation.dueDate) {
      newReport.dueDate = targetedOperation.dueDate
    }

    const report = new Report(newReport)
    await report.save()

    res.status(201).send({
      success: true,
      code: 201,
      message: req.t('report_created'),
    })
  } catch (error) {
    next(error)
  }
}

export const listAllMemberReports = async (req, res, next) => {
  const {
    code,
    name,
    type,
    value,
    currency,
    isActive,
    dueDate,
    notDue,
    page,
    skip,
  } = req.query

  try {
    let searchFilter = {
      $or: [
        { 'operation.initiator._id': req.user._id },
        { 'operation.peer._id': req.user._id },
      ],

      dueDate: { $ne: null },
      isActive: true,
    }

    let dueDateFilter = { createdAt: -1 }

    if (code) {
      searchFilter = {
        ...searchFilter,
        _id: mongoose.Types.ObjectId(code),
      }
    }

    if (type) {
      searchFilter = {
        ...searchFilter,
        $or: [
          {
            'operation.peer.type': type,
            'operation.peer._id': { $ne: req.user._id },
            'operation.initiator._id': req.user._id,
          },
          {
            'operation.initiator.type': type,
            'operation.initiator._id': { $ne: req.user._id },
            'operation.peer._id': req.user._id,
          },
        ],
      }
    }

    if (notDue) {
      searchFilter = {
        ...searchFilter,
        dueDate: { $eq: null },
      }
    }

    if (dueDate) {
      dueDateFilter = {
        dueDate: parseInt(dueDate),
      }
    }

    if (isActive) {
      searchFilter = {
        ...searchFilter,
        isActive: false,
      }
      dueDateFilter = {
        paymentDate: -1,
      }
    }

    if (name) {
      searchFilter = {
        ...searchFilter,
        $or: [
          {
            'operation.peer.fullNameInEnglish': { $regex: name, $options: 'i' },
            'operation.initiator._id': req.user._id,
          },
          {
            'operation.initiator.fullNameInEnglish': {
              $regex: name,
              $options: 'i',
            },
            'operation.peer._id': req.user._id,
          },
          {
            'operation.peer.fullNameInArabic': { $regex: name, $options: 'i' },
            'operation.initiator._id': req.user._id,
          },
          {
            'operation.initiator.fullNameInArabic': {
              $regex: name,
              $options: 'i',
            },
            'operation.peer._id': req.user._id,
          },
        ],
      }
    }

    if (currency) {
      searchFilter = {
        ...searchFilter,
        'currency.abbr': currency,
      }
    }

    if (value) {
      const values = value.split(':')
      if (values.length === 2) {
        searchFilter = {
          ...searchFilter,
          $or: [
            {
              credit: {
                $gte: parseInt(values[0]),
                $lte: parseInt(values[1]),
              },
            },
            {
              debt: {
                $gte: parseInt(values[0]),
                $lte: parseInt(values[1]),
              },
            },
          ],
        }
      } else {
        searchFilter = {
          ...searchFilter,
          $or: [{ credit: parseInt(values[0]) }, { debt: parseInt(values[0]) }],
        }
      }
    }

    const aggregateOptions = [
      // JOIN CURRENCY COLLECTION
      {
        $lookup: {
          from: 'currencies',
          localField: 'currency',
          foreignField: '_id',
          as: 'currency',
        },
      },

      {
        $lookup: {
          from: 'operations',
          let: { operationId: '$operation' },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$_id', '$$operationId'] } },
            },
            {
              $lookup: {
                from: 'users',
                let: { userId: '$initiator.user', type: '$initiator.type' },
                pipeline: [
                  { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
                  {
                    $project: {
                      fullNameInEnglish: 1,
                      fullNameInArabic: 1,
                      color: '$colorCode.code',
                      avatar: 1,
                      type: '$$type',
                    },
                  },
                ],
                as: 'initiator',
              },
            },
            {
              $lookup: {
                from: 'users',
                let: { userId: '$peer.user', type: '$peer.type' },
                pipeline: [
                  { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
                  {
                    $project: {
                      fullNameInEnglish: 1,
                      fullNameInArabic: 1,
                      color: '$colorCode.code',
                      avatar: 1,
                      type: '$$type',
                    },
                  },
                ],
                as: 'peer',
              },
            },
            {
              $unwind: '$initiator',
            },
            {
              $unwind: '$peer',
            },
            {
              $project: {
                'initiator._id': 1,
                'initiator.fullNameInEnglish': 1,
                'initiator.fullNameInArabic': 1,
                'initiator.color': 1,
                'initiator.avatar': 1,
                'initiator.type': 1,
                'peer._id': 1,
                'peer.fullNameInEnglish': 1,
                'peer.fullNameInArabic': 1,
                'peer.color': 1,
                'peer.avatar': 1,
                'peer.type': 1,
                note: 1,
              },
            },
          ],

          as: 'operation',
        },
      },
      {
        $unwind: '$currency',
      },
      {
        $unwind: '$operation',
      },
      {
        $match: { ...searchFilter },
      },
    ]

    const reports = await Report.aggregate([
      ...aggregateOptions,
      { $sort: dueDateFilter },
      { $skip: parseInt(skip) || 0 },
      { $limit: parseInt(page) || 5 },
    ])

    const documentCount = await Report.aggregate([
      ...aggregateOptions,
      { $count: 'document_count' },
    ])

    let count = 0

    if (documentCount[0]) {
      count = documentCount[0]['document_count']
    }

    if (reports.length === 0) {
      res.status(404)
      throw new Error(req.t('no_reports_found'))
    }

    res.send({
      success: true,
      code: 200,
      count,
      reports,
    })
  } catch (error) {
    next(error)
  }
}

export const updateReportValues = async (req, res, next) => {
  const { id } = req.params
  const updatedValue = req.query
  try {
    const report = await Report.findById(id)
    if (!report) {
      res.status(404)
      throw new Error(req.t('no_report_found'))
    }
    const allowedProps = ['credit', 'debt', 'dueDate']

    for (let value in updatedValue) {
      if (allowedProps.includes(value)) {
        if (value === 'credit' || value === 'debt') {
          report[value] = parseInt(updatedValue[value])
        } else {
          report[value] = updatedValue[value]
        }
      } else {
        res.status(400)
        throw new Error(req.t('value_not_recognized', { value }))
      }
    }

    const savedReport = await report.save()
    const populatedReport = await Report.findById(savedReport._id)
      .populate({
        path: 'operation',
        populate: {
          path: 'initiator',
          populate: {
            path: 'user',
            select: 'fullNameInEnglish fullNameInArabic type code',
          },
        },
      })
      .populate({
        path: 'operation',
        populate: {
          path: 'peer',
          populate: {
            path: 'user',
            select: 'fullNameInEnglish fullNameInArabic type code',
          },
        },
      })
      .populate('currency', 'name abbr image')

    res.json({
      success: true,
      code: 200,
      report: populatedReport,
      message: req.t('report_updated'),
    })
  } catch (error) {
    next(error)
  }
}

export const closeReportHandler = async (req, res, next) => {
  const { id } = req.params
  const lang = req.headers['accept-language']
  try {
    const report = await Report.findById(id)
    if (!report) {
      res.status(404)
      throw new Error(req.t('no_report_found'))
    }
    if (!report.isActive) {
      res.status(400)
      throw new Error(req.t('operation_already_closed'))
    }
    const operation = await Operation.findById(report.operation)
    const userId =
      operation.initiator.type === 'debt'
        ? operation.initiator.user
        : operation.peer.user
    const debtor = await User.findById(userId)
    if (!debtor) {
      res.status(404)
      throw new Error(req.t('debtor_may_deleted'))
    }

    if (debtor._id.toString() === req.user._id.toString()) {
      res.status(404)
      throw new Error(req.t('must_be_credit_to_close_report'))
    }

    const color = debtor.colorCode.code.trim().toLocaleLowerCase()

    if (color === code['green'].toLocaleLowerCase()) {
      report.isActive = false
      report.paymentDate = new Date()
      await report.save()
      res.send({
        success: true,
        code: 200,
        message: req.t('report_closed'),
      })

      return
    }

    if (color === code['yellow'].toLocaleLowerCase()) {
      debtor.colorCode.state = debtor.colorCode.state.filter(
        (st) => st.report?.toString() !== report._id.toString()
      )
      await debtor.save()
      report.isActive = false
      report.paymentDate = new Date()
      await report.save()

      await takeAction(debtor._id, 'green', 'doneLatePayment', report._id)
      res.send({
        success: true,
        code: 200,
        message: req.t('report_closed'),
      })
      return
    }

    if (color === code['red'].toLocaleLowerCase()) {
      debtor.colorCode.state = debtor.colorCode.state.filter(
        (st) => st.report?.toString() !== report._id.toString()
      )
      await debtor.save()
      report.isActive = false
      report.paymentDate = new Date()
      const waitingPeriod = DateTime.now()
        .setZone('Asia/Dubai')
        .plus({ months: 1 })
        .toISO()
      report.waitingForClear = waitingPeriod
      await report.save()

      await takeAction(
        debtor._id,
        'yellow',
        'doneExpiredPayment',
        report._id,
        lang
      )
      res.send({
        success: true,
        code: 200,
        message: req.t('report_closed'),
      })
      return
    }
  } catch (error) {
    next(error)
  }
}

export const requestDueDateChange = async (req, res, next) => {
  const { id } = req.params
  const { date } = req.body
  const lang = req.headers['accept-language']
  try {
    const report = await Report.findById(id)

    if (!report) {
      res.status(404)
      throw new Error(req.t('no_report_found'))
    }

    const operation = await Operation.findById(report.operation)
    if (!operation) {
      res.status(404)
      throw new Error(req.t('no_operation_connected_to_reports'))
    }

    const creditUser =
      operation.initiator.type === 'credit'
        ? operation.initiator.user
        : operation.peer.user
    if (req.user._id.toString() !== creditUser.toString()) {
      res.status(401)
      throw new Error(req.t('must_be_credit_to_change_date'))
    }

    const debtUser =
      operation.initiator.type === 'debt'
        ? operation.initiator.user
        : operation.peer.user

    const userData = await User.findById(creditUser)

    const notificationData = {
      user: debtUser,
      title: {
        en: `Request Due Date Change`,
        ar: `طلب تغيير تاريخ الإستحقاق`,
      },
      body: {
        en: `${
          userData.fullNameInEnglish
        } change Due Date of report #${id}# to ${new Date(
          date
        ).toDateString()}`,
        ar: `${
          userData.fullNameInArabic
        } طلب تغيير تاريخ الإستحقاق للتقرير بكود #${id}# إلى${new Date(
          date
        ).toDateString()}`,
      },
      report: id,
      payload: {
        date,
        englishName: userData.fullNameInEnglish,
        arabicName: userData.fullNameInArabic,
      },
    }

    const newNotification = new Notification(notificationData)
    await newNotification.save()

    res.send({
      success: true,
      code: 200,
      message: req.t('change_due_date_request_and_wait_approve'),
    })
  } catch (error) {
    next(error)
  }
}

export const approveDueDateChange = async (req, res, next) => {
  const { id } = req.params
  const { date } = req.body
  const lang = req.headers['accept-language']
  try {
    const report = await Report.findById(id)
    if (!report) {
      res.status(404)
      throw new Error(req.t('no_reports_found'))
    }

    const operation = await Operation.findById(report.operation)
    if (!operation) {
      res.status(404)
      throw new Error(req.t('no_operation_connected_to_reports'))
    }

    const debtUser =
      operation.initiator.type === 'debt'
        ? operation.initiator.user
        : operation.peer.user

    if (req.user._id.toString() !== debtUser.toString()) {
      res.status(401)
      throw new Error(req.t('must_be_debt_to_approve_change_date'))
    }

    const creditUser =
      operation.initiator.type === 'credit'
        ? operation.initiator.user
        : operation.peer.user

    const userData = await User.findById(debtUser)

    report.dueDate = new Date(date)
    await report.save()

    const notificationData = {
      user: creditUser,
      title: {
        en: `Approve Due Date Change`,
        ar: `الموافقة على تغيير تاريخ الإستحقاق`,
      },
      body: {
        en: `${userData.fullNameInEnglish} approve the due Date Change of report #${id}#`,
        ar: `تم الموافقة على تغيير تاريخ الإستحقاق من قبل ${userData.fullNameInArabic} للتقرير بكود #${id}#`,
      },
    }

    const newNotification = new Notification(notificationData)
    await newNotification.save()

    res.send({
      success: true,
      code: 200,
      message: req.t('due_date_change_success'),
    })
  } catch (error) {
    next(error)
  }
}

export const listAllReports = async (req, res, next) => {
  const {
    arabicName,
    englishName,
    code,
    value,
    currency,
    dueDate,
    isActive,
    isDue,
    paymentDate,
    skip,
    page,
  } = req.query
  try {
    if (code) {
      const report = await Report.findById(code)
        .populate({
          path: 'operation',
          populate: {
            path: 'initiator',
            populate: {
              path: 'user',
              select: 'fullNameInEnglish fullNameInArabic type code',
            },
          },
        })
        .populate({
          path: 'operation',
          populate: {
            path: 'peer',
            populate: {
              path: 'user',
              select: 'fullNameInEnglish fullNameInArabic type code',
            },
          },
        })
        .populate('currency', 'name abbr image')

      res.send({
        success: true,
        code: 200,
        count: 1,
        reports: [report],
      })

      return
    }

    let searchFilter = {}
    let dueFilter = { createdAt: -1 }

    if (isActive) {
      const active = isActive === 'true'

      if (active) {
        searchFilter = {
          ...searchFilter,
          isActive: true,
        }
      } else {
        searchFilter = {
          ...searchFilter,
          isActive: false,
        }
        dueFilter = { paymentDate: -1 }
      }
    }

    // sort document according to
    //  if operation has due date or not
    if (isDue) {
      const due = isDue === 'true'
      if (due) {
        searchFilter = {
          ...searchFilter,
          dueDate: { $ne: null },
        }
        dueFilter = { dueDate: -1 }
      } else {
        searchFilter = {
          ...searchFilter,
          dueDate: { $eq: null },
        }
      }
    }

    if (paymentDate) {
      const date = new Date(paymentDate)
      date.setDate(date.getDate() + 1)

      searchFilter = {
        ...searchFilter,
        dueDate: {
          $gte: new Date(paymentDate),
          $lte: new Date(date),
        },
      }
    }

    if (arabicName) {
      searchFilter = {
        ...searchFilter,
        $or: [
          {
            'operation.initiator.fullNameInArabic': {
              $regex: arabicName,
              $options: 'i',
            },
          },
          {
            'operation.peer.fullNameInArabic': {
              $regex: arabicName,
              $options: 'i',
            },
          },
        ],
      }
    }
    if (englishName) {
      searchFilter = {
        ...searchFilter,
        $or: [
          {
            'operation.initiator.fullNameInEnglish': {
              $regex: englishName,
              $options: 'i',
            },
          },
          {
            'operation.peer.fullNameInEnglish': {
              $regex: englishName,
              $options: 'i',
            },
          },
        ],
      }
    }
    if (currency) {
      searchFilter = {
        ...searchFilter,
        'currency.abbr': currency,
      }
    }

    if (dueDate) {
      const date = new Date(dueDate)
      date.setDate(date.getDate() + 1)

      searchFilter = {
        ...searchFilter,
        dueDate: {
          $gte: new Date(dueDate),
          $lte: new Date(date),
        },
      }
    }

    if (value) {
      const values = value.split(':')
      if (values.length === 2) {
        searchFilter = {
          ...searchFilter,
          $or: [
            {
              credit: {
                $gte: parseInt(values[0]),
                $lte: parseInt(values[1]),
              },
            },
            {
              debt: {
                $gte: parseInt(values[0]),
                $lte: parseInt(values[1]),
              },
            },
          ],
        }
      } else {
        searchFilter = {
          ...searchFilter,
          $or: [{ credit: parseInt(values[0]) }, { debt: parseInt(values[0]) }],
        }
      }
    }

    const aggregateOptions = [
      // JOIN CURRENCY COLLECTION
      {
        $lookup: {
          from: 'currencies',
          localField: 'currency',
          foreignField: '_id',
          as: 'currency',
        },
      },

      {
        $lookup: {
          from: 'operations',
          let: { operationId: '$operation' },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$_id', '$$operationId'] } },
            },
            {
              $lookup: {
                from: 'users',
                let: { userId: '$initiator.user', type: '$initiator.type' },
                pipeline: [
                  { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
                  {
                    $project: {
                      fullNameInEnglish: 1,
                      fullNameInArabic: 1,
                      code: 1,
                      type: '$$type',
                    },
                  },
                ],
                as: 'initiator',
              },
            },
            {
              $lookup: {
                from: 'users',
                let: { userId: '$peer.user', type: '$peer.type' },
                pipeline: [
                  { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
                  {
                    $project: {
                      fullNameInEnglish: 1,
                      fullNameInArabic: 1,
                      code: 1,
                      type: '$$type',
                    },
                  },
                ],
                as: 'peer',
              },
            },
            {
              $unwind: '$initiator',
            },
            {
              $unwind: '$peer',
            },
            {
              $project: {
                'initiator._id': 1,
                'initiator.fullNameInEnglish': 1,
                'initiator.fullNameInArabic': 1,
                'initiator.code': 1,
                'initiator.type': 1,
                'peer._id': 1,
                'peer.fullNameInEnglish': 1,
                'peer.fullNameInArabic': 1,
                'peer.code': 1,
                'peer.type': 1,
                note: 1,
                createdAt: 1,
              },
            },
          ],

          as: 'operation',
        },
      },
      {
        $unwind: '$currency',
      },
      {
        $unwind: '$operation',
      },
      {
        $match: { ...searchFilter },
      },
    ]

    const reports = await Report.aggregate([
      ...aggregateOptions,
      { $sort: dueFilter },
      { $skip: parseInt(skip) || 0 },
      { $limit: parseInt(page) || 5 },
    ])

    const documentCount = await Report.aggregate([
      ...aggregateOptions,
      { $count: 'document_count' },
    ])

    let count = 0

    if (documentCount[0]) {
      count = documentCount[0]['document_count']
    }

    if (reports.length === 0) {
      res.status(404)
      throw new Error(req.t('no_reports_found'))
    }

    res.send({
      success: true,
      code: 200,
      count,
      reports,
    })
  } catch (error) {
    next(error)
  }
}

const scanReportsDueDate = async () => {
  let date = DateTime.now()
    .setZone('Africa/Cairo')
    .toLocaleString(DateTime.DATETIME_MED)
  console.log(`Start Reports Scanning.... at ${date}`)
  try {
    const reports = await Report.find({
      isActive: true,
      dueDate: { $exists: true },
      dueDate: { $lte: new Date() },
    })

    if (reports.length) {
      const now = DateTime.now().setZone('Asia/Dubai').ts

      for (const report of reports) {
        const dueDateObject = new Date(report.dueDate)
        const dueDate =
          DateTime.fromJSDate(dueDateObject).setZone('Asia/Dubai').ts
        const weekAfterDueDate = DateTime.fromJSDate(dueDateObject)
          .setZone('Asia/Dubai')
          .plus({ days: 7 }).ts

        const twoDaysBeforeDueDate = DateTime.fromJSDate(dueDateObject)
          .setZone('Asia/Dubai')
          .minus({ days: 2 }).ts

        if (now > twoDaysBeforeDueDate && now < dueDate && report.isActive) {
          // send reminder email of payment
          const operation = await Operation.findById(report.operation)
          const userId =
            operation.initiator.type === 'debt'
              ? operation.initiator.user
              : operation.peer.user
          const debtor = await User.findById(userId)
          const info = {
            name: debtor.fullNameInEnglish,
            email: debtor.emails.find((email) => email.isPrimary === true)
              .email,
            date: dueDateObject.toLocaleString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }),
            report: report._id,
          }
          await sendEmail(info, 'debt')
        }

        if (now > dueDate && report.isActive) {
          const operation = await Operation.findById(report.operation)
          const userId =
            operation.initiator.type === 'debt'
              ? operation.initiator.user
              : operation.peer.user
          const debtor = await User.findById(userId)
          if (debtor) {
            if (now <= weekAfterDueDate) {
              const isStateFound = debtor.colorCode.state.find(
                (st) =>
                  st.label.en === 'Late Payment' &&
                  st.report.toString() === report._id.toString()
              )
              !isStateFound &&
                (await takeAction(debtor._id, 'yellow', 'payLate', report._id))
            } else {
              const idx = debtor.colorCode.state.findIndex(
                (st) =>
                  st.label.en === 'Late Payment' &&
                  st.report?.toString() === report._id.toString()
              )
              if (idx !== -1) {
                debtor.colorCode.state.splice(idx, 1)
                await debtor.save()
              }

              const isStateFound = debtor.colorCode.state.find(
                (st) =>
                  st.label.en === 'Expired Payment' &&
                  st.report.toString() === report._id.toString()
              )
              !isStateFound &&
                (await takeAction(debtor._id, 'red', 'payExpired', report._id))
            }
          }
        }
      }
    }
    const waitingReports = await Report.find({
      waitingForClear: { $exists: true },
      waitingForClear: { $lte: new Date() },
    })
    if (waitingReports.length) {
      const now = DateTime.now().setZone('Asia/Dubai').ts

      for (const report of waitingReports) {
        const dateObject = new Date(report.waitingForClear)
        const waitingTime =
          DateTime.fromJSDate(dateObject).setZone('Asia/Dubai').ts
        if (now >= waitingTime) {
          // unset waitingForClear Field
          report.waitingForClear = undefined
          await report.save()

          // locate debtor user
          const operation = await Operation.findById(report.operation)
          const userId =
            operation.initiator.type === 'debt'
              ? operation.initiator.user
              : operation.peer.user
          const debtor = await User.findById(userId)
          if (debtor) {
            // remove late payment from state
            debtor.colorCode.state = debtor.colorCode.state.filter(
              (st) => st.report?.toString() !== report._id.toString()
            )
            await debtor.save()
            await takeAction(debtor._id, 'green', 'clear', report._id)
          }
        }
      }
    }
    date = DateTime.now()
      .setZone('Africa/Cairo')
      .toLocaleString(DateTime.DATETIME_MED)
    console.log(`Done Reports Scanning!!!! at ${date}`)
  } catch (error) {
    date = DateTime.now()
      .setZone('Africa/Cairo')
      .toLocaleString(DateTime.DATETIME_MED)
    console.log(error)
    console.error(
      '\x1b[31m',
      `Done Reports Scanning!!!! at ${date} with ERROR: ${error.message}`
    )
  }
}

cron.schedule('10 6 * * *', scanReportsDueDate, {
  timezone: 'Asia/Dubai',
})
