// ============================================
// COMUNIKE — js/cadastro.js
// Lógica da tela de cadastro
// ============================================

document.addEventListener("DOMContentLoaded", function () {

  // Se já tem sessão, redireciona
  if (lerSessao()) {
    window.location.href = "salas.html";
    return;
  }

  var avatarSelecionado  = "🐱";
  var hobbysSelecionados = [];

  // ---- Referências dos elementos ----
  var inputApelido = document.getElementById("inp-apelido");
  var inputEmail   = document.getElementById("inp-email");
  var inputSenha   = document.getElementById("inp-senha");
  var erroApelido  = document.getElementById("erro-apelido");
  var erroEmail    = document.getElementById("erro-email");
  var erroSenha    = document.getElementById("erro-senha");
  var erroHobbies  = document.getElementById("erro-hobbies");
  var forcaLabel   = document.getElementById("forca-label");
  var btnCadastrar = document.getElementById("btn-cadastrar");
  var modalSucesso = document.getElementById("modal-sucesso");
  var sucessoDesc  = document.getElementById("sucesso-desc");
  var sucessoBarra = document.getElementById("sucesso-barra");

  var forcaBars = [
    document.getElementById("forca-1"),
    document.getElementById("forca-2"),
    document.getElementById("forca-3"),
    document.getElementById("forca-4")
  ];

  var coresForca  = ["#e84b3a", "#e6a817", "#2d9b6f", "#28a86e"];
  var labelsForca = ["", "Fraca", "Média", "Forte"];

  // ============================================
  // SELEÇÃO DE AVATAR
  // Todos os botões são type="button" no HTML,
  // garantindo que não disparam o submit
  // ============================================
  var avatarBtns = document.querySelectorAll(".avatar-btn");
  avatarBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      avatarBtns.forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      avatarSelecionado = btn.dataset.avatar;
    });
  });

  // ============================================
  // SELEÇÃO DE HOBBIES (máximo 3)
  // ============================================
  var hobbyBtns = document.querySelectorAll(".hobby-btn");
  hobbyBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var hobby = btn.dataset.hobby;
      var idx   = hobbysSelecionados.indexOf(hobby);

      if (idx !== -1) {
        hobbysSelecionados.splice(idx, 1);
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      } else {
        if (hobbysSelecionados.length >= 3) {
          showToast("Máximo de 3 hobbies.", "aviso");
          return;
        }
        hobbysSelecionados.push(hobby);
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
      }

      erroHobbies.textContent = "";
    });
  });

  // ============================================
  // INDICADOR DE FORÇA DA SENHA
  // ============================================
  inputSenha.addEventListener("input", function () {
    var v     = inputSenha.value;
    var nivel = 0;

    if (v.length >= 6)                        nivel++;
    if (v.length >= 10)                       nivel++;
    if (/[A-Z]/.test(v) && /[0-9]/.test(v))  nivel++;
    if (/[^A-Za-z0-9]/.test(v))              nivel++;

    forcaBars.forEach(function (bar, i) {
      bar.style.background = (i < nivel) ? coresForca[nivel - 1] : "var(--border2)";
    });

    forcaLabel.textContent  = nivel > 0 ? labelsForca[nivel] : "";
    erroSenha.textContent   = "";
  });

  // ============================================
  // LIMPAR ERROS AO DIGITAR
  // ============================================
  inputApelido.addEventListener("input", function () { erroApelido.textContent = ""; });
  inputEmail.addEventListener("input",   function () { erroEmail.textContent   = ""; });

  // ============================================
  // VALIDAÇÃO E SUBMISSÃO
  // Usa type="button" no botão — sem form submit
  // ============================================
  btnCadastrar.addEventListener("click", function () {
    var apelido = inputApelido.value.trim().replace(/\s+/g, "");
    var email   = inputEmail.value.trim();
    var senha   = inputSenha.value;
    var valido  = true;

    // Limpa todos os erros
    erroApelido.textContent = "";
    erroEmail.textContent   = "";
    erroSenha.textContent   = "";
    erroHobbies.textContent = "";

    // Valida apelido
    if (!apelido || apelido.length < 2) {
      erroApelido.textContent = "Apelido precisa ter pelo menos 2 caracteres.";
      inputApelido.focus();
      valido = false;
    }

    // Valida e-mail
    if (!email || !email.includes("@") || !email.includes(".")) {
      erroEmail.textContent = "Informe um e-mail válido.";
      valido = false;
    }

    // Valida senha
    if (!senha || senha.length < 6) {
      erroSenha.textContent = "Senha precisa ter pelo menos 6 caracteres.";
      valido = false;
    }

    if (!valido) return;

    // Monta dados da sessão
    var dados = {
      apelido:  apelido,
      email:    email,
      avatar:   avatarSelecionado,
      hobbies:  hobbysSelecionados.slice()
    };

    // Persiste no localStorage para login futuro
    localStorage.setItem("comunike_cadastro_" + apelido, JSON.stringify(dados));

    // Salva sessão ativa
    salvarSessao(dados);

    // ---- Exibe mini modal de sucesso ----
    abrirModalSucesso(apelido);
  });

  // ============================================
  // MINI MODAL DE SUCESSO COM BARRA DE PROGRESSO
  // ============================================
  function abrirModalSucesso(apelido) {
    sucessoDesc.textContent = "Bem-vindo(a), " + apelido + "! Redirecionando para as salas...";
    modalSucesso.hidden     = false;
    document.body.style.overflow = "hidden";

    // Anima a barra de progresso em 2.5s
    var duracao  = 2500;
    var inicio   = null;

    function animar(timestamp) {
      if (!inicio) inicio = timestamp;
      var progresso = Math.min((timestamp - inicio) / duracao, 1);
      sucessoBarra.style.width = (progresso * 100).toFixed(1) + "%";
      if (progresso < 1) {
        requestAnimationFrame(animar);
      } else {
        window.location.href = "salas.html";
      }
    }

    requestAnimationFrame(animar);
  }

});