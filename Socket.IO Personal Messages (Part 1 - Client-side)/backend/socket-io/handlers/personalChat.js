function personalChat(io, socket) {

  // join personal room
  socket.on("join_room", (userId) => {

    socket.join(userId);

    console.log(`User ${userId} joined personal room`);

  });


  // send personal message
  socket.on("new_message", (data) => {

    const { senderId, receiverId, message } = data;

    io.to(receiverId).emit("receive_message", {
      senderId,
      message
    });

  });

}

module.exports = personalChat;