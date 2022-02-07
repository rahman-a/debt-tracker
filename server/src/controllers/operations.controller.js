import Operation from '../models/operations.model.js'
import Report from '../models/reports.model.js'
import Notification from '../models/notifications.model.js'
import User from '../models/users.model.js'



export const findMutualOperations = async (req, res, next) => {
    const {initiator, peer} = req.params
    try {
        const operations = await Operation.find({
            "initiator.user":initiator, 
            "peer.user":peer, 
            state:'pending'
        })
        res.send({
            success:true,
            code:200,
            operations
        })
    } catch (error) {
        next(error)
    }
}

export const createOperation = async (req, res, next) => {
    const newOperation = new Operation(req.body) 
    try {
        let operation = await newOperation.save()
        operation = await operation.populate('currency', 'name')
        
        const notification = {
            user:operation.peer.user,
            operation:operation._id,
            title:'New Operation new Agent Number 0:0',
            body:`you have been set as (${operation.peer.type}) 
            and the value is (${operation.peer.value}) in (${operation.currency.name}) currency`
        }

        const pushNotification = new Notification(notification)
        await pushNotification.save()

        res.status(201).send({
            success:true,
            code:201,
            id:operation._id,
            message:'Operation has been created'
        })
    } catch (error) {
        next(error)
    }
}

export const listAllOperations = async (req, res, next) => {

    const {
        code,
        name, 
        type,
        value,
        currency, 
        state, 
        dueDate, 
        page, 
        skip, 
    } = req.query
    
    try {
        if(code) {
            const operation = await Operation.findById(code)
            .populate({
                path:'initiator',
                populate:{
                    path:'user',
                    select:'fullNameInEnglish fullNameInArabic avatar'
                }
            }).populate({
                path:'peer',
                populate:{
                    path:'user',
                    select:'fullNameInEnglish fullNameInArabic avatar'
                }
            }).populate('currency', 'name abbr image')

            if(!operation) {
                res.status(404)
                throw new Error('No Operations Found')
            }

            res.send({
                success:true, 
                code:200,
                count:1,
                operations:[operation]
            })

            return 
        }
        
        let searchFilter = {
            $or: [
                {'initiator.user._id': req.user._id},
                {'peer.user._id': req.user._id}
            ],
            state:{$ne:'active'}
        };

        let dueDateFilter = {createdAt:-1}
        
        if(type) {
            searchFilter = {
                ...searchFilter,
                $or: [
                    {
                        "peer.type": type,
                        "peer.user._id":{$ne: req.user._id},
                        "initiator.user._id":req.user._id
                    },
                    {
                        "initiator.type": type,
                        "initiator.user._id":{$ne: req.user._id},
                        "peer.user._id":req.user._id
                    }
                ]
                
            }
        }
        if(state) {
            searchFilter = {
                ...searchFilter,
                state
            }
        }

        if(dueDate) {
            dueDateFilter = {
                dueDate: parseInt(dueDate)
            }
        }
        if(name) {
            searchFilter = {
                ...searchFilter,
                $or: [
                    {
                        'peer.user.fullNameInEnglish' : { $regex:name,  $options:'i'},
                        'initiator.user._id' : req.user._id 
                    },
                    {
                        'initiator.user.fullNameInEnglish' : { $regex:name,  $options:'i'},
                        'peer.user._id' : req.user._id 
                    }
                ]
                
            }
        }
        if(currency){
            searchFilter = {
                ...searchFilter,
                'currency.abbr':currency
            }
        }

        if(value) {
            const values = value.split(':')
            if(values.length === 2) {
                searchFilter = {
                    ...searchFilter, 
                    'peer.value':{
                        $gte:parseInt(values[0]),
                        $lte:parseInt(values[1])
                    }
                }
            }else {
                searchFilter = {
                    ...searchFilter, 
                    'peer.value':parseInt(value)
                }
            }
        }

        const aggregateOptions = [
            // JOIN CURRENCY COLLECTION
            {
                $lookup:{
                    from:'currencies',
                    localField:'currency',
                    foreignField:'_id',
                    as:'currency'
                }
            },
            // JOIN USER COLLECTION ON INITIATOR FIELD
            {
                $lookup:{
                    from:'users',
                    let:{initiatorId:"$initiator.user"},
                    pipeline:[
                        {$match: {
                            $expr:{ $eq:["$_id", "$$initiatorId"]} }
                        },
                        {$project:{
                            fullNameInEnglish:1,
                            fullNameInArabic:1,
                            avatar:1
                        }}
                    ],
                    as:'initiator.user',
                }
            },
            // JOIN USER COLLECTION ON PEER FIELD
            {
                $lookup:{
                    from:'users',
                    let:{peerId:"$peer.user"},
                    pipeline:[
                        {$match: {
                            $expr:{$eq:["$_id", "$$peerId"]},
                        }},
                        {$project:{
                            fullNameInEnglish:1,
                            fullNameInArabic:1,
                            avatar:1
                        }}
                    ],
                    as:'peer.user',
                },
                
                
            },
            {
                $unwind:"$currency"
            },
            {
                $unwind:"$initiator.user"
            },
            {
                $unwind:"$peer.user"
            },
            {
                $match:{ ...searchFilter}
            },
        ]
        
        const operations = await Operation.aggregate([
            ...aggregateOptions,
            {$sort:dueDateFilter},
            {$skip: parseInt(skip) || 0},
            {$limit: parseInt(page) || 5},
        ])

        const documentCount = await Operation.aggregate([
           ...aggregateOptions,
           {$count:"document_count"}
        ])
        
        let count = 0;

        if(documentCount[0]) {
            count =  documentCount[0]['document_count']
        }

        if(operations.length === 0) {
            res.status(404)
            throw new Error('No Operations Found')
        }

        res.send({
            success:true,
            code:200,
            count,
            operations
        })
    } catch (error) {
        next(error)
    }
}

