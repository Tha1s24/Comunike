// ============================================
// COMUNIKE — js/login.js
// Lógica da tela de login
// ============================================

document.addEventListener("DOMContentLoaded", function () {

  // Se já tem sessão ativa, redireciona direto
  if (lerSessao()) {
    window.location.href = "salas.html";
    return;
  }

  var inputApelido = document.getElementById("inp-apelido");
  var inputSenha   = document.getElementById("inp-senha-login");
  var erroApelido  = document.getElementById("erro-apelido");
  var erroSenha    = document.getElementById("erro-senha-login");
  var btnEntrar    = document.getElementById("btn-entrar");

  // ---- Submissão via botão type="button" ----
  btnEntrar.addEventListener("click", function () {
    var apelido = inputApelido.value.trim().replace(/\s+/g, "").slice(0, 24);
    var senha   = inputSenha ? inputSenha.value : "ok";

    erroApelido.textContent = "";
    if (erroSenha) erroSenha.textContent = "";

    var valido = true;

    if (!apelido || apelido.length < 2) {
      erroApelido.textContent = "Apelido precisa ter pelo menos 2 caracteres.";
      inputApelido.focus();
      valido = false;
    }

    if (inputSenha && !senha) {
      erroSenha.textContent = "Informe sua senha.";
      valido = false;
    }

    if (!valido) return;

    // Recupera avatar salvo no cadastro se existir, senão usa padrão
    var sessaoExistente = localStorage.getItem("comunike_cadastro_" + apelido);
    var avatar = "🐱";
    if (sessaoExistente) {
      try {
        var dados = JSON.parse(sessaoExistente);
        avatar = dados.avatar || "🐱";
      } catch (e) {}
    }

    salvarSessao({ apelido: apelido, avatar: avatar });
    window.location.href = "salas.html";
  });

  // Permite entrar com Enter nos campos
  inputApelido.addEventListener("keydown", function (e) {
    if (e.key === "Enter") btnEntrar.click();
    erroApelido.textContent = "";
  });

  if (inputSenha) {
    inputSenha.addEventListener("keydown", function (e) {
      if (e.key === "Enter") btnEntrar.click();
    });
    inputSenha.addEventListener("input", function () {
      if (erroSenha) erroSenha.textContent = "";
    });
  }

});