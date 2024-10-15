import { createSlice } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

type initialStateTypes = {
    socket: Socket | null,
    isConnected: boolean,
}

const initialState: initialStateTypes = {
    socket: null,
    isConnected: false
};

const socketSlice = createSlice({
    name: "Socket",
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload
        },
        setIsConnected: (state, action) => {
            state.isConnected = action.payload
        }
    }
});

export const { setSocket, setIsConnected } = socketSlice.actions;

export default socketSlice.reducer;