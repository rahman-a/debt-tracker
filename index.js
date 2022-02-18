import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import {fileURLToPath} from 'url'
import databaseConnection from './server/database.connection.js'
import {notFound, errorHandler} from './server/src/middlewares/errorhandler.js'
import {verifyAPIKey} from './server/src/middlewares/auth.js' 
import userRouter from './server/src/routers/users.router.js'
import operationRouter from './server/src/routers/operations.router.js'
import reportsRouter from './server/src/routers/reports.router.js'
import currenciesRouter from './server/src/routers/currencies.router.js'
import notificationsRouter from './server/src/routers/notifications.router.js'
import ticketsRouter from './server/src/routers/tickets.router.js'
const __dirname = path.dirname(fileURLToPath(import.meta.url)) 

dotenv.config()

// initiate express app
const app = express()

// Database connection
databaseConnection()

// middlewares
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(cookieParser())
app.use(morgan('dev'))

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

app.use('/api/users',verifyAPIKey, userRouter)
app.use('/api/operations',verifyAPIKey, operationRouter)
app.use('/api/reports',verifyAPIKey, reportsRouter)
app.use('/api/currencies',verifyAPIKey, currenciesRouter)
app.use('/api/notifications',verifyAPIKey, notificationsRouter)
app.use('/api/tickets', verifyAPIKey, ticketsRouter)

app.use('/api/files', express.static(path.resolve(__dirname, 'server/uploads')))
app.use(notFound)
app.use(errorHandler)


// initiate server
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log('port is running at 5000');
})