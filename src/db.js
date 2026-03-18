// ============================================
// COMUNIKE — src/db.js
// Banco de dados em memória + persistência JSON
// ============================================

const fs   = require("fs");
const path = require("path");

const SALAS_PATH     = path.join(__dirname, "../data/salas.json");
const MSGS_PATH      = path.join(__dirname, "../data/mensagens.json");

const MAX_MENSAGENS_POR_SALA = 100;

// ---- Helpers de I/O ----
function lerJSON(caminho, padrao) {
  try {
    if (fs.existsSync(caminho)) {
      return JSON.parse(fs.readFileSync(caminho, "utf-8"));
    }
  } catch (_) {}
  return padrao;
}

function salvarJSON(caminho, dados) {
  fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), "utf-8");
}

// ---- Estado em memória ----
let salas     = lerJSON(SALAS_PATH, []);
let mensagens = lerJSON(MSGS_PATH, {});

// Usuários online: { socketId: { apelido, salaId, avatar } }
const usuariosOnline = {};

// ============================================
// SALAS
// ============================================

function getSalas() {
  return salas.map((s) => ({
    ...s,
    membrosOnline: Object.values(usuariosOnline).filter((u) => u.salaId === s.id).length,
  }));
}

function getSalaById(id) {
  return salas.find((s) => s.id === id) || null;
}

function criarSala({ nome, descricao, categoria, criador }) {
  const sala = {
    id:        Date.now().toString(),
    nome:      nome.trim().slice(0, 60),
    descricao: (descricao || "").trim().slice(0, 120),
    categoria,
    criador,
    criadaEm:  new Date().toISOString(),
  };
  salas.push(sala);
  salvarJSON(SALAS_PATH, salas);
  return sala;
}

function editarSala(id, { nome, descricao, categoria }) {
  const idx = salas.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  salas[idx] = {
    ...salas[idx],
    nome:      nome.trim().slice(0, 60),
    descricao: (descricao || "").trim().slice(0, 120),
    categoria,
  };
  salvarJSON(SALAS_PATH, salas);
  return salas[idx];
}

function excluirSala(id) {
  salas = salas.filter((s) => s.id !== id);
  delete mensagens[id];
  salvarJSON(SALAS_PATH, salas);
  salvarJSON(MSGS_PATH, mensagens);
}

// ============================================
// MENSAGENS
// ============================================

function getMensagens(salaId) {
  return (mensagens[salaId] || []).slice(-50);
}

function adicionarMensagem(salaId, msg) {
  if (!mensagens[salaId]) mensagens[salaId] = [];
  mensagens[salaId].push(msg);
  if (mensagens[salaId].length > MAX_MENSAGENS_POR_SALA) {
    mensagens[salaId] = mensagens[salaId].slice(-MAX_MENSAGENS_POR_SALA);
  }
  salvarJSON(MSGS_PATH, mensagens);
  return msg;
}

function removerMensagem(salaId, msgId) {
  if (!mensagens[salaId]) return false;
  const antes = mensagens[salaId].length;
  mensagens[salaId] = mensagens[salaId].filter((m) => m.id !== msgId);
  salvarJSON(MSGS_PATH, mensagens);
  return mensagens[salaId].length < antes;
}

// ============================================
// USUÁRIOS ONLINE
// ============================================

function entrarSala(socketId, apelido, salaId, avatar) {
  usuariosOnline[socketId] = { apelido, salaId, avatar };
}

function sairSala(socketId) {
  const usuario = usuariosOnline[socketId];
  delete usuariosOnline[socketId];
  return usuario || null;
}

function getUsuariosDaSala(salaId) {
  return Object.values(usuariosOnline).filter((u) => u.salaId === salaId);
}

function getUsuarioPorSocket(socketId) {
  return usuariosOnline[socketId] || null;
}

// ---- Seed inicial se não houver salas ----
if (salas.length === 0) {
  const seed = [
    { nome: "Fotografia", descricao: "Compartilhe dicas, equipamentos e fotos!", categoria: "Arte e criatividade", criador: "admin" },
    { nome: "Games",      descricao: "Jogos, lançamentos e recomendações.",        categoria: "Tecnologia e games",   criador: "admin" },
    { nome: "Culinária",  descricao: "Receitas, técnicas e gastronomia.",           categoria: "Gastronomia",          criador: "admin" },
    { nome: "Leitura",    descricao: "Livros, resenhas e clubes do livro.",         categoria: "Conhecimento",         criador: "admin" },
    { nome: "Música",     descricao: "Bandas, instrumentos e playlists.",           categoria: "Arte e criatividade",  criador: "admin" },
    { nome: "Corrida",    descricao: "Treinos, provas e evolução pessoal.",          categoria: "Esportes",             criador: "admin" },
  ];
  seed.forEach((s) => criarSala(s));
}

module.exports = {
  getSalas, getSalaById, criarSala, editarSala, excluirSala,
  getMensagens, adicionarMensagem, removerMensagem,
  entrarSala, sairSala, getUsuariosDaSala, getUsuarioPorSocket,
};