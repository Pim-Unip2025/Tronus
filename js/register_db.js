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

    // Validações de formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value && !emailRegex.test(email.value)) {
      email.classList.add("input-error");
      alert("Formato de e-mail inválido.");
      return;
    }

    if (password.value && password.value.length < 6) {
      password.classList.add("input-error");
      alert("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    const celularLimpo = celular.value.replace(/\D/g, "");
    if (celular.value && (celularLimpo.length < 10 || celularLimpo.length > 11)) {
      celular.classList.add("input-error");
      alert("Celular inválido. Use DDD + número (10 ou 11 dígitos).");
      return;
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
