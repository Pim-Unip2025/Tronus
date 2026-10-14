// ============================================================
// CADASTRO.JS — Cadastro de aluno via API
// As regras são as mesmas da API; conferir aqui só adianta a mensagem.
// ============================================================

const SENHA_FORTE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const campos = {
    nome: document.getElementById("name"),
    email: document.getElementById("email"),
    celular: document.getElementById("celular"),
    senha: document.getElementById("password"),
    confirmar: document.getElementById("confirmPassword"),
  };
  const msg = document.getElementById("registerMsg");
  const botao = document.getElementById("registerBtn");

  Object.values(campos).forEach((c) => c.classList.remove("input-error"));

  const falhar = (campo, texto) => {
    campo.classList.add("input-error");
    campo.focus();
    mostrarMensagem(msg, texto);
  };

  const nome = campos.nome.value.trim();
  const email = campos.email.value.trim();
  const celular = campos.celular.value.replace(/\D/g, "");

  if (nome.length < 3) return falhar(campos.nome, "O nome de usuário deve ter pelo menos 3 caracteres.");
  if (/[\s@]/.test(nome)) return falhar(campos.nome, 'O nome de usuário não pode ter espaços nem "@".');
  if (celular.length < 10 || celular.length > 11)
    return falhar(campos.celular, "Celular inválido. Use DDD + número (10 ou 11 dígitos).");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return falhar(campos.email, "Formato de e-mail inválido.");
  if (!SENHA_FORTE.test(campos.senha.value))
    return falhar(
      campos.senha,
      "A senha deve ter no mínimo 8 caracteres, com letra maiúscula, letra minúscula, número e símbolo.",
    );
  if (campos.senha.value !== campos.confirmar.value) return falhar(campos.confirmar, "As senhas não conferem.");

  mostrarMensagem(msg, "");
  try {
    const sessao = await comCarregando(
      botao,
      () => api.cadastrar({ nome, email, celular, senha: campos.senha.value }),
      "Criando conta...",
    );
    Sessao.salvar(sessao, true);
    // Aluno novo ainda não tem personagem.
    window.location.href = "character.html";
  } catch (erro) {
    mostrarMensagem(msg, erro.message);
  }
});
