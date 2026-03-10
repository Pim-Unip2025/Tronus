// ============================================================
// REGISTER_DB.JS — Cadastro com celular
// ============================================================

initDatabase().then(() => {

  const form = document.getElementById("registerForm");

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const name            = document.getElementById("name");
    const email           = document.getElementById("email");
    const celular         = document.getElementById("celular");
    const password        = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    let valid = true;

    [name, email, celular, password, confirmPassword].forEach(input => {
      input.classList.remove("input-error");
    });

    if (name.value === "")            { name.classList.add("input-error");            valid = false; }
    if (email.value === "")           { email.classList.add("input-error");           valid = false; }
    if (celular.value === "")         { celular.classList.add("input-error");         valid = false; }
    if (password.value === "")        { password.classList.add("input-error");        valid = false; }
    if (confirmPassword.value === "") { confirmPassword.classList.add("input-error"); valid = false; }

    if (password.value !== confirmPassword.value) {
      password.classList.add("input-error");
      confirmPassword.classList.add("input-error");
      valid = false;
    }

    if (!valid) return;

    const resultado = cadastrarUsuario(name.value, email.value, celular.value, password.value);

    if (resultado.sucesso) {
      const usuario = loginUsuario(name.value, password.value);
      sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      window.location.href = "character.html";
    } else {
      alert(resultado.erro);
    }
  });

});