export const getOneOperation = async (req, res, next) => {
    const {id} = req.params 
    try {
        const operation = await Operation.findById(id)
        .populate({
            path:'initiator',
            populate:{
                path:'user',
                select:'fullNameInEnglish avatar colorCode'
            }
        }).populate({
            path:'peer',
            populate:{
                path:'user',
                select:'fullNameInEnglish avatar colorCode'
            }
        }).populate('currency', 'name image abbr')
        
        if(!operation) {
            res.status(404) 
            throw new Error('No Operation Found')
        }
        res.send({
            success:true,
            code:200,
            operation
        })
    } catch (error) {
        next(error)
    }
}

export const updateOperationState = async (req, res, next) => {
    const {state} = req.query 
    const {id, notification} = req.params 
    try {
        const operation = await Operation.findById(id) 
        if(!operation) {
            res.status(404)
            throw new Error('No Operation Found')
        }
        const initiator = await User.findById(operation.initiator.user)
        const peer = await User.findById(operation.peer.user)

        operation.state = state 
        await operation.save() 
        
        const targetedNotification = await Notification.findById(notification)
        targetedNotification.isRead = true 
        await targetedNotification.save()

        if(state === 'active') {
            const reportData = {
                operation:operation._id,
                credit: operation.initiator.type === 'credit'
                ? operation.initiator.value
                : operation.peer.value,
                debt: operation.initiator.type === 'debt'
                ? operation.initiator.value
                : operation.peer.value,
                currency:operation.currency
            }

            if(operation.dueDate) {
                reportData.dueDate = operation.dueDate
            }

            const newReport = new Report(reportData) 
            await newReport.save()
        }

        const notificationData = {
            user:initiator._id,
            operation:operation._id,
            title:state === 'decline' 
            ? 'Operation has been declined' 
            : 'Operation is Active and Running',
            body:`Operation with ${peer.fullNameInEnglish} 
            ${state === 'decline' 
            ? 'has been declined and closed' 
            : 'is Active and moved to Reports Documents'}`
        }

        const pushNotification = new Notification(notificationData)
        await pushNotification.save()

        res.send({
            success:true,
            code:200,
            message:`operation has been set as ${state}`
        })
    } catch (error) {
        next(error)
    }
}