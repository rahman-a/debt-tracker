const users = []

// user = {_id, room, socketId}

export const addUser = (user) => {
    const _id = user._id.toString()
    const room = user.room && user.room.toString();
 
    const existingUser = users.find((user) => user._id === _id);
        
    if(existingUser) {
        
        if(user.room) {
           const idx  = users.findIndex(user => user._id === _id)
           users.splice(idx,1, {_id, room, socketId:user.socketId});
           return
        }       
        
        return{error: "Username is taken"};
    } 
    
    users.push({_id, room, socketId:user.socketId});
    return user;
}

export const getUser = (id) => {
    const user = users.find(user => user._id === id)
    if(!user) return undefined
    return user 
}

export const removeUserById = (id) =>{
    const idx  = users.findIndex(user => user._id === id)
    if(idx !== -1) {
        users.splice(idx,1);
        return users
    }
} 

export const removeUserBySocketId = (socketId) =>{
    const idx  = users.findIndex(user => user.socketId === socketId)
    if(idx !== -1) {
        users.splice(idx,1);
        return users
    }
}

export const getUsers = () => users.map(user => user._id)


export const getUsersInRoom = (room) => users.map(user => {
        if(user.room === room) return user._id })
