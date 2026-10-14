// ============================================================
// API.JS — Comunicação do site com a API do Tronus (repositório king)
//
// Substitui o antigo database.js (SQLite no navegador). Agora todos os dados
// vêm do mesmo banco (Supabase), através da API. Nenhuma regra do jogo é
// calculada aqui: estrelas, título e correção vêm prontos do servidor.
// ============================================================

// Endereço da API. Para testar com a API rodando na sua máquina, rode no
// console: localStorage.setItem("tronus.api", "http://localhost:3000")
const API_URL = (() => {
  try {
    return (localStorage.getItem("tronus.api") || "https://king-blue-nine.vercel.app").replace(/\/$/, "");
  } catch {
    return "https://king-blue-nine.vercel.app";
  }
})();

// ------------------------------------------------------------
// Sessão: token (JWT) e dados públicos do usuário. Nunca a senha.
// "Lembrar" = localStorage (continua logado ao fechar o navegador);
// sem lembrar = sessionStorage (sai ao fechar a aba).
// ------------------------------------------------------------
const Sessao = {
  _ler(chave) {
    try {
      return sessionStorage.getItem(chave) ?? localStorage.getItem(chave);
    } catch {
      return null;
    }
  },

  get token() {
    return this._ler("tronus.token");
  },

  get usuario() {
    try {
      return JSON.parse(this._ler("tronus.usuario") || "null");
    } catch {
      return null;
    }
  },

  salvar(sessao, lembrar = true) {
    this.limpar();
    const area = lembrar ? localStorage : sessionStorage;
    area.setItem("tronus.token", sessao.access_token);
    area.setItem("tronus.usuario", JSON.stringify(sessao.usuario));
  },

  atualizarUsuario(usuario) {
    const area = localStorage.getItem("tronus.token") ? localStorage : sessionStorage;
    area.setItem("tronus.usuario", JSON.stringify(usuario));
  },

  limpar() {
    for (const area of [localStorage, sessionStorage]) {
      ["tronus.token", "tronus.usuario", "reinoSelecionado", "usuarioLogado", "personagemId"].forEach((k) =>
        area.removeItem(k),
      );
    }
  },

  sair() {
    this.limpar();
    window.location.href = "login.html";
  },

  /** Página inicial de cada perfil. */
  destino(usuario = this.usuario) {
    if (!usuario) return "login.html";
    if (usuario.papel === "admin") return "admin.html";
    if (usuario.papel === "professor") return "professor.html";
    return "reinos.html";
  },

  /**
   * Protege a página: sem login vai para o login; perfil errado vai para a
   * própria área. Isso é só navegação — quem garante o acesso é a API.
   */
  exigir(...papeis) {
    const usuario = this.usuario;
    if (!this.token || !usuario) {
      window.location.replace("login.html");
      throw new Error("sem sessão");
    }
    if (papeis.length && !papeis.includes(usuario.papel)) {
      window.location.replace(this.destino(usuario));
      throw new Error("perfil sem acesso");
    }
    return usuario;
  },
};

// ------------------------------------------------------------
// Erro no formato padrão da API: { statusCode, message, error, ... }
// ------------------------------------------------------------
class ApiError extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.status = status;
  }
}

