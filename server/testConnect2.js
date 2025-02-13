import { io } from "socket.io-client";

const socket = io("ws://localhost:3001", {
  extraHeaders: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzRhYjE5NDUxYzNiY2Y3YWEyM2NlOWIiLCJlbWFpbCI6Im1haWR1eTE5MDgwMkBnbWFpbC5jb20iLCJpYXQiOjE3MzkwNjk1MDgsImV4cCI6MTc3MDYyNzEwOH0.Yw8r7Zgq-2Gsgm-29XLhXiGkhJ4WVPdIvSIWYrILgYw`,
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