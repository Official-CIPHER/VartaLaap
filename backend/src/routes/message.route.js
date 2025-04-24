import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.get('/users',authMiddleware, getUsersForSidebar)
messageRouter.get('/:id',authMiddleware, getMessages)

messageRouter.post('/send/:id', authMiddleware, sendMessage)

export default messageRouter;