// ============================================================
// CHARACTER_DB.JS — Criação de personagem usando o banco SQLite
// ============================================================
// Para usar: substitua o <script src="character.js"> por
//            <script src="database.js"> e <script src="character_db.js">
//            no character.html
// ============================================================

let selectedGender    = null;
let selectedCharacter = null;

const charactersDiv = document.getElementById("characters");
const preview       = document.getElementById("previewImage");

// Aguarda o banco antes de qualquer coisa
initDatabase().then(() => {
  console.log("Banco pronto na tela de personagem.");
});

// -----------------------------------------------
// NAVEGAÇÃO ENTRE PASSOS (igual ao original)
// -----------------------------------------------
function nextStep(step) {
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.getElementById("step" + step).classList.add("active");
  updateProgress(step);
}

// PASSO 1 — Escolha de gênero
function selectGender(gender) {
  selectedGender = gender;
  loadCharacters();
  nextStep(2);
}

// PASSO 3 — Carrega avatares
function loadCharacters() {
  charactersDiv.innerHTML = "";

  let characters = selectedGender === "male"
    ? ["img/masc1.png", "img/masc2.png", "img/masc3.png"]
    : ["img/fem1.png",  "img/fem2.png",  "img/fem3.png"];

  characters.forEach(src => {
    const card = document.createElement("div");
    card.classList.add("character-card");

    const img = document.createElement("img");
    img.src = src;

    card.appendChild(img);
    card.onclick = () => selectCharacter(card, src);
    charactersDiv.appendChild(card);
  });
}

// PASSO 3 — Seleciona avatar
function selectCharacter(card, src) {
  document.querySelectorAll(".character-card").forEach(c => c.classList.remove("selected"));
  card.classList.add("selected");

  selectedCharacter = src;
  preview.src = src;

  showSummary();
  nextStep(4);
}

// PASSO 4 — Ficha do personagem + salva no banco
function showSummary() {

  const usuario = JSON.parse(sessionStorage.getItem("usuarioLogado"));

  if (!usuario) {
    alert("Sessão expirada. Faça login novamente.");
    window.location.href = "index.html";
    return;
  }

  const nomeCriado = document.getElementById("username").value || "Sem nome";

  // Salva personagem no banco
  salvarPersonagem(usuario.id, nomeCriado, selectedGender, selectedCharacter);

  // Exibe na ficha
  document.getElementById("playerName").innerText  = "Nome: " + usuario.nome;
  document.getElementById("playerEmail").innerText = "Email: " + usuario.email;
}

// -----------------------------------------------
// BARRA DE PROGRESSO (igual ao original)
// -----------------------------------------------
function updateProgress(step) {
  const steps = document.querySelectorAll(".progress-step");
  steps.forEach((item, index) => {
    if (index < step) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}
