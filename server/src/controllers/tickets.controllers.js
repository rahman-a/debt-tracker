// @ts-nocheck
import Ticket from '../models/tickets.model.js'
import User from '../models/users.model.js'
import Notification from '../models/notifications.model.js'
import ObjectId from 'mongoose/lib/types/objectid.js'

export const createNewTicket = async (req, res, next) => {
  const { title } = req.body
  const lang = req.headers['accept-language']
  try {
    const isFound = await Ticket.findOne({ title })
    if (isFound) {
      res.status(401)
      throw new Error(req.t('title_already_exist'))
    }
    const newTicket = new Ticket(req.body)
    newTicket.member = req.user._id
    newTicket.code = createTicketCode()
    if (req.file) {
      newTicket.file = req.file.filename
    }
    const ticket = await newTicket.save()

    const adminNotification = {
      title: {
        en: `Ticket has initiated by ${req.user.fullNameInEnglish}`,
        ar: `تم إنشاء تذكرة للدعم الفنى من قبل ${req.user.fullNameInArabic}`,
      },
      body: {
        en: `${req.user.fullNameInEnglish} has initiated new Ticket #${ticket.code}# related to ${ticket.title}`,
        ar: `${req.user.fullNameInArabic} أنشأ تذكرة جديدة للدعم الفنى بكود رقم #${ticket.code}# متعلقة بــ ${ticket.title}`,
      },
    }
    await sendNotificationToAdminPanel(['manager', 'cs'], adminNotification)
    res.send({
      success: true,
      code: 201,
      message: req.t('ticket_created'),
      ticket,
    })
  } catch (error) {
    next(error)
  }
}

export const listAllMemberTickets = async (req, res, next) => {
  const { id } = req.params
  const { title, isOpen, ticket, skip, page } = req.query

  try {
    let searchFilter = { member: id }

    if (ticket) {
      searchFilter = {
        ...searchFilter,
        code: ticket,
      }
    }

    if (title) {
      searchFilter = {
        ...searchFilter,
        title: {
          $regex: title,
          $options: 'i',
        },
      }
    }
    if (isOpen) {
      const status = isOpen === 'true'
      searchFilter = {
        ...searchFilter,
        isOpen: status,
      }
    }

    const tickets = await Ticket.find({ ...searchFilter })
      .sort({ createdAt: -1 })
      .limit(parseInt(page) || 5)
      .skip(parseInt(skip) || 0)

    if (tickets.length === 0) {
      res.status(404)
      throw new Error(req.t('no_tickets_created'))
    }
    const count = await Ticket.count({ ...searchFilter })
    res.send({
      success: true,
      code: 200,
      tickets,
      count,
    })
  } catch (error) {
    next(error)
  }
}

export const listAllTickets = async (req, res, next) => {
  const { title, isOpen, name, email, phone, code, username, page, skip } =
    req.query

  try {
    let searchFilter = {}

    if (title) {
      searchFilter = {
        ...searchFilter,
        title: {
          $regex: title,
          $options: 'i',
        },
      }
    }

    if (isOpen) {
      const status = isOpen === 'true'
      searchFilter = {
        ...searchFilter,
        isOpen: status,
      }
    }

    if (name) {
      searchFilter = {
        ...searchFilter,
        'member.fullNameInEnglish': {
          $regex: name,
          $options: 'i',
        },
      }
    }
    if (email) {
      searchFilter = {
        ...searchFilter,
        'member.email.email': email,
      }
    }
    if (phone) {
      searchFilter = {
        ...searchFilter,
        'member.phone.phone': phone,
      }
    }
    if (code) {
      searchFilter = {
        ...searchFilter,
        code,
      }
    }
    if (username) {
      searchFilter = {
        ...searchFilter,
        'member.username': username,
      }
    }

    const aggregateOptions = [
      {
        $lookup: {
          from: 'users',
          let: { memberId: '$member' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$memberId'] },
              },
            },
            {
              $project: {
                code: 1,
                username: 1,
                fullNameInEnglish: 1,
                fullNameInArabic: 1,
                avatar: 1,
                email: {
                  $filter: {
                    input: '$emails',
                    as: 'email',
                    cond: { $eq: ['$$email.isPrimary', true] },
                  },
                },
                phone: {
                  $filter: {
                    input: '$insidePhones',
                    as: 'phone',
                    cond: { $eq: ['$$phone.isPrimary', true] },
                  },
                },
              },
            },
            {
              $unwind: '$email',
            },
            {
              $unwind: '$phone',
            },
          ],
          as: 'member',
        },
      },
      {
        $unwind: '$member',
      },
      {
        $match: searchFilter,
      },
    ]

    const tickets = await Ticket.aggregate([
      ...aggregateOptions,
      { $sort: { createdAt: -1 } },
      { $skip: parseInt(skip) || 0 },
      { $limit: parseInt(page) || 10 },
    ])

    if (tickets.length === 0) {
      res.status(404)
      throw new Error(req.t('no_tickets_listed'))
    }

    const documentCount = await Ticket.aggregate([
      ...aggregateOptions,
      { $count: 'count' },
    ])

    let count = 0

    if (documentCount[0]) {
      count = documentCount[0]['count']
    }
    res.send({
      success: true,
      code: 200,
      count,
      tickets,
    })
  } catch (error) {
    next(error)
  }
}

