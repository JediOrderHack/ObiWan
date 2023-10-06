import express from 'express'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import bodyParser from 'body-parser'
import multer from 'multer'
import http from 'http'
// Config
import { PORT, UPLOADS_DIR, VIDEO_DIR } from './config.js'

// Import Routes
import usersRoutes from './routes/users_routes.js'
import entriesRoutes from './routes/entries_routes.js'
import chatRoutes from './routes/chat_routes.js'

// Errors
import error404 from './middlewares/error404.js'
import errorMiddleware from './middlewares/error_middleware.js'
import serverListener from './helpers/server_listener.js'
import chatConfig from './services/chat.js'



const app = express()
const server =http.createServer(app)
const io = chatConfig(server)

// Middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('common'))
app.use(fileUpload())
app.use('/images', express.static(UPLOADS_DIR))
app.use('/videos', express.static(VIDEO_DIR))


// Routes
app.use('/users', usersRoutes)
app.use('/entries', entriesRoutes)
app.use('/chat', chatRoutes)

// Error Handling
app.use(error404)
app.use(errorMiddleware)


app.listen(PORT, serverListener)