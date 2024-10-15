import { NextApiResponse } from "next";
import { Socket, Server as NetServer } from "net";
import { Server as ClientIo } from "socket.io"

export type socketResponse = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: ClientIo
        }
    }
}