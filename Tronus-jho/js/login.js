const form=document.getElementById("loginForm");

form.addEventListener("submit",function(e){

e.preventDefault();

const email=document.getElementById("loginEmail").value;
const password=document.getElementById("loginPassword").value;

const savedUser=JSON.parse(localStorage.getItem("tronusUser"));

if(!savedUser){
alert("Usuário não encontrado");
return;
}

if(email===savedUser.email && password===savedUser.password){

window.location.href="character.html";

}else{

alert("Email ou senha incorretos");

}

});