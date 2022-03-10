import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'
import User from '../models/users.model.js'
import ObjectId from 'mongoose/lib/types/objectid.js'

// Conversation Endpoints

export const createConversation = async (req, res, next) => {
    const {peerId} = req.body 

    try {
        const members = [req.user._id, peerId]
        const newConversation = new Conversation({members}) 
        const conversation =  await newConversation.save()
        await conversation.populate('members', 'fullNameInEnglish avatar')
        
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
        if(!members || members.length < 2) {
            res.status(400)
            throw new Error(req.t('room_require_at_least_two'))
        }

        const newMembers = [...members, req.user._id]

        if(!name) {
            res.status(400)
            throw new Error(req.t('set_name_for_room'))
        }

        const newRoom = new Conversation({
            members:newMembers,
            name,
            isRoom:true
        })

        if(req.file) {
            newRoom.image.data = req.file.buffer
            newRoom.image.mimeType = req.file.mimetype
        }

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
        
        const conversations = await Conversation.find({members:{$in:req.user._id}, isRoom:false})
        .populate('members', 'fullNameInEnglish avatar')

        const rooms = await Conversation.find({members:{$in:req.user._id}, isRoom:true})
        
        res.send({
            code:200,
            success:true,
            conversations:[...conversations, ...rooms]
        })
    } catch (error) {
        next(error)
    }
}


export const updateConversation  = async (req, res, next) => {
    const {id} = req.params
    const {name} = req.body 

    try {
        const room = await Conversation.findById(id) 
        
        if(!room) {
            res.status(404)
            throw new Error(req.t('room_not_found_already'))
        }

        if(name) room.name = name
    
        if(req.file) {
            room.image.data = req.file.buffer
            room.image.mimeType = req.file.mimetype
        }

       const updatedRoom =  await room.save()

        res.send({
            code:200,
            success:true,
            room:updatedRoom,
            message:req.t('room_updated')
        })

    } catch (error) {
        next(error)
    }
}

export const addMemberToRoom  = async (req, res, next) => {
    const {id} = req.params
    const {member} = req.body 

    try {
        const room = await Conversation.findById(id) 
        
        if(!room) {
            res.status(404)
            throw new Error(req.t('room_not_found_already'))
        }

        if(!member) {
            res.status(404)
            throw new Error(req.t('select_member_add_to_room'))
        }
        
        if(room.members.some(m => m.toString() === member)) {
            res.status(404)
            throw new Error(req.t('member_already_exist'))
        }
        
        room.members = [...room.members, member]

        await room.save()

        res.send({
            code:200,
            success:true,
            message:req.t('member_added')
        })

    } catch (error) {
        next(error)
    }
}

export const removeMemberFromRoom  = async (req, res, next) => {
    const {id} = req.params
    const {member} = req.body 

    try {
        const room = await Conversation.findById(id) 
        
        if(!room) {
            res.status(404)
            throw new Error(req.t('room_not_found'))
        }

        if(!member) {
            res.status(404)
            throw new Error(req.t('select_member_to_remove'))
        }
        
        if(!(room.members.some(m => m.toString() === member))) {
            res.status(404)
            throw new Error(req.t('member_not_found_in_room'))
        }
 
        room.members = room.members.filter(m => m.toString() !== member)

        await room.save()

        res.send({
            code:200,
            success:true,
            message:req.t('member_removed')
        })

    } catch (error) {
        next(error)
    }
}

// Messages Endpoints

export const createMessage = async (req, res, next) => {
    
    const {conversationId} = req.params
    const {message, type} = req.body 

    try {
        let message = null
        if(type === 'text') {
            message =   await Message.create({
                text:message, 
                sender:req.user._id,
                conversation:conversationId
            })
        }

        if(type === 'file' && req.file) {
            message =  await Message.create({
                file:req.file.filename, 
                sender:req.user._id,
                conversation:conversationId
            })
        }

        if(type === 'image' && req.file) {
            message =  await Message.create({
                image:req.file.filename, 
                sender:req.user._id,
                conversation:conversationId
            })
        }

        if(type === 'audio' && req.file) {
            message =   await Message.create({
                audio:req.file.filename, 
                sender:req.user._id,
                conversation:conversationId
            })
        }

        res.status(201).send({
            code:201,
            success:true,
            message
        })

    } catch (error) {
        next(error)
    }
}

export const listConversationMessages = async (req, res, next) => {
    const {conversationId} = req.params 

    try {
        const messages = await Message.find({conversation:conversationId}) 

        res.send({
            code:200,
            success:true,
            messages
        })
    } catch (error) {
        next(error)
    }
}


export const findConversationsByName = async (req, res, next) => {
    const {search} = req.query 
    console.log({search});
    try {
        const searchFilter = {
            fullNameInEnglish:{
                $regex:search,
                $options:'i'
            }
        }
        const users = await User.find(searchFilter) 

        const newUsers = users.map(user => {
            return {
                name:user.fullNameInEnglish,
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

        const newRooms = rooms.map(room => {
            return {
                name:room.name,
                image:room.image,
                isRoom:true
            }
        })

        const output = [...newUsers, ...newRooms]

        res.send({
            success:true,
            code:200,
            output
        })
    } catch (error) {
        next(error)
    }
}