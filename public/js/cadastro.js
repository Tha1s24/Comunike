// ============================================
// COMUNIKE — js/cadastro.js
// ============================================

document.addEventListener("DOMContentLoaded", function () {

  // Página de cadastro NUNCA redireciona automaticamente.

  var avatarSelecionado  = "🐱";
  var hobbysSelecionados = [];

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

  // ---- Avatar ----
  document.querySelectorAll(".avatar-btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelectorAll(".avatar-btn").forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      avatarSelecionado = btn.dataset.avatar;
    });
  });

  // ---- Hobbies ----
  document.querySelectorAll(".hobby-btn").forEach(function (btn) {
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
      if (erroHobbies) erroHobbies.textContent = "";
    });
  });

  // ---- Força da senha ----
  if (inputSenha) {
    inputSenha.addEventListener("input", function () {
      var v = inputSenha.value;
      var nivel = 0;
      if (v.length >= 6)                       nivel++;
      if (v.length >= 10)                      nivel++;
      if (/[A-Z]/.test(v) && /[0-9]/.test(v)) nivel++;
      if (/[^A-Za-z0-9]/.test(v))             nivel++;
      forcaBars.forEach(function (bar, i) {
        bar.style.background = (i < nivel) ? coresForca[nivel - 1] : "var(--border2)";
      });
      if (forcaLabel) forcaLabel.textContent = nivel > 0 ? labelsForca[nivel] : "";
      if (erroSenha)  erroSenha.textContent  = "";
    });
  }

  if (inputApelido) inputApelido.addEventListener("input", function () { if (erroApelido) erroApelido.textContent = ""; });
  if (inputEmail)   inputEmail.addEventListener("input",   function () { if (erroEmail)   erroEmail.textContent   = ""; });

  // ---- Submissão ----
  if (btnCadastrar) {
    btnCadastrar.addEventListener("click", function () {
      var apelido = inputApelido ? inputApelido.value.trim().replace(/\s+/g, "") : "";
      var email   = inputEmail   ? inputEmail.value.trim()   : "";
      var senha   = inputSenha   ? inputSenha.value          : "";
      var valido  = true;

      if (erroApelido) erroApelido.textContent = "";
      if (erroEmail)   erroEmail.textContent   = "";
      if (erroSenha)   erroSenha.textContent   = "";
      if (erroHobbies) erroHobbies.textContent = "";

      if (!apelido || apelido.length < 2) {
        if (erroApelido) erroApelido.textContent = "Apelido precisa ter pelo menos 2 caracteres.";
        if (inputApelido) inputApelido.focus();
        valido = false;
      }
      if (!email || !email.includes("@") || !email.includes(".")) {
        if (erroEmail) erroEmail.textContent = "Informe um e-mail válido.";
        valido = false;
      }
      if (!senha || senha.length < 6) {
        if (erroSenha) erroSenha.textContent = "Senha precisa ter pelo menos 6 caracteres.";
        valido = false;
      }
      if (!valido) return;

      // Verifica se apelido já existe
      if (localStorage.getItem("ck_cadastro_" + apelido)) {
        if (erroApelido) erroApelido.textContent = "Este apelido já está em uso. Escolha outro.";
        if (inputApelido) inputApelido.focus();
        return;
      }

      // Salva cadastro completo com senha
      var cadastro = {
        apelido: apelido,
        email:   email,
        senha:   senha,
        avatar:  avatarSelecionado,
        hobbies: hobbysSelecionados.slice()
      };
      localStorage.setItem("ck_cadastro_" + apelido, JSON.stringify(cadastro));

      // Salva sessão ativa (sem a senha)
      salvarSessao({ apelido: apelido, avatar: avatarSelecionado });

      // Mostra modal de sucesso
      abrirModalSucesso(apelido);
    });
  }

  // ---- Modal de sucesso ----
  function abrirModalSucesso(apelido) {
    if (sucessoDesc)  sucessoDesc.textContent = "Bem-vindo(a), " + apelido + "! Redirecionando...";
    if (modalSucesso) {
      modalSucesso.hidden = false;
      document.body.style.overflow = "hidden";
    }
    var duracao = 2500;
    var inicio  = null;
    function animar(ts) {
      if (!inicio) inicio = ts;
      var p = Math.min((ts - inicio) / duracao, 1);
      if (sucessoBarra) sucessoBarra.style.width = (p * 100).toFixed(1) + "%";
      if (p < 1) { requestAnimationFrame(animar); }
      else { window.location.href = "/salas"; }
    }
    requestAnimationFrame(animar);
  }

});