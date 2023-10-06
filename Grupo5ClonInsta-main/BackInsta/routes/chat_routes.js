import express from 'express'

//Middlewares
import authUser from '../middlewares/auth_user.js'
import userExists from '../middlewares/user_exists.js'


//Controllers
import * as chatController from '../controllers/chat_controller.js'

const router = express.Router()

//Routes

//Crear sala
router.post('/create-room', authUser, userExists, chatController.createRoom)

// Modifica la ruta para incluir el identificador de la sala
router.post('/:id/send-message', authUser,userExists, chatController.sendChatMessage);

router.get('/:id/messages', authUser,userExists, chatController.getMessages);


export default router