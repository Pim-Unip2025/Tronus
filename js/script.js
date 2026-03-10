const sky=document.getElementById("sky");

function spawnCloud(){

const cloud=document.createElement("img");
cloud.src="img/nuvem.png";
cloud.classList.add("cloud");

const size=30+Math.random()*120;
const y=Math.random()*window.innerHeight*0.6;

cloud.style.width=size+"px";
cloud.style.top=y+"px";
cloud.style.left="-300px";

sky.appendChild(cloud);

let x=-300;
const speed=0.2+Math.random()*1.2;

function animate(){

x+=speed;
cloud.style.left=x+"px";

if(x>window.innerWidth+300){
cloud.remove();
return;
}

requestAnimationFrame(animate);

}

animate();
}

for(let i=0;i<20;i++){
spawnCloud();
}

setInterval(()=>{
if(document.querySelectorAll(".cloud").length<40){
spawnCloud();
}
},1200);