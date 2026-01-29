import express from 'express'
import verification from "./middleware.js";
import { userData } from './userController.js';
const userRouter=express.Router();

userRouter.get('/data',verification,userData)

export default userRouter;