 import express from 'express';
 import cors from 'cors';
 import  mongoose  from 'mongoose';
import dotenv from "dotenv";
import {userRoutes} from "./routes/userRoutes.js";

 const app =express();
dotenv.config();

 app.use(cors());
 app.use(express.json());
app.use("/api/auth",userRoutes)

mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB Connetion Successfull");
    })
    .catch((err) => {
        console.log(err.message);
    });

 const server=app.listen(process.env.PORT,()=>{
    console.log(`Server Started on Port ${process.env.PORT}`);
 });

