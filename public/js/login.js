// ============================================
// COMUNIKE — js/login.js
// ============================================

document.addEventListener("DOMContentLoaded", function () {

  // Página de login NUNCA redireciona automaticamente.
  // O usuário chegou aqui porque quer entrar — deixa ele entrar.

  var inputApelido = document.getElementById("inp-apelido");
  var inputSenha   = document.getElementById("inp-senha-login");
  var erroApelido  = document.getElementById("erro-apelido");
  var erroSenha    = document.getElementById("erro-senha-login");
  var btnEntrar    = document.getElementById("btn-entrar");

  if (!btnEntrar) return;

  function tentar() {
    var apelido = inputApelido.value.trim().replace(/\s+/g, "").slice(0, 24);
    var senha   = inputSenha ? inputSenha.value : "";

    if (erroApelido) erroApelido.textContent = "";
    if (erroSenha)   erroSenha.textContent   = "";

    if (!apelido || apelido.length < 2) {
      if (erroApelido) erroApelido.textContent = "Apelido precisa ter pelo menos 2 caracteres.";
      if (inputApelido) inputApelido.focus();
      return;
    }

    if (!senha || senha.trim().length === 0) {
      if (erroSenha) erroSenha.textContent = "Informe sua senha.";
      if (inputSenha) inputSenha.focus();
      return;
    }

    // Verifica cadastro salvo
    var raw = localStorage.getItem("ck_cadastro_" + apelido);
    if (!raw) {
      if (erroApelido) erroApelido.textContent = "Apelido não encontrado. Crie uma conta primeiro.";
      if (inputApelido) inputApelido.focus();
      return;
    }

    try {
      var cadastro = JSON.parse(raw);
      if (cadastro.senha !== senha) {
        if (erroSenha) erroSenha.textContent = "Senha incorreta.";
        if (inputSenha) inputSenha.focus();
        return;
      }
      // Login OK
      salvarSessao({ apelido: cadastro.apelido, avatar: cadastro.avatar || "🐱" });
      window.location.href = "/salas";
    } catch (e) {
      if (erroApelido) erroApelido.textContent = "Erro ao verificar cadastro. Tente novamente.";
    }
  }

  btnEntrar.addEventListener("click", tentar);

  if (inputApelido) {
    inputApelido.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); tentar(); }
      if (erroApelido) erroApelido.textContent = "";
    });
  }

  if (inputSenha) {
    inputSenha.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); tentar(); }
    });
    inputSenha.addEventListener("input", function () {
      if (erroSenha) erroSenha.textContent = "";
    });
  }

});