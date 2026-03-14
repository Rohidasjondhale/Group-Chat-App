function personalChat(io, socket) {

  socket.on("join_room", (roomId) => {

    socket.join(roomId);

    console.log("User joined room:", roomId);

  });

  socket.on("new_message", (data) => {

    io.to(data.roomId).emit("receive_message", data);

  });

}

module.exports = personalChat;