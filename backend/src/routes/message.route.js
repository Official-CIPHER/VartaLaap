import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.get('/users',authMiddleware, getUsersForSidebar);
messageRouter.get('/messages',authMiddleware, getMessages); // no `:id`

messageRouter.post('/send', authMiddleware, sendMessage); // no `:id`

export default messageRouter;