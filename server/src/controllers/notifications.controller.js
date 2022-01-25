import Notification from '../models/notifications.model.js'

export const createNewNotification = async (req, res, next) => {
    const {user, operation}  = req.body
    const newNotification = new Notification(req.body) 

    try {
        const isFound = await Notification.findOne({user, operation, isRead:false})
        if(isFound) {
            res.status(401)
            throw new Error('Notification already has been sent')
        }
        const notification = await newNotification.save()

        res.send({
            success:true,
            code:201,
            id:notification._id,
            message:'Notification has been sent'
        })

    } catch (error) {
        next(error)
    }
}

export const listAllUserNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({user:req.user._id})
        if(notifications.length === 0){
            res.status(401)
            throw new Error('No Notifications Found')
        }
        res.send({
            success:true,
            code:200,
            notifications
        })
    } catch (error) {
        next(error)
    }
}

export const updateNotificationReadState = async (req, res, next) => {
    const {id} = req.params 

    try {
        const notification = await Notification.findById(id)
        if(!notification) {
            res.status(401)
            throw new Error('Notification Not Found')
        }
        notification.isRead = !notification.isRead 
        let message;
        
        if(notification.isRead) {
            message = 'Notification has been set as read'
        }else {
            message = 'Notification has been set as non read'
        }

        await notification.save()
        res.send({
            success:true,
            code:200,
            id:notification._id,
            message
        })

    } catch (error) {
        next(error)
    }
}