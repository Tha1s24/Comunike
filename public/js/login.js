// ============================================
// COMUNIKE — js/login.js
// ============================================

document.addEventListener("DOMContentLoaded", function () {

  // Se já tem sessão válida, vai para salas
  // (usuário clicou em "Entrar" mas já estava logado)
  var sessao = lerSessao();
  if (sessao) {
    irPara("/salas");
    return;
  }

  var inputApelido = document.getElementById("inp-apelido");
  var inputSenha   = document.getElementById("inp-senha-login");
  var erroApelido  = document.getElementById("erro-apelido");
  var erroSenha    = document.getElementById("erro-senha-login");
  var btnEntrar    = document.getElementById("btn-entrar");

  function tentar() {
    var apelido = inputApelido.value.trim().replace(/\s+/g, "").slice(0, 24);
    var senha   = inputSenha ? inputSenha.value : "";

    erroApelido.textContent = "";
    if (erroSenha) erroSenha.textContent = "";

    // Valida apelido
    if (!apelido || apelido.length < 2) {
      erroApelido.textContent = "Apelido precisa ter pelo menos 2 caracteres.";
      inputApelido.focus();
      return;
    }

    // Valida senha obrigatória
    if (!senha || senha.trim().length === 0) {
      if (erroSenha) erroSenha.textContent = "Informe sua senha.";
      if (inputSenha) inputSenha.focus();
      return;
    }

    // Verifica se o cadastro existe e se a senha confere
    var raw    = localStorage.getItem("comunike_cadastro_" + apelido);
    var avatar = "🐱";

    if (raw) {
      try {
        var cadastro = JSON.parse(raw);
        // Verifica senha
        if (cadastro.senha && cadastro.senha !== senha) {
          if (erroSenha) erroSenha.textContent = "Senha incorreta.";
          if (inputSenha) inputSenha.focus();
          return;
        }
        avatar = cadastro.avatar || "🐱";
      } catch (e) {}
    } else {
      // Cadastro não encontrado — orienta o usuário
      erroApelido.textContent = "Apelido não cadastrado. Crie uma conta primeiro.";
      inputApelido.focus();
      return;
    }

    salvarSessao({ apelido: apelido, avatar: avatar });
    window.location.href = "/salas";
  }

  btnEntrar.addEventListener("click", tentar);

  inputApelido.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); tentar(); }
    erroApelido.textContent = "";
  });

  if (inputSenha) {
    inputSenha.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); tentar(); }
    });
    inputSenha.addEventListener("input", function () {
      if (erroSenha) erroSenha.textContent = "";
    });
  }

  inputApelido.addEventListener("input", function () {
    erroApelido.textContent = "";
  });

});