async function chamarApi(metodo, caminho, corpo) {
  const headers = { Accept: "application/json" };
  if (corpo !== undefined) headers["Content-Type"] = "application/json";
  const token = Sessao.token;
  if (token) headers.Authorization = `Bearer ${token}`;

  let resposta;
  try {
    resposta = await fetch(API_URL + caminho, {
      method: metodo,
      headers,
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw new ApiError(0, "Sem conexão com o servidor. Verifique sua internet e tente de novo.");
  }

  const texto = await resposta.text();
  let dados = null;
  try {
    dados = texto ? JSON.parse(texto) : null;
  } catch {
    dados = null;
  }

  if (!resposta.ok) {
    const bruto = dados && dados.message;
    const mensagem = Array.isArray(bruto) ? bruto.join("\n") : bruto || "Erro inesperado. Tente de novo.";
    // Token vencido: volta para o login. (Senha errada também é 401, mas no
    // login ainda não há token, então não cai aqui.)
    if (resposta.status === 401 && token) {
      Sessao.limpar();
      window.location.replace("login.html");
    }
    throw new ApiError(resposta.status, mensagem);
  }
  return dados;
}

const qs = (params) => {
  const partes = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  return partes.length ? `?${partes.join("&")}` : "";
};

const api = {
  // autenticação
  login: (identificador, senha) => chamarApi("POST", "/auth/login", { identificador, senha }),
  cadastrar: (dados) => chamarApi("POST", "/auth/register", dados),
  esqueciSenha: (celular) => chamarApi("POST", "/auth/forgot-password", { celular }),
  redefinirSenha: (resetToken, codigo, novaSenha) =>
    chamarApi("POST", "/auth/reset-password", { resetToken, codigo, novaSenha }),
  eu: () => chamarApi("GET", "/auth/me"),

  // conteúdo
  reinos: () => chamarApi("GET", "/reinos"),
  fases: (reinoId) => chamarApi("GET", `/reinos/${reinoId}/fases`),
  questoes: (faseId) => chamarApi("GET", `/fases/${faseId}/questoes`),

  // aluno
  criarPersonagem: (dados) => chamarApi("POST", "/personagens", dados),
  meuPersonagem: () => chamarApi("GET", "/personagens/me"),
  meuProgresso: () => chamarApi("GET", "/personagens/me/progresso"),
  responderFase: (faseId, respostas) => chamarApi("POST", `/fases/${faseId}/responder`, { respostas }),
  minhasEstatisticas: () => chamarApi("GET", "/personagens/me/estatisticas"),
  meuResumo: () => chamarApi("GET", "/personagens/me/resumo"),

  // professor / admin
  buscarAlunos: (nome) => chamarApi("GET", `/professor/alunos${qs({ nome })}`),
  desempenhoAluno: (usuarioId) => chamarApi("GET", `/professor/alunos/${usuarioId}/desempenho`),
  questoesGestao: (faseId) => chamarApi("GET", `/professor/fases/${faseId}/questoes`),
  criarQuestao: (faseId, dados) => chamarApi("POST", `/fases/${faseId}/questoes`, dados),
  excluirQuestao: (questaoId) => chamarApi("DELETE", `/questoes/${questaoId}`),

  // admin
  estatisticasAdmin: () => chamarApi("GET", "/admin/estatisticas"),
  usuarios: (papel) => chamarApi("GET", `/admin/usuarios${qs({ papel })}`),
  excluirUsuario: (id) => chamarApi("DELETE", `/admin/usuarios/${id}`),
  vincularReino: (id, reinoId) => chamarApi("PATCH", `/admin/usuarios/${id}/reino`, { reino_id: reinoId }),
};

// ------------------------------------------------------------
// Utilidades de tela
// ------------------------------------------------------------

/** Escapa texto antes de colocar em innerHTML. Todo dado vindo da API passa aqui. */
function escapar(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Mostra uma mensagem num elemento .form-msg (tipo: "erro" | "ok"). Vazio esconde. */
function mostrarMensagem(elemento, texto, tipo = "erro") {
  if (!elemento) return;
  elemento.textContent = texto || "";
  elemento.className = `form-msg ${texto ? `form-msg--${tipo}` : ""}`;
}

/** Desabilita o botão e troca o texto enquanto a ação roda. */
async function comCarregando(botao, acao, textoCarregando = "Aguarde...") {
  const original = botao.textContent;
  botao.disabled = true;
  botao.textContent = textoCarregando;
  try {
    return await acao();
  } finally {
    botao.disabled = false;
    botao.textContent = original;
  }
}
