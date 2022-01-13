import express from 'express'
import cors from 'cors'
import path from 'path'
import {fileURLToPath} from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url)) 

const app = express()

app.use(cors())
// app.use(helmet())

app.use(express.static(path.resolve(__dirname, 'client/build')))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'))
})

app.listen('5000', () => {
    console.log('port is running at 5000');
})