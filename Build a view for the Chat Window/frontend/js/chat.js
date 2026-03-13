function sendMessage(){

const input = document.getElementById("messageInput");
const chatBox = document.getElementById("chat-box");

const messageText = input.value;

if(messageText === "") return;

const messageDiv = document.createElement("div");

messageDiv.classList.add("message","sent");

const time = new Date().toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
});

messageDiv.innerHTML = `
<p>${messageText}</p>
<span class="time">${time}</span>
`;

chatBox.appendChild(messageDiv);

chatBox.scrollTop = chatBox.scrollHeight;

input.value = "";

}