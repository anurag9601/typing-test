import { socketResponse } from "../../../types";
import { Server as serverIo } from "socket.io";
import { Server as HttpServer } from "http";

function IoHandler(res: socketResponse) {
    if (!res.socket.server.io) {
        const path = "/api/socket/io";
        const httpServer = res.socket.server as any;
        const io = new serverIo(httpServer, {
            path: path,
            addTrailingSlash: false,
        });

        res.socket.server.io = io;

        io.on("connection", (socket) => {
            
        });
    }
    res.end();
}

export default IoHandler;
