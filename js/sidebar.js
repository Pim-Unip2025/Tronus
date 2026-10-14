// ============================================================
// SIDEBAR.JS — Menu lateral reutilizável
// ============================================================

function criarSidebar() {

  // Sessao vem do js/api.js, carregado antes deste arquivo.
  const usuario = (typeof Sessao !== "undefined" && Sessao.usuario) || {};
  const papel = usuario.papel || 'aluno';

  const PAPEIS = { aluno: "Aluno", professor: "Professor", admin: "Administrador" };
  const pagina = location.pathname.split("/").pop().replace(".html", "") || "index";

  // Itens do menu por perfil
  const itens = papel === "aluno"
    ? [
        ["reinos", "bx-map-alt", "Reinos"],
        ["dashboard", "bx-bar-chart-alt-2", "Meu desempenho"],
      ]
    : papel === "professor"
    ? [["professor", "bx-chalkboard", "Painel do Professor"]]
    : [["admin", "bx-shield-alt-2", "Painel Admin"]];

  const links = itens
    .map(([destino, icone, texto]) => `
        <a class="sidebar-item ${pagina === destino || (destino === "reinos" && pagina === "trilha") ? "ativo" : ""}" href="${destino}.html">
          <i class='bx ${icone}'></i>
          ${texto}
        </a>`)
    .join("");

  const nome = String(usuario.nome || "").replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

  const html = `
    <button class="menu-toggle" onclick="abrirSidebar()" title="Menu" aria-label="Abrir menu">
      <i class='bx bx-menu'></i>
    </button>

    <div class="sidebar-overlay" id="sidebarOverlay" onclick="fecharSidebar()"></div>

    <nav class="sidebar" id="sidebar" aria-label="Menu principal">

      <div class="sidebar-header">
        <span class="sidebar-logo">⚔ TRONUS</span>
        <button class="sidebar-close" onclick="fecharSidebar()" aria-label="Fechar menu">✕</button>
      </div>

      <div class="sidebar-usuario">
        <div class="sidebar-usuario-nome">${nome}</div>
        <div class="sidebar-usuario-papel">${PAPEIS[papel] || ""}</div>
      </div>

      <div class="sidebar-nav">
        ${links}

        <button id="temaBtn" onclick="alternarTema()">
          <i class='bx bx-sun'></i> Modo Claro
        </button>

        <div style="flex:1"></div>

        <a class="sidebar-item danger" onclick="logout(); return false;" href="#" role="button">
          <i class='bx bx-log-out'></i>
          Sair
        </a>
      </div>

      <div class="sidebar-footer">
        TRONUS © ${new Date().getFullYear()} — UNIP
      </div>

    </nav>
  `;

  // Aguarda o body estar disponível
  const inserir = () => {
    document.body.insertAdjacentHTML("afterbegin", html);
    // Atualiza o texto do botão de tema, que só existe depois do menu
    if (typeof iniciarTema === "function") iniciarTema();
  };
  if (document.body) inserir();
  else document.addEventListener("DOMContentLoaded", inserir);
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
  Sessao.sair();
}

criarSidebar();