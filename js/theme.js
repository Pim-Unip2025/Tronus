// ============================================================
// THEME.JS — Gerenciador de tema claro/escuro do TRONUS
// ============================================================

const TEMA_KEY = "tronus_tema";

// Aplica o tema no <html>
function aplicarTema(tema) {
  document.documentElement.setAttribute("data-tema", tema);
  localStorage.setItem(TEMA_KEY, tema);

  const btn = document.getElementById("temaBtn");
  if (btn) {
    btn.innerHTML = tema === "claro"
      ? "<i class='bx bx-moon'></i> Modo Escuro"
      : "<i class='bx bx-sun'></i> Modo Claro";
  }
}

// Alterna entre claro e escuro
function alternarTema() {
  const atual = document.documentElement.getAttribute("data-tema") || "escuro";
  aplicarTema(atual === "escuro" ? "claro" : "escuro");
}

// Inicializa com o tema salvo ou escuro por padrão
function iniciarTema() {
  const salvo = localStorage.getItem(TEMA_KEY) || "escuro";
  aplicarTema(salvo);
}

// Roda ao carregar
iniciarTema();
