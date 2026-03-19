// ============================================
// COMUNIKE — js/utils.js
// Funções utilitárias compartilhadas
// ============================================

var SESSAO_KEY = "comunike_usuario";

// ---- SESSÃO ----
// Usa localStorage para persistir entre rotas no servidor

function salvarSessao(dados) {
  localStorage.setItem(SESSAO_KEY, JSON.stringify(dados));
}

function lerSessao() {
  try {
    var raw = localStorage.getItem(SESSAO_KEY);
    if (!raw) return null;
    var dados = JSON.parse(raw);
    // Garante que a sessão tem pelo menos o apelido válido
    if (!dados || typeof dados.apelido !== "string" || dados.apelido.length < 1) {
      localStorage.removeItem(SESSAO_KEY);
      return null;
    }
    return dados;
  } catch (e) {
    localStorage.removeItem(SESSAO_KEY);
    return null;
  }
}

function limparSessao() {
  localStorage.removeItem(SESSAO_KEY);
}

// ---- REDIRECIONAMENTO SEGURO (evita loops) ----
// Só redireciona se não estiver já na página de destino

function irPara(rota) {
  if (window.location.pathname !== rota) {
    window.location.href = rota;
  }
}

// ---- TOAST ----

function showToast(mensagem, tipo) {
  tipo = tipo || "ok";
  var container = document.getElementById("toast-container");
  if (!container) return;
  var toast = document.createElement("div");
  toast.className   = "toast " + tipo;
  toast.textContent = mensagem;
  toast.setAttribute("role", "status");
  container.appendChild(toast);
  setTimeout(function () {
    toast.style.opacity   = "0";
    toast.style.transform = "translateX(20px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(function () { toast.remove(); }, 320);
  }, 3500);
}

// ---- HORA ----

function formatarHora(isoString) {
  var d = new Date(isoString);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

// ---- SANITIZAR ----

function sanitizar(str) {
  if (!str) return "";
  var div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

// ---- CATEGORIA → CLASSE CSS ----

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