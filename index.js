import { createServer } from 'http'
import cluster from 'cluster'
import os from 'os'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { Server } from 'socket.io'
import compression from 'compression'
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
import employeesRouter from './server/src/routers/employees.router.js'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Environment Variables
dotenv.config()

// Database connection
Database()

/***************************************************/
/***************** INITIATE THE APP
/***************************************************/
const app = express()

/***************************************************/
/***************** MIDDLEWARES
/***************************************************/
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))
app.use(cors())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(compression())
app.use(i18nextMiddleware.handle(i18next))

/***************************************************/
/***************** SERVING PRODUCTION BUILD FRONTEND
/***************************************************/
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'client/dist')))

  app.use(express.static(path.resolve(__dirname, 'admin/build')))

  app.get('', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'))
  })

  app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/build/index.html'))
  })
}

/***************************************************/
/***************** SERVING ASSETS
/***************************************************/
app.use('/api/files', express.static(path.resolve(__dirname, 'server/uploads')))

/***************************************************/
/***************** ENDPOINTS
/***************************************************/
app.use(verifyAPIKey)
app.use('/api/users', userRouter)
app.use('/api/operations', operationRouter)
app.use('/api/reports', reportsRouter)
app.use('/api/currencies', currenciesRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/tickets', ticketsRouter)
app.use('/api/chat', chatRouter)
app.use('/api/employees', employeesRouter)

/***************************************************/
/***************** ERROR HANDLING
/***************************************************/
app.use(notFound)
app.use(errorHandler)

/***************************************************/
/***************** SERVING THE APP
/***************************************************/
const port = process.env.PORT || 5000

// if (cluster.isPrimary) {
//   const cpuNum = os.cpus().length
//   console.log("CPU's: ", cpuNum)
//   for (let i = 0; i < cpuNum; i++) {
//     cluster.fork()
//   }
//   cluster.on('listening', (worker, address) => {
//     console.log(worker.id)
//     console.log(address)
//     console.log(
//       `Worker ${worker.process.pid} connected to ${address.address}:${address.port}`
//     )
//   })
// } else {
//   httpServer.listen(port)
// }

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
