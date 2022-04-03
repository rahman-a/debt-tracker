import {
    addUser, 
    removeUserBySocketId, 
    removeUserById, 
    getUser, 
    getUsers 
} from './chatUsers.js'

const chatFunctions = (io) => {
    io.on('connection', (socket) => {
        socket.on('join', (_id, callback) => {
            addUser({_id, socketId:socket.id})
            io.emit('online', getUsers())
            callback()
        })
    
        socket.on('join-room', ({_id, room}, callback) => {
            socket.join(room)
            addUser({_id, room, socketId:socket.id})
            callback()
        })
    
        socket.on('sendMessage', (message, callback) => {
            
            if(message.isRoom) {
                socket.broadcast.to(message.conversation).emit('getMessage', message)
                callback()
            } else {
                const user = getUser(message.receiver) 
                if(user) {
                  io.to(user.socketId).emit('getMessage', message)
                    callback()
                }
            }
        })
    
        socket.on('inform-message-has-read', (id) => {
            
            const user = getUser(id) 
            if(user) {
                io.to(user.socketId).emit('message-has-read')
            }
        })
    
        socket.on('left', id => {
            removeUserById(id)
            io.emit('online', getUsers())
        })
    
        socket.on('disconnect', _ => {
            removeUserBySocketId(socket.id)
            io.emit('online', getUsers())
        })
    })
}

export default chatFunctions

