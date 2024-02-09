//  import express from 'express';
//  import cors from 'cors';
//  import  mongoose  from 'mongoose';
// import dotenv from "dotenv";
// import {userRoutes} from "./routes/userRoutes.js";

// import {messagesRoute} from "./routes/messagesRoute.js";
// import http from "http";
// import { Server as SocketIOServer } from "socket.io";
//  const app =express();
// dotenv.config();

//  app.use(cors());
//  app.use(express.json());
// app.use("/api/auth",userRoutes)
// app.use("/api/messages", messagesRoute);
// mongoose.connect(process.env.MONGO_URL, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     })
//     .then(() => {
//         console.log("DB Connetion Successfull");
//     })
//     .catch((err) => {
//         console.log(err.message);
//     });

//  app.listen(process.env.PORT,()=>{
//     console.log(`Server Started on Port ${process.env.PORT}`);
//  });

// // const io = socketIo(server, {
// //     cors: {
// //         origin: "http://localhost:3000",
// //         credentials: true,
// //     },
// // });

// const server = http.createServer(app);
// const io = new SocketIOServer(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         credentials: true
//     }
// });



// global.onlineUsers = new Map();
// io.on("connection", (socket) => {
//     global.chatSocket = socket;
//     socket.on("add-user", (userId) => {
//         onlineUsers.set(userId, socket.id);
//     });

//     socket.on("send-msg", (data) => {
//         const sendUserSocket = onlineUsers.get(data.to);
//         if (sendUserSocket) {
//             socket.to(sendUserSocket).emit("msg-recieve", data.msg);
//         }
//     });
// });



import express from "express";
import cors from "cors";
import mongoose from "mongoose";
 import {userRoutes} from "./routes/userRoutes.js";

 import {messagesRoute} from "./routes/messagesRoute.js";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB Connection Successful");
    })
    .catch((err) => {
        console.error("DB Connection Error:", err.message);
    });

app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoute);

const onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log("User added:", userId);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.msg);
            console.log("Message sent to:", data.to);
        }
    });

    socket.on("disconnect", () => {
        onlineUsers.forEach((value, key) => {
            if (value === socket.id) {
                onlineUsers.delete(key);
                console.log("User disconnected:", key);
            }
        });
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


