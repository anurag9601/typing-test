import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import dotEnv from "dotenv";

const app = express();
dotEnv.config()

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000","*"],
        credentials: true,
    }
});

io.on("connection", (socket: Socket) => {
    console.log(`User connected with id ${socket.id}`)
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})


