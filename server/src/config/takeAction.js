import User from '../models/users.model.js'
import sendEmail from '../emails/email.js'
import Notification from '../models/notifications.model.js'
import {code} from './code.js'
import {labels} from './labels.js'
import {messages} from './messages.js'
import mongoDB from '../../database.connection.js'

mongoDB()

const takeAction = async (id, state, messageState, report) => {
    const lang = 'en'
    const color = code[state]
    const label = labels[messageState] 
    let message  = report 
    ? messages[messageState](report) 
    : messages[messageState]

    const user = await User.findById(id) 
    if(!user) {
        throw new Error('id passed isn\'t valid at (takeAction Function)')
    }
    console.log({user});
    user.colorCode.code = color 
    user.colorCode.state = report 
    ? user.colorCode.state.concat({label, message, report})
    : user.colorCode.state.concat({label, message})
    
    await user.save()

    const newNotification = {
        user:user._id, 
        title:label,
        body:message[lang]
    }

    const notification = new Notification(newNotification)
    await notification.save()

    const info = {
        email:user.emails.find(email => email.isPrimary === true).email,
        message,
        label
    }

    await sendEmail(info, 'notice')
}

takeAction('61e71bab448e1df0b7510f6f', 'yellow', 'payLate', '61f518cdc9940216ba66396a')
