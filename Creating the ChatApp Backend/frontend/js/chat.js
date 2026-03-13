async function sendMessage(){

const input = document.getElementById("messageInput");
const chatBox = document.getElementById("chat-box");

const messageText = input.value;

if(messageText === "") return;

const userId = localStorage.getItem("userId");

try{

await fetch("http://localhost:3000/message",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
message:messageText,
userId:userId
})
});

}catch(err){
console.log(err);
}

const messageDiv = document.createElement("div");

messageDiv.classList.add("message","sent");

messageDiv.innerHTML = `
<p>${messageText}</p>
`;

chatBox.appendChild(messageDiv);

chatBox.scrollTop = chatBox.scrollHeight;

input.value="";

}