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

if(res.status === 200){

localStorage.setItem("token", data.token);

alert("Login successful");

window.location.href="chat.html";

}else{

alert(data.message);

}

}catch(err){
console.log(err);
}

});