const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(userRoutes);

sequelize.sync()
.then(()=>{
    app.listen(3000, ()=>{
        console.log("Server running on port 3000");
    });
})
.catch(err=>console.log(err));