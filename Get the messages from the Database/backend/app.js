const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");

const messageRoutes = require("./routes/messageRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use(userRoutes);
app.use(messageRoutes);

sequelize.sync()
.then(()=>{
    app.listen(3000, ()=>{
        console.log("Server running on port 3000");
    });
})
.catch(err=>console.log(err));