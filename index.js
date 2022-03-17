import { createServer } from 'http'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import {fileURLToPath} from 'url'
import {Server} from 'socket.io'
import {v4} from 'uuid'
import chatFunctions from './server/src/socket.io.js'
import {Database} from './server/database.connection.js'
import {notFound, errorHandler} from './server/src/middlewares/errorhandler.js'
import {verifyAPIKey} from './server/src/middlewares/auth.js' 
import i18nextMiddleware from 'i18next-http-middleware'
import i18next from './server/src/i18next.js';
import userRouter from './server/src/routers/users.router.js'
import operationRouter from './server/src/routers/operations.router.js'
import reportsRouter from './server/src/routers/reports.router.js'
import currenciesRouter from './server/src/routers/currencies.router.js'
import notificationsRouter from './server/src/routers/notifications.router.js'
import ticketsRouter from './server/src/routers/tickets.router.js'
import chatRouter from './server/src/routers/chat.router.js'
const __dirname = path.dirname(fileURLToPath(import.meta.url)) 


dotenv.config()

// Database connection
Database()

// initiate app
const app = express()

const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors:{
        origin:'http://localhost:3000'
    }
})

// chat socket api
// chatFunctions(io)

// middlewares
app.use(express.json())
app.use(cors({
    origin:'http://localhost:3000'
}))
app.use(helmet())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(i18nextMiddleware.handle(i18next))

if(process.env.NODE_ENV === 'production') {
    
    app.use(express.static(path.resolve(__dirname, 'client/build')))

    app.use(express.static(path.resolve(__dirname, 'admin/build')))
    
    app.get('', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build/index.html'))
    })
    
    app.get('/dashboard', (req, res) => {
        res.sendFile(path.join(__dirname, 'admin/build/index.html'))
    })
}

// Endpoints
app.use('/api/users',verifyAPIKey, userRouter)
app.use('/api/operations',verifyAPIKey, operationRouter)
app.use('/api/reports',verifyAPIKey, reportsRouter)
app.use('/api/currencies',verifyAPIKey, currenciesRouter)
app.use('/api/notifications',verifyAPIKey, notificationsRouter)
app.use('/api/tickets', verifyAPIKey, ticketsRouter)
app.use('/api/chat', verifyAPIKey, chatRouter)

// Serving Assets
app.use('/api/files', express.static(path.resolve(__dirname, 'server/uploads')))

// Error Handler
app.use(notFound)
app.use(errorHandler)


////////////////////////////////////////////////////////
/////////////// CHAT FUNCTIONS START //////////////////
import {
    addUser, 
    removeUserBySocketId, 
    removeUserById, 
    getUser, 
    getUsers 
} from './chatUsers.js'

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
        console.log('inform message', id);
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

////////////////////////////////////////////////////////
/////////////// CHAT FUNCTIONS END //////////////////

// start app 
const port = process.env.PORT || 5000 

httpServer.listen(port, () => {
    console.log(`Server start at port ${port}`);
})