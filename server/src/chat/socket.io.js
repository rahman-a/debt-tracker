import mongoose from 'mongoose'
import {
  addUser,
  getUser,
  getUsers,
  removeUserBySocketId,
  //////////
  addChatUser,
  getChatUser,
  getChatUsers,
  removeChatUserById,
} from './chatUsers.js'

const chatFunctions = (io) => {
  io.on('connection', (socket) => {
    ///////////// system users /////////////

    socket.on('join', (id, callback) => {
      addUser({ _id: id, socketId: socket.id })
    })

    ///////////////// chat users /////////////////
    socket.on('join-chat', (_id, callback) => {
      addChatUser({ _id, socketId: socket.id })
      io.emit('online', getChatUsers())
      callback()
    })

    socket.on('join-room', ({ _id, room }, callback) => {
      socket.join(room)
      addChatUser({ _id, room, socketId: socket.id })
      callback()
    })

    socket.on('sendMessage', (message, callback) => {
      if (message.isRoom) {
        socket.broadcast.to(message.conversation).emit('getMessage', message)
        callback()
      } else {
        const user = getChatUser(message.receiver)
        if (user) {
          io.to(user.socketId).emit('getMessage', message)
          callback()
        }
      }
    })

    socket.on('left-chat', (_id, callback) => {
      removeChatUserById(_id)
      io.emit('online', getChatUsers())
      callback()
    })

    socket.on('inform-message-has-read', (id) => {
      const user = getChatUser(id)
      if (user) {
        io.to(user.socketId).emit('message-has-read')
      }
    })

    /////////////// disconnect socket ///////////////
    socket.on('disconnect', (_) => {
      removeUserBySocketId(socket.id)
      io.emit('online', getUsers())
    })
  })

  ////////////////////////////////////////////////////////
  ///////////////  CHANGE STREAM //////////////////

  const connection = mongoose.connection

  connection.once('open', () => {
    const messageStream = connection.collection('messages').watch()
    messageStream.on('change', (change) => {
      if (change.operationType === 'insert') {
        const user = getUser(change.fullDocument.receiver.toString())
        const isUserChatting = getChatUser(
          change.fullDocument.receiver.toString()
        )
        if (!isUserChatting && Boolean(user)) {
          io.to(user.socketId).emit('message-notification', change.fullDocument)
        }
      }
    })
  })
}

export default chatFunctions
