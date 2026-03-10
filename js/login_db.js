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
    window.location.href = "character.html";
  });

});
