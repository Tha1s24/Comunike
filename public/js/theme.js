// ============================================
// COMUNIKE — js/theme.js
// Gerenciamento de tema claro/escuro
// ============================================

const TEMA_KEY = "comunike_tema";

function aplicarTema(tema) {
  document.documentElement.setAttribute("data-theme", tema);
  localStorage.setItem(TEMA_KEY, tema);
}

function alternarTema() {
  const atual = document.documentElement.getAttribute("data-theme");
  aplicarTema(atual === "dark" ? "light" : "dark");
}

function iniciarTema() {
  const salvo   = localStorage.getItem(TEMA_KEY);
  const prefere = window.matchMedia("(prefers-color-scheme: dark)").matches;
  aplicarTema(salvo || (prefere ? "dark" : "light"));
}

// Inicia o tema ao carregar o script
iniciarTema();

// Registra o botão de alternância quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", function () {
  var btn = document.getElementById("btn-theme");
  if (btn) {
    btn.addEventListener("click", alternarTema);
  }
});