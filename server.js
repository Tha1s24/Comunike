// ============================================
// COMUNIKE — server.js
// Servidor principal: Express + Socket.IO
// ============================================

require("dotenv").config();

const express    = require("express");
const http       = require("http");
const { Server } = require("socket.io");
const path       = require("path");
const db         = require("./src/db");
const socketHandler = require("./src/socketHandler");
const fs = require("fs");
const path = require("path");

// Garante que a pasta data/ existe no servidor
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: "*" }
});

const PORT = process.env.PORT || 3000;

// ---- Middlewares ----
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---- Rotas de páginas ----
app.get("/",        (req, res) => res.sendFile(path.join(__dirname, "public", "pages", "login.html")));
app.get("/salas",   (req, res) => res.sendFile(path.join(__dirname, "public", "pages", "salas.html")));
app.get("/chat",    (req, res) => res.sendFile(path.join(__dirname, "public", "pages", "chat.html")));

// ---- API REST: Salas ----
app.get("/api/salas", (req, res) => {
  res.json(db.getSalas());
});

app.post("/api/salas", (req, res) => {
  const { nome, descricao, categoria, criador } = req.body;
  if (!nome || !categoria || !criador) {
    return res.status(400).json({ erro: "Campos obrigatórios: nome, categoria, criador." });
  }
  const sala = db.criarSala({ nome, descricao, categoria, criador });
  io.emit("sala:criada", sala);
  res.status(201).json(sala);
});

app.put("/api/salas/:id", (req, res) => {
  const { nome, descricao, categoria, solicitante } = req.body;
  const sala = db.getSalaById(req.params.id);
  if (!sala) return res.status(404).json({ erro: "Sala não encontrada." });
  if (sala.criador !== solicitante) return res.status(403).json({ erro: "Apenas o criador pode editar a sala." });
  const atualizada = db.editarSala(req.params.id, { nome, descricao, categoria });
  io.emit("sala:atualizada", atualizada);
  res.json(atualizada);
});

app.delete("/api/salas/:id", (req, res) => {
  const { solicitante } = req.body;
  const sala = db.getSalaById(req.params.id);
  if (!sala) return res.status(404).json({ erro: "Sala não encontrada." });
  if (sala.criador !== solicitante) return res.status(403).json({ erro: "Apenas o criador pode excluir a sala." });
  db.excluirSala(req.params.id);
  io.emit("sala:excluida", req.params.id);
  res.json({ ok: true });
});

app.get("/api/salas/:id/mensagens", (req, res) => {
  res.json(db.getMensagens(req.params.id));
});

// ---- Socket.IO ----
socketHandler(io, db);

// ---- Start ----
server.listen(PORT, () => {
  console.log(`✅ Comunike rodando em http://localhost:${PORT}`);
});