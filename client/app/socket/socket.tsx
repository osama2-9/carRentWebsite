"use client";
import socketCLient from "socket.io-client";


const socket = socketCLient("http://localhost:4000", {
  transportOptions: {
    polling: {
      extraHeaders: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    },
    websocket: {
      extraHeaders: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    },
  },
});
socket.on("connect", () => {
  console.log("Connected to socket server");
});

export { socket };
