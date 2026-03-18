// ============================================
// COMUNIKE — js/utils.js
// Funções utilitárias compartilhadas entre páginas
// ============================================

// ---- SESSÃO DO USUÁRIO ----

var SESSAO_KEY = "comunike_usuario";

function salvarSessao(dados) {
  sessionStorage.setItem(SESSAO_KEY, JSON.stringify(dados));
}

function lerSessao() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSAO_KEY));
  } catch (e) {
    return null;
  }
}

function limparSessao() {
  sessionStorage.removeItem(SESSAO_KEY);
}

// ---- TOAST DE NOTIFICAÇÃO ----

function showToast(mensagem, tipo) {
  tipo = tipo || "ok";
  var container = document.getElementById("toast-container");
  if (!container) return;

  var toast = document.createElement("div");
  toast.className = "toast " + tipo;
  toast.textContent = mensagem;
  toast.setAttribute("role", "status");
  container.appendChild(toast);

  setTimeout(function () {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(function () { toast.remove(); }, 320);
  }, 3500);
}

// ---- FORMATAÇÃO DE HORA ----

function formatarHora(isoString) {
  var d = new Date(isoString);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

// ---- SANITIZAR HTML (prevenir XSS) ----

function sanitizar(str) {
  var div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---- MAPEAR CATEGORIA PARA CLASSE CSS ----

function catParaClasse(cat) {
  var mapa = {
    "Esportes":            "cat-esportes",
    "Tecnologia e games":  "cat-games",
    "Arte e criatividade": "cat-arte",
    "Gastronomia":         "cat-gastro",
    "Conhecimento":        "cat-conhecimento",
    "Colecionismo":        "cat-colecionismo"
  };
  return mapa[cat] || "cat-conhecimento";
}