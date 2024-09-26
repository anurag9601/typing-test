"use client"
import { useEffect } from "react";
import { io } from "socket.io-client";

export default function Friends() {
  useEffect(() => {
    const socket = io("http://localhost:8080");

    socket.on("connect", () => {
      console.log(`User connected with id ${socket.id}`);
    });
  }, []);

  return <div>friends</div>;
}
