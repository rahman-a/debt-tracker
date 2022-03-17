import path from 'path'
import {fileURLToPath} from 'url'
import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'
import User from '../models/users.model.js'
import ObjectId from 'mongoose/lib/types/objectid.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url)) 

// Conversation Endpoints

export const createConversation = async (req, res, next) => {
    const {peerId} = req.body 
    const lang = req.headers['accept-language']
    try {
        const members = [req.user._id, peerId]
        const newConversation = new Conversation({members}) 
        const conversation =  await newConversation.save()
        await conversation.populate({
            path:'members',
            select:lang === 'ar' ? 'fullNameInArabic avatar' : 'fullNameInEnglish avatar'
        })
        
        res.status(201).send({
            code:201,
            success:true,
            conversation
        })
    } catch (error) {
        next(error)
    }
}


export const createConversationRoom = async (req, res, next) => {
    const {members, name} = req.body 

    try {
        
        let selectedMembers = [];

        if(req.body.members) {
            selectedMembers = members.split(',')
        }


        if(!selectedMembers || selectedMembers.length < 2) {
            res.status(400)
            throw new Error(req.t('room_require_at_least_two'))
        }

        if(!(selectedMembers.includes(req.user._id))) {
            selectedMembers.push(req.user._id)
        }

        if(!name) {
            res.status(400)
            throw new Error(req.t('set_name_for_room'))
        }

        const newRoom = new Conversation({
            members:selectedMembers,
            name,
            isRoom:true
        })
       
        if(req.file) newRoom.image = req.file.filename

        const room = await newRoom.save()

        res.status(201).send({
            success:true,
            code:201,
            id:room._id,
            room,
            message:req.t('room_created')
        })
    } catch (error) {
        next(error)
    }
}


export const removeConversationRoom = async (req, res, next) => {
    const {id} = req.params 

    try {
        const room = await Conversation.findById(id) 
        if(!room) {
            res.status(404)
            throw new Error(req.t('room_not_found_already'))
        }

       const updatedRoom =  await room.remove()
        res.send({
            success:true,
            code:200,
            _id:updatedRoom._id,
            message:req.t('room_removed')
        })
    } catch (error) {
        next(error)
    }
}

export const listUserConversation = async (req, res, next) => {
    try {
        
        const conversations = await Conversation.find({members:{$in:req.user._id}})
        .populate({
            path:'members',
            select:'fullNameInArabic fullNameInEnglish avatar'
        })
        .populate('lastMessage', 'type content')
        .sort({updatedAt:-1})

        if(conversations.length === 0) {
            res.status(404)
            throw new Error('No Active Chat')
        }

        res.send({
            code:200,
            success:true,
            conversations
        })
    } catch (error) {
        next(error)
    }
}


export const updateConversation  = async (req, res, next) => {
    const {id} = req.params
    const {name, members} = req.body 
    const lang =req.headers['accept-language']
    try {
        const room = await Conversation.findById(id) 
        
        if(!room) {
            res.status(404)
            throw new Error(req.t('room_not_found_already'))
        }

        if(members) {
            const selectedMembers = members.split(',')
            if(!(selectedMembers.includes(req.user._id))) {
                selectedMembers.push(req.user._id)
            }
            room.members = selectedMembers
        }

        if(name) room.name = name
    
        if(req.file) room.image = req.file.filename

        const updatedRoom =  await room.save()
        
        Conversation.populate(
            updatedRoom, 
            {
                path:'members',
                select:'fullNameInArabic fullNameInEnglish avatar'
            }, 
            (error, room) => {
                if(error) throw new Error(error)
                res.send({
                    code:200,
                    success:true,
                    room,
                    message:req.t('room_updated')
                })
        })
        
    } catch (error) {
        next(error)
    }
}

// Messages Endpoints

export const createMessage = async (req, res, next) => {
    
    const {conversationId} = req.params
    const {content, type} = req.body 

    try {
        let messageContent = null

        if(type === 'text') {
            messageContent =   await Message.create({
                content, 
                sender:req.user._id,
                type,
                conversation:conversationId
            })
        }else {
            messageContent =  await Message.create({
                content:req.file.filename,
                type, 
                sender:req.user._id,
                conversation:conversationId
            })
        }

        const conversation = await Conversation.findById(conversationId)
        conversation.lastMessage = messageContent._id
        await conversation.save()

        res.status(201).send({
            _id:messageContent._id,
            content:messageContent.content,
            code:201,
            success:true
        })
    } catch (error) {
        next(error)
    }
}

export const markMessageAsReceived = async (req, res, next) => {
    console.log('Mark Message...?!!!');
    const {id} = req.params 
    const {conversation, sender} = req.body
    const {isBulk} = req.query
    try {
        if(isBulk) {
            await Message.updateMany({conversation, sender}, {isReceived:true})
            res.send({
                success:true,
                code:200
            })
            return
        }
        const message = await Message.findById(id) 
        if(!message) {
            res.status(404)
            throw new Error('Message Not Exist')
        }
        message.isReceived = true 

        await message.save()

        res.send({
            success:true,
            code:200
        })
    } catch (error) {
        next(error)
    }
}

