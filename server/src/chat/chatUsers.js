const users = []
const chatUsers = []

// user = {_id, room, socketId}

/////////////////////////////////////
/////// USERS FUNCTIONS ////////////

export const addUser = (user) => {
  const _id = user._id.toString()

  const existingUser = users.find((user) => user._id === _id)

  if (existingUser) {
    return
  }

  users.push({ _id, socketId: user.socketId })
  return user
}

export const getUser = (id) => {
  const user = users.find((user) => user._id === id)
  if (!user) return undefined
  return user
}

export const getUsers = () => users.map((user) => user._id)

export const removeUserById = (id) => {
  const idx = users.findIndex((user) => user._id === id)
  if (idx !== -1) {
    users.splice(idx, 1)
    return users
  }
}

export const removeUserBySocketId = (socketId) => {
  const idx = users.findIndex((user) => user.socketId === socketId)
  if (idx !== -1) {
    users.splice(idx, 1)
    return users
  }
}

/////////////////////////////////////
/////// CHAT USERS FUNCTIONS ////////

export const addChatUser = (user) => {
  const _id = user._id.toString()
  const room = user.room && user.room.toString()

  const existingUser = chatUsers.find((user) => user._id === _id)

  if (existingUser) {
    if (user.room) {
      const idx = chatUsers.findIndex((user) => user._id === _id)
      chatUsers.splice(idx, 1, { _id, room, socketId: user.socketId })
      return
    }

    return
  }

  chatUsers.push({ _id, room, socketId: user.socketId })
  return user
}

export const getChatUser = (id) => {
  const user = chatUsers.find((user) => user._id === id)
  if (!user) return undefined
  return user
}

export const removeChatUserById = (id) => {
  const idx = chatUsers.findIndex((user) => user._id === id)
  if (idx !== -1) {
    chatUsers.splice(idx, 1)
    return chatUsers
  }
}

export const removeChatUserBySocketId = (socketId) => {
  const idx = chatUsers.findIndex((user) => user.socketId === socketId)
  if (idx !== -1) {
    chatUsers.splice(idx, 1)
    return chatUsers
  }
}

export const getChatUsers = () => chatUsers.map((user) => user._id)

export const getUsersIdsInRoom = (room) =>
  chatUsers.map((user) => {
    if (user.room === room) return user._id
  })
