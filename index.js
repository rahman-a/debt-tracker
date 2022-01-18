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
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build/index.html'))
    })
}

app.use(verifyAPIKey)
app.use('/api/users', userRouter)

app.use('/api/files', express.static(path.resolve(__dirname, 'server/uploads')))
app.use(notFound)
app.use(errorHandler)


// initiate server
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log('port is running at 5000');
})