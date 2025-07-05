import express from "express"
import cors from 'cors'
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

dotenv.config();


const port= process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI ||'mongodb://localhost:27017/library').then(()=>{
    console.log("Mongodb Connected")
    console.log(process.env.MONGO_URI )
    app.listen(port,()=>console.log(`Server is Running ${port}`))
})
.catch((err)=>console.error("Mongodb connection error",err))