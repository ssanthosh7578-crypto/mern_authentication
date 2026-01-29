import dotenv from "dotenv";
dotenv.config();


import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import authrouter from "./router.js";
import userRouter from "./userRoutes.js";

const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // frontend port
  credentials: true
}));

const PORT=3005;

app.use('/api/user',userRouter)
app.use('/api/auth',authrouter)
mongoose.connect('mongodb://127.0.0.1:27017/authen').then(()=>console.log("mongoes connected")).catch((err)=>console.log(err))
app.listen(PORT,()=>{
    console.log(`app is listening to ${PORT}`)
})