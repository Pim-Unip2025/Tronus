// ============================================================
// LOGIN_DB.JS — Login por nome de usuário OU email
// ============================================================

initDatabase().then(() => {

  const form = document.getElementById("loginForm");

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const identificador = document.getElementById("loginIdentificador").value;
    const password      = document.getElementById("loginPassword").value;

    const usuario = loginUsuario(identificador, password);

    if (!usuario) {
      alert("Usuário ou senha incorretos.");
      return;
    }

    sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

    // Redireciona conforme o papel do usuário
    if (usuario.papel === 'admin') {
      window.location.href = "admin.html";
      return;
    }
    if (usuario.papel === 'professor') {
      window.location.href = "professor.html";
      return;
    }

    const personagem = buscarPersonagem(usuario.id);
    if (personagem) {
      window.location.href = "reinos.html";
    } else {
      window.location.href = "character.html";
    }
  });

});
