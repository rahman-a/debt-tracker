import { createServer } from 'http'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import chatFunctions from './server/src/chat/socket.io.js'
import { Database } from './server/database.connection.js'
import {
  notFound,
  errorHandler,
} from './server/src/middlewares/errorhandler.js'
import { verifyAPIKey } from './server/src/middlewares/auth.js'
import i18nextMiddleware from 'i18next-http-middleware'
import i18next from './server/src/i18next.js'
import userRouter from './server/src/routers/users.router.js'
import operationRouter from './server/src/routers/operations.router.js'
import reportsRouter from './server/src/routers/reports.router.js'
import currenciesRouter from './server/src/routers/currencies.router.js'
import notificationsRouter from './server/src/routers/notifications.router.js'
import ticketsRouter from './server/src/routers/tickets.router.js'
import chatRouter from './server/src/routers/chat.router.js'
import contentRouter from './server/src/routers/content.router.js'
import AboutRouter from './server/src/routers/about.router.js'
import articleRouter from './server/src/routers/article.router.js'
import socialRouter from './server/src/routers/social.router.js'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Environment Variables
dotenv.config()

// Database connection
Database()

// initiate app
const app = express()

const httpServer = createServer(app)

////////////////////////////////////////////////////////
/////////////// INITIATE SOCKET IO //////////////////
// const io = new Server(httpServer, {
//   cors: {
//     origin: ['http://localhost:3000', 'http://localhost:3001'],
//   },
// })

const io = new Server(httpServer, { cors: { origin: '*' } })

////////////////////////////////////////////////////////
/////////////// CHAT FUNCTIONS //////////////////
chatFunctions(io)

////////////////////////////////////////////////////////
/////////////// MIDDLEWARES //////////////////
app.use(express.json())
// app.use(
//   cors({
//     origin: ['http://localhost:3000', 'http://localhost:3001'],
//   })
// )
app.use(cors())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(i18nextMiddleware.handle(i18next))

////////////////////////////////////////////////////////
/////////////// SERVING PRODUCTION BUILD FRONTEND //////////////////
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'client/build')))

  app.use(express.static(path.resolve(__dirname, 'admin/build')))

  app.get('', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'))
  })

  app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/build/index.html'))
  })
}

////////////////////////////////////////////////////////
/////////////// SERVING ASSETS//////////////////
app.use('/api/files', express.static(path.resolve(__dirname, 'server/uploads')))

////////////////////////////////////////////////////////
///////////////ENDPOINT //////////////////
app.use(verifyAPIKey)
app.use('/api/users', userRouter)
app.use('/api/operations', operationRouter)
app.use('/api/reports', reportsRouter)
app.use('/api/currencies', currenciesRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/tickets', ticketsRouter)
app.use('/api/chat', chatRouter)
app.use('/api/content', contentRouter)
app.use('/api/about', AboutRouter)
app.use('/api/article', articleRouter)
app.use('/api/social', socialRouter)

////////////////////////////////////////////////////////
/////////////// ERROR HANDLER //////////////////
app.use(notFound)
app.use(errorHandler)

////////////////////////////////////////////////////////
/////////////// START APP //////////////////
const port = process.env.PORT || 5000

httpServer.listen(port, () => {
  console.log(`Server start at port ${port}`)
})
