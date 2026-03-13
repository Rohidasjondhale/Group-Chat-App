const Message = require("../models/message");

exports.sendMessage = async (req, res) => {

try {

const { message, userId } = req.body;

const newMessage = await Message.create({
message: message,
userId: userId
});

res.status(201).json(newMessage);

} catch (error) {

console.log(error);   
res.status(500).json({ message: "Internal Server Error" });

}

};