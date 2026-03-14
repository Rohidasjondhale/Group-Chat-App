const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const chatHandler = require("./handlers/chat");
const personalChat = require("./handlers/personalChat");

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next();
      }

      const decoded = jwt.verify(token, "secretkey");
      socket.userId = decoded.userId;

      next();
    } catch (err) {
      console.log("Socket auth error:", err.message);
      next();
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id, "userId:", socket.userId);

    chatHandler(io, socket);
    personalChat(io, socket);
  });
}

module.exports = initializeSocket;