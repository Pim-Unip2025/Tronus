let selectedGender=null;
let selectedCharacter=null;

const charactersDiv=document.getElementById("characters");
const preview=document.getElementById("previewImage");

function nextStep(step){

document.querySelectorAll(".step").forEach(s=>{
s.classList.remove("active");
});

document.getElementById("step"+step).classList.add("active");

updateProgress(step);

}

// PASSO 1
function selectGender(gender){

selectedGender=gender;

loadCharacters();

nextStep(2);

}

// PASSO 3
function loadCharacters(){

charactersDiv.innerHTML="";

let characters=[];

if(selectedGender==="male"){

characters=[
"img/masc1.png",
"img/masc2.png",
"img/masc3.png"
];

}else{

characters=[
"img/fem1.png",
"img/fem2.png",
"img/fem3.png"
];

}

characters.forEach(src=>{

const card=document.createElement("div");
card.classList.add("character-card");

const img=document.createElement("img");
img.src=src;

card.appendChild(img);

card.onclick=()=>selectCharacter(card,src);

charactersDiv.appendChild(card);

});

}

// PASSO 3
function selectCharacter(card,src){

document.querySelectorAll(".character-card").forEach(c=>{
c.classList.remove("selected");
});

card.classList.add("selected");

selectedCharacter=src;

preview.src=src;

showSummary();

nextStep(4);

}

// PASSO 4
function showSummary(){

const user=JSON.parse(localStorage.getItem("tronusUser"));

document.getElementById("playerName").innerText="Nome: "+user.name;

document.getElementById("playerEmail").innerText="Email: "+user.email;

}

function updateProgress(step){

const steps=document.querySelectorAll(".progress-step");

steps.forEach((item,index)=>{

if(index < step){

item.classList.add("active");

}else{

item.classList.remove("active");

}

});

}