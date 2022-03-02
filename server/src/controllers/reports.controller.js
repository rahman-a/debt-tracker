import Report from '../models/reports.model.js'
import Operation from '../models/operations.model.js'
import User from '../models/users.model.js'
import Notification from '../models/notifications.model.js'
import {takeAction} from '../config/takeAction.js'
import {code} from '../config/code.js'
import {DateTime} from 'luxon'
import cron from 'node-cron'

export const createReport = async (req, res, next) => {
    const {operation} = req.body 

    try {
        const isFound = await Report.findOne({operation})
        if(isFound) {
            res.status(400)
            throw new Error('Report already Exist with this operation')
        }
        const targetedOperation = await Operation.findById(operation)
        
        if(!targetedOperation) {
            res.status(404)
            throw new Error('This Operation isn\'t Exist, please choose another operation')
        }
        
        const newReport = {
            operation:targetedOperation._id,
            currency:targetedOperation.currency,
            credit:targetedOperation.initiator.type === 'credit'
                  ? targetedOperation.initiator.value 
                  : targetedOperation.peer.value,
            debt:targetedOperation.initiator.type === 'debt'
                  ? targetedOperation.initiator.value 
                  : targetedOperation.peer.value,
        }

        if(targetedOperation.dueDate) {
            newReport.dueDate = targetedOperation.dueDate
        }

        const report = new Report(newReport) 
        await report.save()
        
        res.status(201).send({
            success:true,
            code:201,
            message:'The Report has been created'
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
        if(code) {
            const report = await Report.findById(code)
            .populate({
                path:'operation',
                populate:{
                    path:'initiator',
                    populate:{
                        path:'user',
                        select:'fullNameInEnglish avatar'
                    }
                },
            })
            .populate({
                path:'operation',
                populate:{
                    path:'peer',
                    populate:{
                        path:'user',
                        select:'fullNameInEnglish avatar'
                    }
                },
            }).populate('currency', 'name abbr image')
            res.send({
                success:true, 
                code:200,
                count:1,
                reports:[report]
            })

            return 
        }

        let searchFilter = {
            $or: [
                {'operation.initiator._id': req.user._id},
                {'operation.peer._id': req.user._id}
            ],
            
            dueDate:{$ne:null},
            isActive:true
        };

        let dueDateFilter = {createdAt:-1}
        
        if(type) {
            searchFilter = {
                ...searchFilter,
                'operation.peer.type':type
            }
        }
        
        if(notDue) {
            searchFilter = {
                ...searchFilter,
                dueDate:{$eq:null}
            }
        }

        if(dueDate) {
            dueDateFilter = {
                dueDate: parseInt(dueDate)
            }
        }

        if(isActive) {
            searchFilter = {
                ...searchFilter,
                isActive:false
            }
            dueDateFilter = {
                paymentDate:-1
            }
        }

        if(name) {
            searchFilter = {
                ...searchFilter,
                $or: [
                    {
                        'operation.peer.fullNameInEnglish' : { $regex:name,  $options:'i'},
                        'operation.initiator._id' : req.user._id 
                    },
                    {
                        'operation.initiator.fullNameInEnglish' : { $regex:name,  $options:'i'},
                        'operation.peer._id' : req.user._id 
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
                    $or:[
                        {
                            credit: {
                                $gte:parseInt(values[0]),
                                $lte:parseInt(values[1])
                            }
                        },
                        {
                            debt:{
                                $gte:parseInt(values[0]),
                                $lte:parseInt(values[1])
                            }
                        }

                    ]
                }
            }else {
                searchFilter = {
                    ...searchFilter, 
                    $or:[
                        {credit:parseInt(values[0])},
                        {debt:parseInt(values[0])}
                    ]
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
            
            {
                $lookup: {
                    from:'operations',
                    let:{ operationId: "$operation"},
                    pipeline:[
                        {
                            $match: { $expr: {$eq:["$_id", "$$operationId"]}}
                        },
                        {
                            $lookup: {
                                from:'users',
                                let:{userId:'$initiator.user', type:"$initiator.type"},
                                pipeline:[
                                    {$match: {$expr:{$eq:["$_id","$$userId"]}}},
                                    {
                                        $project: {
                                            fullNameInEnglish:1,
                                            avatar:1,
                                            type:"$$type"
                                        }
                                    }
                                ],
                                as:"initiator"
                            }
                        },
                        {
                            $lookup: {
                                from:'users',
                                let:{userId:'$peer.user', type:'$peer.type'},
                                pipeline:[
                                    {$match: {$expr:{$eq:["$_id","$$userId"]}}},
                                    {
                                        $project: {
                                            fullNameInEnglish:1,
                                            avatar:1,
                                            type:"$$type"
                                        }
                                    }
                                ],
                                as:"peer"
                            }
                        },
                        {
                            $unwind:"$initiator"
                        },
                        {
                            $unwind:"$peer"
                        },
                        {
                            $project:{
                                "initiator._id":1,
                                "initiator.fullNameInEnglish":1,
                                "initiator.avatar":1,
                                "initiator.type":1,
                                "peer._id":1,
                                "peer.fullNameInEnglish":1,
                                "peer.avatar":1,
                                "peer.type":1,
                                note:1
                            }
                        }
                    ],

                    as: 'operation'
                },
            },
            {
                $unwind:"$currency",
            },
            {
                $unwind:"$operation"
            },
            {
                $match:{...searchFilter}
            },
        ]

        const reports = await Report.aggregate([
            ...aggregateOptions,
            {$sort:dueDateFilter},
            {$skip: parseInt(skip) || 0},
            {$limit: parseInt(page) || 5},
        ])

        const documentCount = await Report.aggregate([
            ...aggregateOptions,
            {$count:"document_count"}
         ])
         
         let count = 0;
 
         if(documentCount[0]) {
             count =  documentCount[0]['document_count']
         }
 
         if(reports.length === 0) {
             res.status(404)
             throw new Error('No Reports Found')
         }

        res.send({
            success:true, 
            code:200,
            count,
            reports
        })

    } catch (error) {
        next(error)
    }
}

export const updateReportValues = async (req, res, next) => {
    const {id} = req.params 
    const updatedValue = req.query
    try {
        console.log(updatedValue);
        const report = await Report.findById(id)
        if(!report) {
            res.status(404)
            throw new Error('No Report Found')
        }
        const allowedProps = ['credit', 'debt', 'dueDate']

        for(let value in updatedValue) {
            if(allowedProps.includes(value)) {
                if(value === 'credit' || value === 'debt'){
                    report[value] = parseInt(updatedValue[value])
                }else {
                    report[value] = updatedValue[value]
                }
            }else  {
                res.status(400)
                throw new Error(`${value} isn't recognized, please choose another one`)
            }
        }

       const savedReport =  await report.save()
       const populatedReport = await Report.findById(savedReport._id).populate({
                path:'operation',
                populate:{
                    path:'initiator',
                    populate:{
                        path:'user',
                        select:'fullNameInEnglish fullNameInArabic type code'
                    }
                },
            })
            .populate({
                path:'operation',
                populate:{
                    path:'peer',
                    populate:{
                        path:'user',
                        select:'fullNameInEnglish fullNameInArabic type code'
                    }
                },
            }).populate('currency', 'name abbr image') 

        res.json({
            success:true,
            code:200,
            report:populatedReport,
            message:'report has been updated'
        })
    } catch (error) {
        next(error)
    }
}

export const closeReportHandler = async(req, res, next) => {
    const {id} = req.params 
    try {
        const report = await Report.findById(id) 
        if(!report) {
            res.status(404)
            throw new Error('No Report Found, make sure report exist')
        }
        if(!report.isActive) {
            res.status(400)
            throw new Error('Operation Already Closed')
        }
        const operation = await Operation.findById(report.operation)
        const userId = operation.initiator.type === 'debt'
                      ? operation.initiator.user 
                      : operation.peer.user  
        const debtor = await User.findById(userId)
        if(!debtor) {
            res.status(404)
            throw new Error('The Debtor may be deleted or not found')
        }

        const color = debtor.colorCode.code 

        if(color === code['green']) {
            report.isActive = false 
            report.paymentDate = new Date()
            await report.save()
            res.send({
                success:true,
                code:200,
                message:'Report has been closed'
            })
            
            return
        }

        if(color === code['yellow']) {
            report.isActive = false 
            report.paymentDate = new Date()
            await report.save()

            debtor.colorCode.state =  debtor.colorCode.state.filter(
                st => st.report.toString() !== report._id.toString()
            )
            await debtor.save()
            await takeAction(debtor._id, 'green', 'doneLatePayment', report._id)
            res.send({
                success:true,
                code:200,
                message:'Report has been closed'
            })
            return
        }   

        if(color === code['red']) {
            console.log(color, code['red']);

            report.isActive = false 
            report.paymentDate = new Date()
            const waitingPeriod = DateTime.now().setZone('Asia/Dubai').plus({months:1}).toISO()
            report.waitingForClear = waitingPeriod
            await report.save()

            debtor.colorCode.state =  debtor.colorCode.state.filter(
                st => st.report.toString() !== report._id.toString()
            )
            await debtor.save()
            await takeAction(debtor._id, 'yellow', 'doneExpiredPayment', report._id)
            res.send({
                success:true,
                code:200,
                message:'Report has been closed'
            })
            return
        }

    } catch (error) {
        next(error)
    }
}

export const requestDueDateChange = async (req, res, next) => {
    const {id} = req.params 
    const {date} = req.body 
    console.log({id});
    console.log({date});
    try {
        const report = await Report.findById(id) 
        
        if(!report) {
            res.status(404)
            throw new Error('No Report Found to Change')
        }
        
        const operation = await Operation.findById(report.operation) 
        if(!operation) {
            res.status(404)
            throw new Error('No Operation connected to this report')
        }
        
        const creditUser = operation.initiator.type === 'credit' 
        ? operation.initiator.user
        : operation.peer.user
        if(req.user._id.toString() !== creditUser.toString()) {
            res.status(401)
            throw new Error('you must be credit to request due date change')
        }
        
        const debtUser = operation.initiator.type === 'debt' 
        ? operation.initiator.user
        : operation.peer.user
        
        const userData = await User.findById(creditUser)
        
        const notificationData = {
            user:debtUser,
            title:'Request Due Date Change',
            body:`${userData.fullNameInEnglish} change Dua Date of report #{{${id}}} to ${new Date(date).toDateString()}`,
            report:id,
            payload:{
                date,
                name:userData.fullNameInEnglish
            }
        }

        const newNotification = new Notification(notificationData)
        await newNotification.save()

        res.send({
            success:true, 
            code:200,
            message:'Change has been requested and waiting for debtor approve'
        })

    } catch (error) {
        next(error)
    }
}


export const approveDueDateChange = async (req, res, next) => {
    const {id} = req.params 
    const {date} = req.body 

    try {
        const report = await Report.findById(id) 
        if(!report) {
            res.status(404)
            throw new Error('No Report Found to Change')
        }
        
        const operation = await Operation.findById(report.operation) 
        if(!operation) {
            res.status(404)
            throw new Error('No Operation connected to this report')
        }
        
        const debtUser = operation.initiator.type === 'debt' 
        ? operation.initiator.user
        : operation.peer.user
        
        if(req.user._id.toString() !== debtUser.toString()) {
            res.status(401)
            throw new Error('you must be debtor to approve this change')
        }
        
        const creditUser = operation.initiator.type === 'credit' 
        ? operation.initiator.user
        : operation.peer.user
        
        const userData = await User.findById(debtUser)
        
        report.dueDate = new Date(date) 
        await report.save() 
        
        
        const notificationData = {
            user:creditUser,
            title:'Request Due Date Change',
            body:`${userData.fullNameInEnglish} approve the due Date Change of report #{{${id}}}`,
        }

        const newNotification = new Notification(notificationData)
        await newNotification.save()
        
        res.send({
            success:true,
            code:200,
            message:'Due Date has Changed Successfully'
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
        page
    } = req.query
    try {
        if(code) {
            const report = await Report.findById(code)
            .populate({
                path:'operation',
                populate:{
                    path:'initiator',
                    populate:{
                        path:'user',
                        select:'fullNameInEnglish fullNameInArabic type code'
                    }
                },
            })
            .populate({
                path:'operation',
                populate:{
                    path:'peer',
                    populate:{
                        path:'user',
                        select:'fullNameInEnglish fullNameInArabic type code'
                    }
                },
            }).populate('currency', 'name abbr image')
            
            res.send({
                success:true, 
                code:200,
                count:1,
                reports:[report]
            })

            return 
        }

        let searchFilter = {}
        let dueFilter = {createdAt:-1}
        
        if(isActive) {
            const active = isActive === 'true'
            
            if(active) { 
                searchFilter = {
                    ...searchFilter,
                    isActive:true
                }
            } else {
                searchFilter = {
                    ...searchFilter,
                    isActive:false
                } 
                dueFilter = {paymentDate:-1}
            }
            
        }
        
        // sort document according to 
        //  if operation has due date or not
        if(isDue) {
            const due = isDue === 'true'
            if(due) {
                searchFilter = {
                    ...searchFilter,
                    dueDate: {$ne:null}
                }
                dueFilter = {dueDate:-1}
            }else {
                searchFilter = {
                    ...searchFilter,
                    dueDate: {$eq:null}
                }
            }
        }

        if(paymentDate) {
            const date = new Date(paymentDate)
            date.setDate(date.getDate() + 1)
            
            searchFilter = {
                ...searchFilter,
                dueDate : {
                    $gte:new Date(paymentDate),
                    $lte: new Date(date)
                }
            }
        }
        
        if(arabicName) {
            searchFilter = {
                ...searchFilter,
                $or:[
                    {"operation.initiator.fullNameInArabic":{$regex:arabicName, $options:'i'}},
                    {"operation.peer.fullNameInArabic":{$regex:arabicName, $options:'i'}},
                ]
            }
        }
        if(englishName) {
            searchFilter = {
                ...searchFilter,
                $or:[
                    {"operation.initiator.fullNameInEnglish":{$regex:englishName, $options:'i'}},
                    {"operation.peer.fullNameInEnglish":{$regex:englishName, $options:'i'}},
                ]
            }
        }
        if(currency) {
            searchFilter = {
                ...searchFilter,
                "currency.abbr": currency
            }
        }

        if(dueDate) {
            const date = new Date(dueDate)
            date.setDate(date.getDate() + 1)
            
            searchFilter = {
                ...searchFilter,
                dueDate : {
                    $gte:new Date(dueDate),
                    $lte: new Date(date)
                }
            }
        }

        if(value) {
            const values = value.split(':')
            if(values.length === 2) {
                searchFilter = {
                    ...searchFilter, 
                    $or: [
                        {
                            credit:{
                                $gte:parseInt(values[0]),
                                $lte:parseInt(values[1])
                            }
                        },
                        {
                            debt:{
                                $gte:parseInt(values[0]),
                                $lte:parseInt(values[1])
                            }
                        }
                    ],
                    
                }
            }else {
                searchFilter = {
                    ...searchFilter, 
                    $or: [
                        {credit: parseInt(values[0])},
                        {debt:parseInt(values[0])}
                    ],
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
            
            {
                $lookup: {
                    from:'operations',
                    let:{ operationId: "$operation"},
                    pipeline:[
                        {
                            $match: { $expr: {$eq:["$_id", "$$operationId"]}}
                        },
                        {
                            $lookup: {
                                from:'users',
                                let:{userId:'$initiator.user', type:"$initiator.type"},
                                pipeline:[
                                    {$match: {$expr:{$eq:["$_id","$$userId"]}}},
                                    {
                                        $project: {
                                            fullNameInEnglish:1,
                                            fullNameInArabic:1,
                                            code:1,
                                            type:"$$type"
                                        }
                                    }
                                ],
                                as:"initiator"
                            }
                        },
                        {
                            $lookup: {
                                from:'users',
                                let:{userId:'$peer.user', type:'$peer.type'},
                                pipeline:[
                                    {$match: {$expr:{$eq:["$_id","$$userId"]}}},
                                    {
                                        $project: {
                                            fullNameInEnglish:1,
                                            fullNameInArabic:1,
                                            code:1,
                                            type:"$$type"
                                        }
                                    }
                                ],
                                as:"peer"
                            }
                        },
                        {
                            $unwind:"$initiator"
                        },
                        {
                            $unwind:"$peer"
                        },
                        {
                            $project:{
                                "initiator._id":1,
                                "initiator.fullNameInEnglish":1,
                                "initiator.fullNameInArabic":1,
                                "initiator.code":1,
                                "initiator.type":1,
                                "peer._id":1,
                                "peer.fullNameInEnglish":1,
                                "peer.fullNameInArabic":1,
                                "peer.code":1,
                                "peer.type":1,
                                note:1,
                                createdAt:1
                            }
                        }
                    ],

                    as: 'operation'
                },
            },
            {
                $unwind:"$currency",
            },
            {
                $unwind:"$operation"
            },
            {
                $match:{...searchFilter}
            },
        ]

        const reports = await Report.aggregate([
            ...aggregateOptions,
            {$sort:dueFilter},
            {$skip: parseInt(skip) || 0},
            {$limit: parseInt(page) || 5},
        ])

        const documentCount = await Report.aggregate([
            ...aggregateOptions,
            {$count:"document_count"}
         ])
         
         let count = 0;
 
         if(documentCount[0]) {
             count =  documentCount[0]['document_count']
         }
 
         if(reports.length === 0) {
             res.status(404)
             throw new Error('No Reports Found')
         }

        res.send({
            success:true, 
            code:200,
            count,
            reports
        })

    } catch (error) {
        next(error)
    }
}





const scanReportsDueDate = async () => {
    let date = DateTime.now().setZone('Africa/Cairo').toLocaleString(DateTime.DATETIME_MED)
    console.log(`Start Reports Scanning.... at ${date}`);
    try {
                
        const reports = await Report.find({
            isActive:true,
            dueDate:{$exists:true},
            dueDate:{$lte:new Date()}
        })
        
        if(reports.length) {

            const now = DateTime.now().setZone('Asia/Dubai').ts 
            
            for(const report of reports) {
                const dueDateObject = new Date(report.dueDate)
                const dueDate = DateTime.fromJSDate(dueDateObject).setZone('Asia/Dubai').ts 
                const weekAfterDueDate = DateTime.fromJSDate(dueDateObject).setZone('Asia/Dubai').plus({days:7}).ts
                
                if(now > dueDate && report.isActive) {
                    const operation = await Operation.findById(report.operation)
                    const userId = operation.initiator.type === 'debt'
                                  ? operation.initiator.user 
                                  : operation.peer.user  
                    const debtor = await User.findById(userId)
                    if(debtor) {

                        if( now <= weekAfterDueDate) {
                            await takeAction(debtor._id, 'yellow', 'payLate', report._id)
                        }else {
                            debtor.colorCode.state = debtor.colorCode.state.filter(
                                st => st.report?.toString() !== report._id.toString()
                            )
                            await debtor.save()
                            await takeAction(debtor._id, 'red', 'payExpired', report._id)
                        }
                    }
                }
            }
        }
        const waitingReports = await Report.find({
            waitingForClear:{$exists:true},
            waitingForClear:{$lte:new Date()}
        })
        if(waitingReports.length) {
            
            const now = DateTime.now().setZone('Asia/Dubai').ts 

            for(const report of waitingReports) {
                const dateObject = new Date(report.waitingForClear)
                const waitingTime = DateTime.fromJSDate(dateObject).setZone('Asia/Dubai').ts 
                if(now >= waitingTime) {
                    // unset waitingForClear Field
                    report.waitingForClear = undefined 
                    await report.save()
                    
                    // locate debtor user
                    const operation = await Operation.findById(report.operation)
                    const userId = operation.initiator.type === 'debt'
                    ? operation.initiator.user 
                    : operation.peer.user  
                    const debtor = await User.findById(userId)
                    if(debtor) {

                        // remove late payment from state
                        debtor.colorCode.state = debtor.colorCode.state.filter(
                            st => st.report?.toString() !== report._id.toString()
                        )
                        await debtor.save()
                        await takeAction(debtor._id, 'green', 'clear', report._id)
                    }
                    
                }
            }
        }
        date = DateTime.now().setZone('Africa/Cairo').toLocaleString(DateTime.DATETIME_MED)
        console.log(`Done Reports Scanning!!!! at ${date}`);
    } catch (error) {
        date = DateTime.now().setZone('Africa/Cairo').toLocaleString(DateTime.DATETIME_MED)
        console.log(error);
        console.error("\x1b[31m", `Done Reports Scanning!!!! at ${date} with ERROR: ${error.message}`);
    }
}


cron.schedule('* 8 * * *', scanReportsDueDate, {
    timezone:'Asia/Dubai'
})