export const listConversationMessages = async (req, res, next) => {
    const {conversationId} = req.params 
    const lang = req.headers['accept-language']

  
    try {
        let conversation_id = conversationId
        let createdConversation = null
        // when search for members that doesn't have mutual conversation 
        //  in that case the conversation id represent member id
        // and create new one
        
        // check if conversationId is conversation or just member id
        const conversationIsFound = await Conversation.findById(conversationId)
        if(!conversationIsFound) {
            const mutualConversation = await Conversation.findOne({
                members:{$all:[req.user._id, conversationId]}, 
                isRoom:false
            })
            if(mutualConversation) {
                conversation_id = mutualConversation._id
            } else {
                const newConversation = {
                    members : [req.user._id, conversationId]
                }
                createdConversation =  await Conversation.create(newConversation)
            }
        }
        const messages = await Message.find({conversation:conversation_id})
        .populate({
            path:'sender',
            select:lang === 'ar' ? 'fullNameInArabic avatar' : 'fullNameInEnglish avatar'
        })

        let metadata = {}
        if(createdConversation) {
                const userId = createdConversation.members.find(user => user.toString() !== req.user._id.toString())
                const user = await User.findById(userId)
                metadata._id = user._id,
                metadata.name = lang === 'ar' ? user.fullNameInArabic  : user.fullNameInEnglish 
                metadata.image = user.avatar,
                metadata.conversation = conversation_id
        } else {
            const conversation = await Conversation.findById(conversation_id)
            .populate({
                path:'members',
                select: lang === 'ar' 
                ? 'fullNameInArabic avatar' 
                : 'fullNameInEnglish avatar'
            })

            if(conversation.isRoom) {
                metadata.name = conversation.name 
                metadata.image = conversation.image,
                metadata.conversation = conversation_id
                metadata.isRoom = conversation.isRoom
                metadata.members = conversation.members.map(member => ({
                    _id:member._id,
                    label: lang === 'ar' ? member.fullNameInArabic : member.fullNameInEnglish,
                    image:member.avatar
                }))
            }else {
                const user = conversation.members.find(user => user._id.toString() !== req.user._id.toString())
                metadata._id = user._id,
                metadata.name = lang === 'ar' ? user.fullNameInArabic  : user.fullNameInEnglish 
                metadata.image = user.avatar,
                metadata.conversation = conversation_id
            }
        }

        res.send({
            code:200,
            success:true,
            conversation:{messages, metadata}
        })
    } catch (error) {
        next(error)
    }
}


export const findConversationsByName = async (req, res, next) => {
    const {search, isMembers} = req.query 
    
    const lang = req.headers['accept-language']
    try {
        const searchFilter = {      
            $or:[
                {fullNameInEnglish:{
                    $regex:search,
                    $options:'i'
                }},
                {fullNameInArabic:{
                    $regex:search,
                    $options:'i'
                }}
            ]
        }
        const users = await User.find(searchFilter) 

        const newUsers = users.map(user => {
            return {
                _id:user._id,
                name:lang === 'ar' ? user.fullNameInArabic : user.fullNameInEnglish,
                image:user.avatar
            }
        })

        const roomFilter = {
            name:{
                $regex:search,
                $options:'i'
            },
            isRoom:true
        }

        const rooms = await Conversation.find(roomFilter) 

        let newRooms = []

        if(!isMembers) {
            
            newRooms = rooms.map(room => {
                return {
                    _id:room._id,
                    name:room.name,
                    image:room.image,
                    updatedAt:room.updatedAt,
                    lastMessage:room.lastMessage,
                    isRoom:true
                }
            })
        }

        const output = [...newUsers, ...newRooms]
        
        
        if(output.length === 0) {
            res.status(404)
            throw new Error(req.t('no_match'))
        }
        
        res.send({
            success:true,
            code:200,
            output
        })
    } catch (error) {
        next(error)
    }
}


export const listLatestMessage = async (req, res, next) => {
    const lang = req.headers['accept-language']
    try {
        const allNonReceivedMessage = []
        // get all user conversation
        const conversations = await Conversation.find({members:{$in:[req.user._id]}})
        .sort({updatedAt:-1}).limit(20)
        // loop through all conversations
        for(const conversation of conversations) {
            // check if conversation has last message or not
            if(conversation.lastMessage) {
                // get the last message sent document
                const message = await Message.findById(conversation.lastMessage)
                .populate('sender', 'fullNameInArabic fullNameInEnglish')
                // check who send the message
                // if it sent by user ==> do nothing
                if(message && message.sender._id.toString() !== req.user._id.toString()) {
                    // if sent by peer ===> check 
                    // if received ==> do nothing
                    if(!(message.isReceived)) {
                        //  if not received ==> sent notification
                        allNonReceivedMessage.push({
                            conversation:conversation._id,
                            message:message._id,
                            title:`New Message from ${lang === 'ar'  
                            ? message.sender.fullNameInArabic : message.sender.fullNameInEnglish}`,
                            body:message.content,
                            isRead:message.isReceived,
                            createdAt:message.createdAt
                        })
                    }

                }
            }
        }

        res.send({
            success:true,
            code:200,
            count:allNonReceivedMessage.length,
            messages:allNonReceivedMessage
        })

    } catch (error) {
        next(error)
    }
}