// ============================================
// COMUNIKE — js/utils.js
// ============================================

var SESSAO_KEY = "ck_sessao_v2"; // chave nova para forçar reset de dados antigos

function salvarSessao(dados) {
  localStorage.setItem(SESSAO_KEY, JSON.stringify(dados));
}

function lerSessao() {
  try {
    var raw = localStorage.getItem(SESSAO_KEY);
    if (!raw) return null;
    var d = JSON.parse(raw);
    if (!d || typeof d.apelido !== "string" || d.apelido.length < 1) {
      localStorage.removeItem(SESSAO_KEY);
      return null;
    }
    return d;
  } catch (e) {
    localStorage.removeItem(SESSAO_KEY);
    return null;
  }
}

function limparSessao() {
  localStorage.removeItem(SESSAO_KEY);
}

function irPara(rota) {
  if (window.location.pathname !== rota) {
    window.location.href = rota;
  }
}

function showToast(mensagem, tipo) {
  tipo = tipo || "ok";
  var container = document.getElementById("toast-container");
  if (!container) return;
  var toast = document.createElement("div");
  toast.className = "toast " + tipo;
  toast.textContent = mensagem;
  container.appendChild(toast);
  setTimeout(function () {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(function () { toast.remove(); }, 320);
  }, 3500);
}

function formatarHora(isoString) {
  var d = new Date(isoString);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function sanitizar(str) {
  if (!str) return "";
  var div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

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