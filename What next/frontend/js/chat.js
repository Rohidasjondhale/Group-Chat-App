const token = localStorage.getItem("token");
const myUserId = localStorage.getItem("userId");
const myName = localStorage.getItem("name");
const myEmail = localStorage.getItem("email");

const socket = io("http://localhost:3000", {
  auth: { token }
});

let currentGroup = "";
let currentRoom = "";

/* ===============================
JOIN GROUP
=============================== */

function joinGroup() {

  const groupName = document
    .getElementById("groupName")
    .value
    .trim();

  if (!groupName) {
    alert("Enter group name");
    return;
  }

  currentGroup = groupName;
  currentRoom = "";

  socket.emit("join_group", groupName);

  alert("Joined group successfully: " + groupName);

  console.log("Joined group:", groupName);
}


/* ===============================
JOIN PERSONAL CHAT
=============================== */

async function joinRoom() {

  const email = document
    .getElementById("searchEmail")
    .value
    .trim();

  if (!email) {
    alert("Enter email");
    return;
  }

  try {

    const res = await fetch(`http://localhost:3000/search-user?email=${email}`);
    const data = await res.json();

    if (!data.user) {
      alert("User not found");
      return;
    }

    const otherEmail = data.user.email;

    const roomId = [myEmail, otherEmail]
      .sort()
      .join("_");

    currentRoom = roomId;
    currentGroup = "";

    socket.emit("join_room", roomId);

    alert("Chat started with: " + otherEmail);

    console.log("Joined room:", roomId);

  } catch (err) {
    console.log(err);
    alert("Error joining chat");
  }

}


/* ===============================
SEND MESSAGE
=============================== */

function sendMessage() {

  const input = document.getElementById("messageInput");
  const message = input.value.trim();

  if (!message) {
    alert("Enter message");
    return;
  }

  /* GROUP MESSAGE */
  if (currentGroup) {

    const data = {
      groupId: currentGroup,
      senderId: myUserId,
      senderName: myName,
      message: message
    };

    socket.emit("group_message", data);
  }

  /* PERSONAL MESSAGE */
  else if (currentRoom) {

    const data = {
      roomId: currentRoom,
      senderId: myUserId,
      senderName: myName,
      message: message
    };

    socket.emit("new_message", data);
  }

  else {
    alert("Join a group or chat first");
    return;
  }

  input.value = "";
}

/* ===============================
RECEIVE GROUP MESSAGE
=============================== */

socket.on("receive_group_message", (data) => {

  displayMessage(data);

});

/* ===============================
RECEIVE PERSONAL MESSAGE
=============================== */

socket.on("receive_message", (data) => {

  displayMessage(data);

});

/* ===============================
DISPLAY MESSAGE
=============================== */

function displayMessage(msg) {

  const chatBox = document.getElementById("chat-box");

  const messageDiv = document.createElement("div");

  messageDiv.classList.add("message");

  if (msg.senderId == myUserId) {
    messageDiv.classList.add("sent");
  } else {
    messageDiv.classList.add("received");
  }

  messageDiv.innerHTML =
    `<strong>${msg.senderName}</strong><br>${msg.message}`;

  chatBox.appendChild(messageDiv);

  chatBox.scrollTop = chatBox.scrollHeight;
}
