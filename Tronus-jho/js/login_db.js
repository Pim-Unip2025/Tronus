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

const personagem = buscarPersonagem(usuario.id);

/* MOSTRA TELA DE CARREGAMENTO */
document.getElementById("loading-screen").style.display = "block";
document.body.style.overflow = "hidden";

/* ESPERA 2 SEGUNDOS */

setTimeout(() => {

  if (personagem) {
    window.location.href = "reinos.html";
  } else {
    window.location.href = "character.html";
  }

}, 2000);
  });
});