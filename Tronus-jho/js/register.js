const form=document.getElementById("registerForm");

form.addEventListener("submit",function(e){

e.preventDefault();

const name=document.getElementById("name");
const email=document.getElementById("email");
const password=document.getElementById("password");
const confirmPassword=document.getElementById("confirmPassword");

let valid=true;

[name,email,password,confirmPassword].forEach(input=>{
input.classList.remove("input-error");
});

if(name.value===""){name.classList.add("input-error");valid=false;}
if(email.value===""){email.classList.add("input-error");valid=false;}
if(password.value===""){password.classList.add("input-error");valid=false;}
if(confirmPassword.value===""){confirmPassword.classList.add("input-error");valid=false;}

if(password.value!==confirmPassword.value){
password.classList.add("input-error");
confirmPassword.classList.add("input-error");
valid=false;
}

if(valid){

const user={
name:name.value,
email:email.value,
password:password.value
};

localStorage.setItem("tronusUser",JSON.stringify(user));

window.location.href="character.html";

}

});