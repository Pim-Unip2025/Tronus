// ============================================================
// SIDEBAR.JS — Menu lateral reutilizável
// ============================================================

function criarSidebar() {

  const usuario = JSON.parse(
    sessionStorage.getItem("usuarioLogado") ||
    localStorage.getItem("usuarioLogado") || "{}"
  );
  const papel = usuario.papel || 'aluno';

  const painelLink = papel === 'professor'
    ? `<a class="sidebar-item" onclick="fecharSidebar(); window.location.href='professor.html'">
         <i class='bx bx-chalkboard'></i>
         Painel do Professor
       </a>`
    : papel === 'admin'
    ? `<a class="sidebar-item" onclick="fecharSidebar(); window.location.href='admin.html'">
         <i class='bx bx-shield-alt-2'></i>
         Painel Admin
       </a>`
    : '';

  const html = `
    <button class="menu-toggle" onclick="abrirSidebar()" title="Menu">
      <i class='bx bx-menu'></i>
    </button>

    <div class="sidebar-overlay" id="sidebarOverlay" onclick="fecharSidebar()"></div>

    <div class="sidebar" id="sidebar">

      <div class="sidebar-header">
        <span class="sidebar-logo">⚔ TRONUS</span>
        <button class="sidebar-close" onclick="fecharSidebar()">✕</button>
      </div>

      <nav class="sidebar-nav">

        <a class="sidebar-item" onclick="fecharSidebar(); window.location.href='reinos.html'">
          <i class='bx bx-map-alt'></i>
          Reinos
        </a>

        ${painelLink}

        <a class="sidebar-item" onclick="fecharSidebar(); alert('Em breve!')">
          <i class='bx bx-cog'></i>
          Configurações
        </a>

        <button id="temaBtn" onclick="alternarTema()">
          <i class='bx bx-sun'></i> Modo Claro
        </button>

        <div style="flex:1"></div>

        <a class="sidebar-item danger" onclick="logout()">
          <i class='bx bx-log-out'></i>
          Sair
        </a>

      </nav>

      <div class="sidebar-footer">
        TRONUS © 2025 — UNIP
      </div>

    </div>
  `;

  // Aguarda o body estar disponível
  if (document.body) {
    document.body.insertAdjacentHTML("afterbegin", html);
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      document.body.insertAdjacentHTML("afterbegin", html);
    });
  }
}

function abrirSidebar() {
  document.getElementById("sidebar").classList.add("ativo");
  document.getElementById("sidebarOverlay").classList.add("ativo");
}

function fecharSidebar() {
  document.getElementById("sidebar").classList.remove("ativo");
  document.getElementById("sidebarOverlay").classList.remove("ativo");
}

function logout() {
  if (!confirm("Tem certeza que deseja sair?")) return;
  sessionStorage.removeItem("usuarioLogado");
  localStorage.removeItem("usuarioLogado");
  sessionStorage.removeItem("reinoSelecionado");
  localStorage.removeItem("reinoSelecionado");
  sessionStorage.removeItem("personagemId");
  localStorage.removeItem("personagemId");
  window.location.href = "landing.html";
}

criarSidebar();