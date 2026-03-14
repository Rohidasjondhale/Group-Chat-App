const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");

const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

const User = require("./models/user");
const Message = require("./models/message");

const initializeSocket = require("./socket-io");

User.hasMany(Message);
Message.belongsTo(User);

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use(userRoutes);
app.use(messageRoutes);

const server = http.createServer(app);

// Initialize socket server
initializeSocket(server);

sequelize.sync()
.then(() => {

  server.listen(3000, () => {
    console.log("Server running on port 3000");
  });

})
.catch(err => console.log(err));