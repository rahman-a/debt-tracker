import ObjectID from 'bson-objectid'
import User from '../models/users.model.js'
import sendEmail from '../emails/email.js'
import Notification from '../models/notifications.model.js'
import { code } from './code.js'
import { labels } from './labels.js'
import { messages } from './messages.js'
import { Database } from '../../database.connection.js'

Database()

const renderStateMessage = (text) => {
  const regex = /#\S+#/g
  const splittedText = text.split(' ')
  const fullText = []
  splittedText.forEach((tx) => {
    const match = tx.match(regex)
    if (match) {
      const matchText = match[0].split('') /// [#, p, t,t,e,r,n,#]
      const value = matchText.splice(1, matchText.length - 2).join('')
      console.log('is Object Id:', ObjectID.isValid(value))
      if (ObjectID.isValid(value)) {
        fullText.push(
          `<a-href=https://swtle.com/#/reports/active/${value}>${value}</a>`
        )
      } else
        fullText.push(
          `<span-style="border:1px-solid; padding:0-2px; margin:0-2px">${value}</span>`
        )
    } else fullText.push(` ${tx} `)
  })
  return fullText.join('-').replace(/\s/g, '').replace(/-/g, ' ')
}

export const takeAction = async (id, state, messageState, report) => {
  const color = code[state]
  let newNotification = null
  let adminNotification = null
  let label = null
  let message = null
  let info = null

  const user = await User.findById(id)
  if (!user) {
    throw new Error("id passed isn't valid at (takeAction Function)")
  }

  if (messageState) {
    const userInfo = {
      englishName: user.fullNameInEnglish,
      arabicName: user.fullNameInArabic,
      code: user.code,
    }

    label = labels[messageState]
    message = report ? messages[messageState](report) : messages[messageState]()

    const adminMessage = report
      ? messages[messageState](report, 'admin', userInfo)
      : messages[messageState]('admin', userInfo)

    newNotification = {
      user: user._id,
      title: label,
      body: message,
    }

    adminNotification = {
      title: label,
      body: adminMessage,
    }

    info = {
      name: user.fullNameInEnglish,
      email: user.emails.find((email) => email.isPrimary === true).email,
      message: renderStateMessage(message['en']),
      label: label['en'],
    }
  }

  if (state === 'green') {
    const isIssuesFound = user.colorCode.state.length
    if (!isIssuesFound) {
      // change color code to green
      user.colorCode.code = color
      await user.save()

      if (messageState) {
        // sent notification to user
        const notification = new Notification(newNotification)
        await notification.save()

        await sendNotificationToAdminPanel(['manager', 'hr'], adminNotification)

        // send email to inform the user
        await sendEmail(info, 'notice')
      }
    }
  } else {
    if (report) {
      const isReportIssueFound = user.colorCode.state.find(
        (st) =>
          st.label['en'] === label['en'] &&
          st.report.toString() === report.toString()
      )

      if (!isReportIssueFound) {
        // change color code and push the message to state
        user.colorCode.code = color
        user.colorCode.state = user.colorCode.state.concat({
          label,
          message,
          report,
        })
        await user.save()

        // sent notification to user
        const notification = new Notification(newNotification)
        await notification.save()

        await sendNotificationToAdminPanel(['manager', 'hr'], adminNotification)

        // send email to inform the user
        await sendEmail(info, 'notice')
      }
    } else {
      const isLabelFound = user.colorCode.state.find(
        (st) => st.label['en'] === label['en']
      )
      if (!isLabelFound) {
        // change color code and push the message to state #ec4a0d
        if (user.colorCode.code !== '#ec4a0d') {
          user.colorCode.code = color
        }
        user.colorCode.state = user.colorCode.state.concat({ label, message })
        await user.save()

        // sent notification to user
        const notification = new Notification(newNotification)
        await notification.save()

        await sendNotificationToAdminPanel(['manager', 'hr'], adminNotification)

        //  send email to inform the user
        await sendEmail(info, 'notice')
      }
    }
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
