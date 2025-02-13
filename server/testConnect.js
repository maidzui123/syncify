import { io } from "socket.io-client";

const socket = io("ws://localhost:3001", {
  extraHeaders: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzRhYmVjZjFjYTJmMGZkNjg2ZGU5OTgiLCJlbWFpbCI6InluMDMwOUBnbWFpbC5jb20iLCJpYXQiOjE3MzcyNzcxMDIsImV4cCI6MTc2ODgzNDcwMn0.37kw1y6OEgT3NyLuU8gjTPWEmre1wAqkkcULEgyBBYE`,
  },
});

console.log("🥀 ~ socket:", socket);

// Xử lý kết nối socket
socket.on("connect", () => {
  console.log("Connected to socket server with ID:", socket.id);

  socket.emit("userConnect");
});

socket.on("chatMessage", (msgData) => {
  console.log("Received message in room:", msgData);
});