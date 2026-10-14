// ============================================================
// LOGIN.JS — Login por nome de usuário OU e-mail, via API
// ============================================================

// Já logado? Vai direto para a área do perfil.
if (Sessao.token && Sessao.usuario) {
  window.location.replace(Sessao.destino());
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const identificador = document.getElementById("loginIdentificador").value.trim();
  const senha = document.getElementById("loginPassword").value;
  const lembrar = document.getElementById("rememberMe").checked;
  const msg = document.getElementById("loginMsg");
  const botao = document.getElementById("loginBtn");

  if (!identificador || !senha) {
    mostrarMensagem(msg, "Informe o usuário (ou e-mail) e a senha.");
    return;
  }
  mostrarMensagem(msg, "");

  try {
    const sessao = await comCarregando(botao, () => api.login(identificador, senha), "Entrando...");
    Sessao.salvar(sessao, lembrar);
    window.location.href = Sessao.destino(sessao.usuario);
  } catch (erro) {
    mostrarMensagem(msg, erro.message);
  }
});