export const updateTicketStatus = async (req, res, next) => {
  const { id } = req.params
  const lang = req.headers['accept-language']
  try {
    const ticket = await Ticket.findById(id).populate(
      'member',
      'fullNameInEnglish fullNameInArabic'
    )
    if (!ticket) {
      res.status(404)
      throw new Error(req.t('ticket_not_found'))
    }
    ticket.isOpen = false
    await ticket.save()
    const adminNotification = {
      title: {
        en: 'Ticket has been closed',
        ar: 'تم غلق التذكرة بنجاح',
      },
      body: {
        en: `ticket with code #${ticket.code}# related to ${ticket.member.fullNameInEnglish} has marked as solved and is now closed`,
        ar: `تذكرة الدعم الفنى بكود رقم #${ticket.code}# المتعلقة بــ ${ticket.member.fullNameInArabic} تم حلها وغلقها الآن`,
      },
    }
    await sendNotificationToAdminPanel(['manager', 'cs'], adminNotification)
    res.send({
      success: true,
      code: 200,
      message: req.t('ticket_closed'),
    })
  } catch (error) {
    next(error)
  }
}

export const addTicketResponse = async (req, res, next) => {
  const { id } = req.params
  const { title, body, sender } = req.body
  try {
    const ticket = await Ticket.findById(id).populate(
      'member',
      'fullNameInEnglish fullNameInArabic'
    )

    if (!ticket) {
      res.status(404)
      throw new Error(req.t('ticket_not_found'))
    }
    const newResponse = { title, body, sender }
    if (req.file) {
      newResponse.file = req.file.filename
    }
    ticket.response = ticket.response.concat(newResponse)
    const updatedTicket = await ticket.save()

    if (sender === 'member') {
      const adminNotification = {
        title: {
          en: 'Member Replied to Ticket',
          ar: 'العضو رد على التذكرة',
        },
        body: {
          en: `${ticket.member.fullNameInEnglish} replied to ticket with code #${ticket.code}#`,
          ar: `${ticket.member.fullNameInArabic} وضع رد على تذكرة الدعم الفنى بكود رقم #${ticket.code}#`,
        },
      }
      await sendNotificationToAdminPanel(['manager', 'cs'], adminNotification)
    } else {
      const newNotification = {
        user: ticket.member._id,
        title: {
          en: 'Support Replied to your Ticket',
          ar: 'الدعم الفنى وضع رداً على تذكرتك',
        },
        body: {
          en: `Support replied to your ticket with code #${ticket.code}#`,
          ar: `الدعم الفنى وضع ردا على تذكرتك بكود رقم #${ticket.code}#`,
        },
      }

      await Notification.create(newNotification)
    }

    res.send({
      success: true,
      code: 201,
      ticket: ticket._id,
      updatedAt: updatedTicket.updatedAt,
      response: newResponse,
      message: req.t('replay_sent'),
    })
  } catch (error) {
    next(error)
  }
}

export const getTicketInformation = async (req, res, next) => {
  const { id } = req.params

  try {
    const ticket = await Ticket.aggregate([
      {
        $lookup: {
          from: 'users',
          let: { memberId: '$member' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$memberId'] },
              },
            },
            {
              $project: {
                avatar: 1,
                email: {
                  $filter: {
                    input: '$emails',
                    as: 'email',
                    cond: { $eq: ['$$email.isPrimary', true] },
                  },
                },
              },
            },
            {
              $unwind: '$email',
            },
          ],
          as: 'member',
        },
      },
      {
        $unwind: '$member',
      },
      {
        $match: {
          _id: ObjectId(id),
        },
      },
    ])

    if (!ticket) {
      res.status(404)
      throw new Error(req.t('ticket_not_found'))
    }

    res.send({
      success: true,
      code: 200,
      ticket: ticket[0],
    })
  } catch (error) {
    next(error)
  }
}

const sendNotificationToAdminPanel = async (roles, data) => {
  try {
    const users = await User.find({ roles: { $in: roles } })
    const usersIds = users.map((user) => user._id)
    if (usersIds.length) {
      for (const id of usersIds) {
        data.user = id
        const newNotification = new Notification(data)
        await newNotification.save()
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}

function createTicketCode() {
  const randomNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const randomStrings = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ]

  let codeString = ''

  for (let i = 0; i < 6; i++) {
    const num = randomNumbers[Math.floor(Math.random() * randomNumbers.length)]
    const string =
      randomStrings[Math.floor(Math.random() * randomStrings.length)]
    codeString += string + num
  }
  return `TK-${codeString}`
}
