import Notification from '../models/notifications.model.js'

export const createNewNotification = async (req, res, next) => {
    const {user, operation}  = req.body
    const newNotification = new Notification(req.body) 

    try {
        const isFound = await Notification.findOne({user, operation, isRead:false})
        if(isFound) {
            res.status(400)
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
    
    const {skip, state} = req.query
    
    let searchFilter = {'user._id':req.user._id}
    
    if(state) {
        searchFilter = {...searchFilter, 'operation.state': state}
    }
    
    try {
        
        const aggregateOptions = [
            {
                $lookup: {
                    from:'users',
                    let:{userId: '$user'},
                    pipeline:[
                        {$match : {$expr : {$eq: ['$_id', '$$userId' ]}} },
                        {
                            $project: {avatar:1}
                        }
                    ],
                    as: 'user'
                }
            },

            {
                $lookup: {
                    from:'operations',
                    let:{operationId: '$operation'},
                    pipeline:[
                        {$match : {$expr : {$eq: ['$_id', '$$operationId' ]}} },
                        {
                            $project: {state:1}
                        }
                    ],
                    as: 'operation'
                }
            },
            {
                $unwind:'$user'
            },

            {
                $unwind:"$operation"
            }, 
            {
                $match:{...searchFilter}
            }
        ]
        
        let notifications = await Notification.aggregate([
            ...aggregateOptions,
            {$sort:{createdAt:-1}},
            {$sort:{isRead:1}},
            {$skip: parseInt(skip) || 0 },
            {$limit: 5}
        ])

        if(!state) {
            let notificationsWithoutOperation = await Notification.find({
                user:req.user._id,
                operation: {$exists:false}
            })
            .skip(parseInt(skip) || 0)
            .limit(5)
            .sort({createdAt:-1})

            notifications = notificationsWithoutOperation.length
            ? [...notificationsWithoutOperation, ...notifications]
            : notifications
        }

        if(notifications.length > 0) {

            for(const notification of notifications) {
                if(!notification.isSent) {
                    const targetedNotification = await Notification.findById(notification._id) 
                    targetedNotification.isSent = true 
                    await targetedNotification.save()
                }
            }
        }


        const documentCount = await Notification.aggregate([
            ...aggregateOptions,
            {$count:"document_count"}
         ])
         
         let count = 0;
 
         if(documentCount[0]) {
             count =  documentCount[0]['document_count']
         }
        if(!state) {
            const countWithoutOperation = await Notification.count({
                user:req.user._id,
                operation: {$exists:false}
            })
    
            count += countWithoutOperation
        }

        const countNonRead = await Notification.count({user:req.user._id, isRead:false})
 
    
        if(notifications.length === 0){
            res.status(404)
            throw new Error('No Notifications Found')
        }
        
        res.send({
            success:true,
            code:200,
            count,
            countNonRead,
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
            res.status(404)
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
            isRead:notification.isRead,
            id:notification._id,
            message
        })

    } catch (error) {
        next(error)
    }
}

export const pushNotificationToClient = async (req, res, next) => {
    try {
        const notifications = await Notification.find({user:req.user._id, isSent:false})
        .populate('user', 'avatar')
        .sort({createdAt:-1})
        
        if(notifications.length) {
            for(let notification of notifications) {
                notification.isSent = true 
                await notification.save()
            }
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