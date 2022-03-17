import User from '../models/users.model.js'
import sendEmail from '../emails/email.js'
import Notification from '../models/notifications.model.js'
import {code} from './code.js'
import {labels} from './labels.js'
import {messages} from './messages.js'
import {Database} from '../../database.connection.js'

Database()

export const takeAction = async (id, state, messageState, report, lang) => {
    const color = code[state]
    let newNotification = null
    let adminNotification = null
    let label = null 
    let message = null
    let info = null
    
    const user = await User.findById(id) 
    if(!user) {
        throw new Error('id passed isn\'t valid at (takeAction Function)')
    }
    
    if(messageState) {
        
        label = labels[messageState] 
        message  = report 
        ? messages[messageState](report) 
        : messages[messageState]()
        
        const userInfo = {
            englishName:user.fullNameInEnglish,
            arabicName: user.fullNameInArabic,
            code:user.code
        }
        
        const adminMessage = report 
        ? messages[messageState](report, 'admin', userInfo)
        : messages[messageState]('admin', userInfo)

        newNotification = {
            user:user._id, 
            title:label[lang],
            body:message[lang]
        }

        adminNotification = {
            title:label[lang],
            body:adminMessage[lang]
        }

         info = {
            name:lang === 'en' ? user.fullNameInEnglish : user.fullNameInArabic,
            email:user.emails.find(email => email.isPrimary === true).email,
            message: message[lang],
            label:label[lang]
        }
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
                
                await sendNotificationToAdminPanel(['manager', 'hr'], adminNotification)
                
                // send email to inform the user
                // await sendEmail(info, 'notice')
            }
        }
    }else {
        if(report) {
            const isReportIssueFound = user.colorCode.state.find(
                st => st.label['en'] ===  label['en'] 
                && st.report.toString() === report
            )
            console.log({isReportIssueFound});
            if(!isReportIssueFound) {
                
                // change color code and push the message to state
                user.colorCode.code = color
                user.colorCode.state  = user.colorCode.state.concat({label, message, report})
                await user.save()
                
                // sent notification to user
                const notification = new Notification(newNotification)
                await notification.save()
                
                await sendNotificationToAdminPanel(['manager', 'hr'], adminNotification)

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

                await sendNotificationToAdminPanel(['manager','hr'], adminNotification)
                
                //  send email to inform the user
                await sendEmail(info, 'notice')
            }
        }
    }
}


const sendNotificationToAdminPanel = async (roles, data) => {
    try {
        
        const users = await User.find({roles:{$in:roles}})
        const usersIds = users.map(user => user._id)
        if(usersIds.length) {
            for(const id of usersIds) {
                data.user = id 
                const newNotification = new Notification(data) 
                await newNotification.save()
            }
        }
    } catch (error) {
       throw new Error(error)
    }
}
