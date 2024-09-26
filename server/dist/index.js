"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:3000", "*"],
        credentials: true,
    }
});
io.on("connection", (socket) => {
    console.log(`User connected with id ${socket.id}`);
});
const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
