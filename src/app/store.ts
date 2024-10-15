import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import socketReducer from "./slice/socketSlice";

export const store = configureStore({
    reducer: {
        userInfo: userReducer,
        socketInit: socketReducer,
    }
})