import express from "express"
import { checkAuth, login, logout, signup , updateProfile} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post('/signup',signup);
authRouter.post('/login',login);
authRouter.post('/logout',logout);

authRouter.put('/update-profile',authMiddleware,updateProfile);

authRouter.get('/check',authMiddleware,checkAuth); // checking at every single refresh


export default authRouter;