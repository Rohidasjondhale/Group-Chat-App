const token = localStorage.getItem("token");
const myUserId = localStorage.getItem("userId");
const myName = localStorage.getItem("name");

let currentRoom = "";

const socket = io("http://localhost:3000", {
  auth: {
    token: token
  }
});

window.onload = loadMessages;

async function joinRoom() {
  const otherEmail = document.getElementById("searchEmail").value.trim().toLowerCase();

  if (!otherEmail) {
    alert("Please enter user email");
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/search-user?email=${encodeURIComponent(otherEmail)}`);
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "User not found");
      return;
    }

    const otherUserId = data.userId;

    currentRoom = [Number(myUserId), Number(otherUserId)].sort((a, b) => a - b).join("_");

    socket.emit("join_room", currentRoom);

    document.getElementById("chat-box").innerHTML = "";
    console.log("Joined room:", currentRoom);
    alert("Joined personal chat with " + data.name);
  } catch (err) {
    console.log(err);
    alert("Error joining room");
  }
}

async function sendMessage() {
  const input = document.getElementById("messageInput");
  const messageText = input.value.trim();

  if (messageText === "") return;

  if (currentRoom) {
    const personalMessageData = {
      roomId: currentRoom,
      senderId: myUserId,
      senderName: myName,
      message: messageText
    };

    socket.emit("new_message", personalMessageData);
    input.value = "";
    return;
  }

  const messageData = {
    message: messageText,
    userId: myUserId,
    name: myName
  };

  try {
    const res = await fetch("http://localhost:3000/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(messageData)
    });

    if (!res.ok) {
      const errData = await res.json();
      console.log(errData.message);
      return;
    }

    socket.emit("sendMessage", messageData);
    input.value = "";
  } catch (err) {
    console.log(err);
  }
}

socket.on("receiveMessage", (data) => {
  if (currentRoom) return;

  displayMessage({
    userId: data.userId,
    name: data.name || "User",
    message: data.message
  });
});

socket.on("receive_message", (data) => {
  if (data.roomId !== currentRoom) return;

  displayMessage({
    userId: data.senderId,
    name: data.senderName || "User",
    message: data.message
  });
});

function displayMessage(msg) {
  const chatBox = document.getElementById("chat-box");
  const messageDiv = document.createElement("div");

  if (String(msg.userId) === String(myUserId)) {
    messageDiv.classList.add("message", "sent");
  } else {
    messageDiv.classList.add("message", "received");
  }

  messageDiv.innerHTML = `
    <strong>${msg.name}:</strong>
    <p>${msg.message}</p>
  `;

  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function loadMessages() {
  const chatBox = document.getElementById("chat-box");

  try {
    const res = await fetch("http://localhost:3000/messages");
    const data = await res.json();

    chatBox.innerHTML = "";

    data.forEach((msg) => {
      displayMessage({
        userId: msg.userId,
        name: msg.name || (msg.user && msg.user.name) || "User",
        message: msg.message
      });
    });
  } catch (err) {
    console.log(err);
  }
}