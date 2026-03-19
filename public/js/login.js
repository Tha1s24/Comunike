// ============================================
// COMUNIKE — js/login.js
// ============================================

document.addEventListener("DOMContentLoaded", function () {

  // Só redireciona se tiver sessão válida E não estiver já em /salas
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
    var senha   = inputSenha ? inputSenha.value : "ok";

    erroApelido.textContent = "";
    if (erroSenha) erroSenha.textContent = "";

    if (!apelido || apelido.length < 2) {
      erroApelido.textContent = "Apelido precisa ter pelo menos 2 caracteres.";
      inputApelido.focus();
      return;
    }

    if (inputSenha && !senha) {
      if (erroSenha) erroSenha.textContent = "Informe sua senha.";
      return;
    }

    // Recupera avatar do cadastro anterior se existir
    var avatar = "🐱";
    try {
      var raw = localStorage.getItem("comunike_cadastro_" + apelido);
      if (raw) {
        var dados = JSON.parse(raw);
        avatar = dados.avatar || "🐱";
      }
    } catch (e) {}

    salvarSessao({ apelido: apelido, avatar: avatar });
    window.location.href = "/salas";
  }

  btnEntrar.addEventListener("click", tentar);

  inputApelido.addEventListener("keydown", function (e) {
    if (e.key === "Enter") tentar();
    erroApelido.textContent = "";
  });

  if (inputSenha) {
    inputSenha.addEventListener("keydown", function (e) {
      if (e.key === "Enter") tentar();
    });
    inputSenha.addEventListener("input", function () {
      if (erroSenha) erroSenha.textContent = "";
    });
  }

  inputApelido.addEventListener("input", function () {
    erroApelido.textContent = "";
  });

});