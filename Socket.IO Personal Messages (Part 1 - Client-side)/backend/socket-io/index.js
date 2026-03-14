const { Server } = require("socket.io");
const socketMiddleware = require("./middleware");
const chatHandler = require("./handlers/chat");
const personalChat = require("./handlers/personalChat");

function initializeSocket(server) {

  const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  // authentication middleware
  io.use(socketMiddleware);

  io.on("connection", (socket) => {

    console.log("User connected:", socket.userId);

    // chat event handler
    chatHandler(io, socket);
    personalChat(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.userId);
    });

  });

}

module.exports = initializeSocket;