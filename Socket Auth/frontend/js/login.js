document.getElementById("loginForm").addEventListener("submit", async function(e){

e.preventDefault();

const emailOrPhone = document.getElementById("emailOrPhone").value;
const password = document.getElementById("password").value;

try{

const res = await fetch("http://localhost:3000/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
emailOrPhone,
password
})
});

const data = await res.json();

console.log("Login response:", data);

if(res.status === 200){

const token = data.token;

localStorage.setItem("token", token);

const payload = JSON.parse(atob(token.split(".")[1]));

localStorage.setItem("userId", payload.userId);

alert("Login successful");

window.location.href="chat.html";

}else{

alert(data.message);

}

}catch(err){
console.log(err);
}

});