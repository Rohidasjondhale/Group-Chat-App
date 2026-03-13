// Get token
const token = localStorage.getItem("token");

// Connect to socket server with authentication
const socket = io("http://localhost:3000", {
  auth: {
    token: token
  }
});

// Load messages when page loads
window.onload = loadMessages;


// Send message
async function sendMessage() {

  const input = document.getElementById("messageInput");
  const messageText = input.value.trim();

  if(messageText === "") return;

  const userId = localStorage.getItem("userId");
  const name = localStorage.getItem("name");

  const messageData = {
    message: messageText,
    userId: userId,
    name: name
  };

  try {

    await fetch("http://localhost:3000/message",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(messageData)
    });

    socket.emit("sendMessage", messageData);

    input.value="";

  } catch(err){
    console.log(err);
  }

}

// Receive message in real time
socket.on("receiveMessage", (data) => {

  displayMessage(data);

});


// Display message in chat
function displayMessage(msg) {

  const chatBox = document.getElementById("chat-box");

  const messageDiv = document.createElement("div");

  if (msg.userId == localStorage.getItem("userId")) {
    messageDiv.classList.add("message", "sent");
  } else {
    messageDiv.classList.add("message", "received");
  }

  messageDiv.innerHTML = `
<strong>${msg.name || msg.user?.name || "User"}:</strong>
    <p>${msg.message}</p>
  `;

  chatBox.appendChild(messageDiv);

  chatBox.scrollTop = chatBox.scrollHeight;

}


// Load old messages from database
async function loadMessages() {

  const chatBox = document.getElementById("chat-box");

  try {

    const res = await fetch("http://localhost:3000/messages");

    const data = await res.json();

    chatBox.innerHTML = "";

    data.forEach(msg => displayMessage(msg));

  } catch (err) {

    console.log(err);

  }

}