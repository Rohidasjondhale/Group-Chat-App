async function sendMessage() {

const input = document.getElementById("messageInput");
const chatBox = document.getElementById("chat-box");

const messageText = input.value.trim();

if (messageText === "") return;

const userId = localStorage.getItem("userId");

if (!userId) {
alert("User not logged in");
window.location.href = "login.html";
return;
}

try {

const res = await fetch("http://localhost:3000/message", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
message: messageText,
userId: parseInt(userId)
})
});

if (!res.ok) {
console.log("Failed to send message");
return;
}

input.value = "";

loadMessages();

} catch (err) {
console.log(err);
}

}



async function loadMessages() {

const chatBox = document.getElementById("chat-box");

try {

const res = await fetch("http://localhost:3000/messages");

const data = await res.json();

chatBox.innerHTML = "";

data.forEach(msg => {

const messageDiv = document.createElement("div");

if (msg.userId == localStorage.getItem("userId")) {
messageDiv.classList.add("message", "sent");
} else {
messageDiv.classList.add("message", "received");
}

messageDiv.innerHTML = `<p>${msg.message}</p>`;

chatBox.appendChild(messageDiv);

});

chatBox.scrollTop = chatBox.scrollHeight;

} catch (err) {
console.log(err);
}

}



window.onload = () => {

loadMessages();

setInterval(loadMessages, 2000);

};