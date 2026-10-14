// ============================================================
// PERSONAGEM.JS — Criação do personagem do aluno, via API
// Passos: 1 gênero → 2 nome → 3 aparência → 4 ficha e confirmação.
// O personagem só é criado ao confirmar no passo 4.
// ============================================================

const usuarioLogado = Sessao.exigir("aluno");

// Quem já tem personagem não cria outro: vai direto para os Reinos.
api.meuPersonagem()
  .then(() => window.location.replace("reinos.html"))
  .catch(() => {
    /* 404 = ainda não tem personagem: fica nesta tela */
  });

const AVATARES = {
  male: ["img/masc1.png", "img/masc2.png", "img/masc3.png"],
  female: ["img/fem1.png", "img/fem2.png", "img/fem3.png"],
};

let selectedGender = null;
let selectedCharacter = null;

const charactersDiv = document.getElementById("characters");
const preview = document.getElementById("previewImage");

function nextStep(step) {
  document.querySelectorAll(".step").forEach((s) => s.classList.remove("active"));
  document.getElementById("step" + step).classList.add("active");
  updateProgress(step);
}

// PASSO 1 — gênero
function selectGender(gender) {
  selectedGender = gender;
  loadCharacters();
  nextStep(2);
}

// PASSO 2 — nome
function confirmarNome() {
  const nome = document.getElementById("username").value.trim();
  const msg = document.getElementById("nomeMsg");
  if (!nome) {
    mostrarMensagem(msg, "Dê um nome ao seu herói.");
    return;
  }
  mostrarMensagem(msg, "");
  nextStep(3);
}

// PASSO 3 — aparência
function loadCharacters() {
  charactersDiv.innerHTML = "";
  AVATARES[selectedGender].forEach((src, i) => {
    const card = document.createElement("button");
    card.type = "button";
    card.classList.add("character-card");
    card.setAttribute("aria-label", `Aparência ${i + 1}`);

    const img = document.createElement("img");
    img.src = src;
    img.alt = "";

    card.appendChild(img);
    card.onclick = () => selectCharacter(card, src);
    charactersDiv.appendChild(card);
  });
}

function selectCharacter(card, src) {
  document.querySelectorAll(".character-card").forEach((c) => c.classList.remove("selected"));
  card.classList.add("selected");
  selectedCharacter = src;
  preview.src = src;

  document.getElementById("playerName").textContent = "Herói: " + document.getElementById("username").value.trim();
  document.getElementById("playerEmail").textContent = "Jogador: " + usuarioLogado.nome;
  nextStep(4);
}

// PASSO 4 — cria o personagem na API
async function criarPersonagem() {
  const msg = document.getElementById("criarMsg");
  try {
    await comCarregando(
      document.getElementById("btnCriar"),
      () =>
        api.criarPersonagem({
          nome: document.getElementById("username").value.trim(),
          genero: selectedGender,
          avatar: selectedCharacter,
        }),
      "Criando...",
    );
    window.location.href = "reinos.html";
  } catch (erro) {
    // 409 = já existe personagem (ex.: criado em outra aba ou no app).
    if (erro.status === 409) return window.location.replace("reinos.html");
    mostrarMensagem(msg, erro.message);
  }
}

function updateProgress(step) {
  document.querySelectorAll(".progress-step").forEach((item, index) => {
    item.classList.toggle("active", index < step);
  });
}
