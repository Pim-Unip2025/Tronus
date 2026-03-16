/*botao*/

document.addEventListener("DOMContentLoaded", function () {

  const hoverSound = document.getElementById("hoverSound");

  if (!hoverSound) return;

  const elements = document.querySelectorAll("button, a");

  elements.forEach(el => {
    el.addEventListener("mouseenter", () => {
      hoverSound.currentTime = 0;
      hoverSound.play().catch(() => {});
    });
  });



 /* MUSICA DE FUNDO */

   const music = document.getElementById("bgMusic");

  if (music) {

    music.volume = 0.10;
    hoverSound.volume = 0.25;

    const musicState = sessionStorage.getItem("musicPlaying");

    if (musicState === "true") {
      music.play().catch(() => {});
    }

    const startMusic = () => {
      music.play().then(() => {
        sessionStorage.setItem("musicPlaying", "true");
      }).catch(() => {});
    };

    document.addEventListener("click", startMusic, { once: true });

  }

});

/*mudo*/
const musicControl = document.getElementById("musicControl");

if(musicControl){

  let muted = false;

  musicControl.addEventListener("click", () => {

    muted = !muted;

    const sounds = document.querySelectorAll("audio");

    sounds.forEach(sound => {
      sound.muted = muted;
    });

    if(muted){
      musicControl.classList.add("muted");
    }else{
      musicControl.classList.remove("muted");
    }

  });

}
