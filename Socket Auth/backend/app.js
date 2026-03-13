const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

const User = require("./models/user");
const Message = require("./models/message");

User.hasMany(Message);
Message.belongsTo(User);

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use(userRoutes);
app.use(messageRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});


// SOCKET AUTHENTICATION

io.use((socket, next) => {

  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error: Token missing"));
  }

  try {

    const decoded = jwt.verify(token, "secretkey");

    socket.userId = decoded.userId;

    next();

  } catch (err) {

    return next(new Error("Authentication error: Invalid token"));

  }

});


// SOCKET CONNECTION

io.on("connection", (socket) => {

  console.log("User connected:", socket.userId);

  socket.on("sendMessage", async (data) => {

    try {

      const user = await User.findByPk(socket.userId);

      const messageData = {
        message: data.message,
        userId: socket.userId,
        name: user.name
      };

      io.emit("receiveMessage", messageData);

    } catch (err) {
      console.log(err);
    }

  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
  });

});


// DATABASE + SERVER START

sequelize.sync()
.then(() => {

  server.listen(3000, () => {
    console.log("Server running on port 3000");
  });

})
.catch(err => console.log(err));