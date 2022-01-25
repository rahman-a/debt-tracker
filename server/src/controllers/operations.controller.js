import Operation from '../models/operations.model.js'




export const findMutualOperations = async (req, res, next) => {
    const {initiator, peer} = req.params
    try {
        console.log(initiator, peer);
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
        const operation = await newOperation.save()
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
                res.status(401)
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
            state:{$ne:'active'}
        };

        let dueDateFilter = {createdAt:-1}
        
        if(type) {
            searchFilter = {
                ...searchFilter,
                'peer.type':type
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
                $match:{
                    $or: [
                        {'initiator.user._id': req.user._id},
                        {'peer.user._id': req.user._id}
                    ],
                    ...searchFilter
                }
            },
        ]
        console.log('User Id', req.user._id);
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
            res.status(401)
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
        if(!operation) {
            res.status(401) 
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
    const {id} = req.params 
    try {
        const operation = await Operation.findById(id) 
        if(!operation) {
            res.status(401)
            throw new Error('No Operation Found')
        }
        operation.state = state 
        await operation.save() 
        res.send({
            success:true,
            code:200,
            message:`operation state has updated to ${state}`
        })
    } catch (error) {
        next(error)
    }
}