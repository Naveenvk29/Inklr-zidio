import { Server } from "socket.io";

let io;
const onlineUsers = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`✅ User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`❌ User ${userId} disconnected`);
          break;
        }
      }
    });
  });
};

const sendNotification = (receiverId, notification) => {
  const receiverSocketId = onlineUsers.get(receiverId);
  if (receiverSocketId && io) {
    io.to(receiverSocketId).emit("getNotification", notification);
    console.log(`📩 Sent notification to ${receiverId}`);
  }
};

export { initSocket, sendNotification };
