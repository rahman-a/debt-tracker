import User from '../models/users.model.js'
import sendEmail from '../emails/email.js'
import Notification from '../models/notifications.model.js'
import {code} from './code.js'
import {labels} from './labels.js'
import {messages} from './messages.js'
import mongoDB from '../../database.connection.js'

mongoDB()

export const takeAction = async (id, state, messageState, report) => {
    const lang = 'en'
    const color = code[state]
    let newNotification = null
    let info = null
    let label = null 
    let message = null
    
    const user = await User.findById(id) 
    if(!user) {
        throw new Error('id passed isn\'t valid at (takeAction Function)')
    }
    
    if(messageState) {
        
        label = labels[messageState] 
        message  = report 
        ? messages[messageState](report) 
        : messages[messageState]

        newNotification = {
            user:user._id, 
            title:label[lang],
            body:message[lang]
        }

        // info = {
        //     name:user.fullNameInEnglish,
        //     email:user.emails.find(email => email.isPrimary === true).email,
        //     message: message[lang],
        //     label:label[lang]
        // }
    }

    if(state === 'green') {
        const isIssuesFound = user.colorCode.state.length
        if(!isIssuesFound) {
            // change color code to green
            user.colorCode.code = color
            await user.save()
            
            if(messageState) {
                
                // sent notification to user
                const notification = new Notification(newNotification)
                await notification.save()
                
                // send email to inform the user
                // await sendEmail(info, 'notice')
            }
        }
    }else {
        if(report) {
            const isReportIssueFound = user.colorCode.state.find(
                st => st.label['en'] ===  label['en'] 
                && st.report.toString() === report.toString()
            )
            if(!isReportIssueFound) {
                
                // change color code and push the message to state
                user.colorCode.code = color
                user.colorCode.state  = user.colorCode.state.concat({label, message, report})
                await user.save()
                
                // sent notification to user
                const notification = new Notification(newNotification)
                await notification.save()
                
                // send email to inform the user
                // await sendEmail(info, 'notice')
            }
        } else {
            const isLabelFound = user.colorCode.state.find(
                st => st.label['en'] === label['en']
            )
            if(!isLabelFound) {
                
                // change color code and push the message to state
                user.colorCode.code = color
                user.colorCode.state = user.colorCode.state.concat({label, message})
                await user.save()
                
                // sent notification to user
                const notification = new Notification(newNotification)
                await notification.save()
                
                 // send email to inform the user
                // await sendEmail(info, 'notice')
            }
        }
    }
}

// takeAction('61e71bab448e1df0b7510f6f', 'yellow', 'payLate', '61f518cdc9940216ba66396a')