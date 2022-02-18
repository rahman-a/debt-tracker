import Ticket from '../models/tickets.model.js'
import ObjectId from 'mongoose/lib/types/objectid.js'

export const createNewTicket = async (req, res, next) => {
    const {title} = req.body 

    try {
        const isFound = await Ticket.findOne({title})
        if(isFound) {
            res.status(401)
            throw new Error('This title already exist, please choose another title')
        }
        const newTicket = new Ticket(req.body)
        newTicket.code = createTicketCode()
        if(req.file) {
            newTicket.file = req.file.filename
        }
        const ticket = await newTicket.save() 
        res.send({
            success:true,
            code:201,
            message:'ticket has been created and sent to support center',
            ticket
        })
    } catch (error) {
        next(error)
    }
}

export const listAllMemberTickets = async (req, res, next) => {
    const {id} = req.params 
    const {title, isOpen,skip, page} = req.query
    
    try {
        let searchFilter = {member:id}
        if(title) {
            searchFilter = {
                ...searchFilter,
                title: {
                    $regex:title,
                    $options:'i'
                }
            }
        }
        if(isOpen){
            const status = isOpen === 'true'
            searchFilter = {
                ...searchFilter,
                isOpen:status
            }
        }
        
        const tickets = await Ticket.find({...searchFilter})
        .sort({createdAt:-1}).limit(parseInt(page) || 10).skip(parseInt(skip) || 0)
        
        if(tickets.length === 0) {
            res.status(404)
            throw new Error('No Tickets Created Yet')
        }
        const count = await Ticket.count({...searchFilter})
        res.send({
            success:true,
            code:200,
            tickets,
            count
        })
    } catch (error) {
        next(error)
    }
}

export const listAllTickets = async (req, res, next) => {
    const {
        title,
        isOpen,
        name,
        email,
        phone,
        code,
        username,
        page,
        skip
    } = req.query

    try {
        let searchFilter = {}
        
        if(title) {
            searchFilter = {
                ...searchFilter,
                title: {
                    $regex:title,
                    $options:'i'
                }
            }
        }

        if(isOpen) {
            const status = isOpen === 'true'
            searchFilter = {
                ...searchFilter,
                isOpen:status
            }
        }

        if(name) {
            searchFilter = {
                ...searchFilter,
                "member.fullNameInEnglish": {
                    $regex:name,
                    $options:'i'
                }
            }
        }
        if(email){
            searchFilter = {
                ...searchFilter,
                "member.email.email":email
            }
        }
        if(phone) {
            searchFilter = {
                ...searchFilter,
                "member.phone.phone":phone
            }
        }
        if(code) {
            searchFilter = {
                ...searchFilter,
                code
            }
        }
        if(username) {
            searchFilter = {
                ...searchFilter,
                "member.username":username
            }
        }
        
        const aggregateOptions = [
            {
                $lookup: {
                    from:'users',
                    let:{memberId:"$member"},
                    pipeline:[
                        {
                            $match: {
                                $expr:{ $eq: ["$_id", "$$memberId"]}
                            }
                        },
                        {
                            $project: {
                                code:1,
                                username:1,
                                fullNameInEnglish:1,
                                fullNameInArabic:1,
                                avatar:1,
                                username:1,
                                email:{
                                  $filter: {
                                    input:"$emails",
                                    as:"email",
                                    cond:{$eq:["$$email.isPrimary", true]}
                                }},
                                phone: {
                                    $filter: {
                                        input:"$insidePhones",
                                        as:"phone",
                                        cond:{$eq:["$$phone.isPrimary", true]}
                                    }
                                }
                            },
                        },
                        {
                            $unwind:"$email",
                        },
                        {
                            $unwind:"$phone"
                        }
                    ],
                    as:"member"
                }
            },
            {
                $unwind:"$member"
            },
            {
                $match: searchFilter
            }
        ]
        
        const tickets = await Ticket.aggregate([
            ...aggregateOptions,
            {$sort:{createdAt:-1}},
            {$skip:parseInt(skip) || 0},
            {$limit:parseInt(page) || 10}
        ])

        
        if(tickets.length === 0) {
            res.status(404)
            throw new Error('No Tickets Listed Yet')
        }
        
        const documentCount = await Ticket.aggregate([
            ...aggregateOptions,
            {$count:'count'},
        ])

        let count = 0;
        
         if(documentCount[0]) {
             count =  documentCount[0]['count']
         }
        res.send({
            success:true,
            code:200,
            count,
            tickets
        })
    } catch (error) {
        next(error)
    }
}

export const updateTicketStatus = async (req, res, next) => {
    const {id} = req.params 

    try {
        const ticket = await Ticket.findById(id) 
        if(!ticket) {
            res.status(404)
            throw new Error('Ticket Not Found') 
        }
        ticket.isOpen = false
        await ticket.save()
        res.send({
            success:true,
            code:200,
            message:'Ticket has marked as closed'
        })
    } catch (error) {
        next(error)
    }
}

export const addTicketResponse = async (req, res, next) => {
    const {id} = req.params 
    const {title, body} = req.body 
    try {
        const ticket = await Ticket.findById(id) 
        if(!ticket) {
            res.status(404)
            throw new Error('Ticket Not Found') 
        } 
        const newResponse = {title, body} 
        if(req.file) {
            newResponse.file = req.file.filename 
        }
        ticket.response = ticket.response.concat(newResponse)
        await ticket.save() 
        
        res.send({
            success:true,
            code:201,
            ticket:ticket._id,
            response:newResponse,
            message:'Reply has been sent'
        })
    } catch (error) {
        next(error)
    }
}

export const getTicketInformation = async (req, res, next) => {
    const {id} = req.params 

    try {
        const ticket = await Ticket.aggregate([
            
            {
                $lookup:{
                    from:'users',
                    let:{memberId:"$member"},
                    pipeline:[
                        {
                            $match:{
                                $expr: {$eq:["$_id", "$$memberId"]}
                            }
                        },
                        {
                            $project:{
                                avatar:1,
                                email:{
                                    $filter:{
                                        input:"$emails",
                                        as:"email",
                                        cond:{$eq:["$$email.isPrimary", true]}
                                    }
                                }
                            }
                        },
                        {
                            $unwind:"$email"
                        }
                    ],
                    as:"member"
                }
            },
            {
                $unwind:"$member"
            },
            {
                $match:{
                    _id:ObjectId(id)
                }
            }
        ])
        
        if(!ticket) {
            res.status(404)
            throw new Error('Ticket Not Found') 
        }

        res.send({
            success:true,
            code:200,
            ticket:ticket[0]
        })
    } catch (error) {
        next(error)
    }
}


function createTicketCode () {
    const randomNumbers = [0,1,2,3,4,5,6,7,8,9]
    const randomStrings = ['A','B','C','D','E','F','G','H','I','J','K',
    'L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    
    let codeString = '';

    for(let i = 0; i < 6; i++) {
       const num = randomNumbers[Math.floor(Math.random() * randomNumbers.length)]
       const string = randomStrings[Math.floor(Math.random() * randomStrings.length)]
       codeString += string + num
    }
    return `TK-${codeString}`
}