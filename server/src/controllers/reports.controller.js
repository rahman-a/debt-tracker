import Report from '../models/reports.model.js'
import Operation from '../models/operations.model.js'

export const createReport = async (req, res, next) => {
    const {operation} = req.body 

    try {
        const isFound = await Report.findOne({operation})
        if(isFound) {
            res.status(401)
            throw new Error('Report already Exist with this operation')
        }
        const targetedOperation = await Operation.findById(operation)
        if(!targetedOperation) {
            res.status(401)
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


export const listAllReports = async (req, res, next) => {
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
             res.status(401)
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

        const report = await Report.findById(id)
        for(let value in updatedValue) {
            if(value === 'isActive') {
                const reportState = updatedValue['isActive'] === 'true'
                report.isActive = reportState
            }else if(value === 'credit' || value === 'debt'){
                report[value] = parseInt(updatedValue[value])
            }else {
                report[value] = updatedValue[value]
            }
        }

        await report.save()

        res.json({
            success:true,
            code:200,
            message:'report has been updated'
        })
    } catch (error) {
        next(error)
    }
}