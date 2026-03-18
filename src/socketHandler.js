// ============================================
// COMUNIKE — src/socketHandler.js
// Todos os eventos de tempo real via Socket.IO
// ============================================

const FILTRO_PALAVROES = ["palavrao1", "palavrao2", "palavrao3"];
const MAX_CHARS = 500;

function filtrarTexto(texto) {
  let t = texto.trim().slice(0, MAX_CHARS);
  FILTRO_PALAVROES.forEach((p) => {
    const regex = new RegExp(p, "gi");
    t = t.replace(regex, "***");
  });
  return t;
}

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

module.exports = function socketHandler(io, db) {

  // Debounce de "digitando" por sala: { salaId: { socketId: timer } }
  const digitandoTimers = {};

  io.on("connection", (socket) => {
    console.log(`🔌 Conectado: ${socket.id}`);

    // ----------------------------------------
    // ENTRAR EM UMA SALA
    // ----------------------------------------
    socket.on("sala:entrar", ({ apelido, salaId, avatar }) => {
      const sala = db.getSalaById(salaId);
      if (!sala) return socket.emit("erro", "Sala não encontrada.");

      socket.join(salaId);
      db.entrarSala(socket.id, apelido, salaId, avatar);

      // Envia histórico ao usuário que entrou
      socket.emit("sala:historico", db.getMensagens(salaId));

      // Envia lista atualizada de membros para todos na sala
      io.to(salaId).emit("sala:membros", db.getUsuariosDaSala(salaId));

      // Notifica todos na sala
      io.to(salaId).emit("sala:sistema", {
        texto: `${apelido} entrou na sala 👋`,
        hora:  new Date().toISOString(),
      });

      console.log(`👤 ${apelido} entrou em "${sala.nome}"`);
    });

    // ----------------------------------------
    // ENVIAR MENSAGEM
    // ----------------------------------------
    socket.on("msg:enviar", ({ salaId, texto, emoji }) => {
      const usuario = db.getUsuarioPorSocket(socket.id);
      if (!usuario) return;
      if (!texto && !emoji) return;

      const textoFiltrado = texto ? filtrarTexto(texto) : "";

      const msg = {
        id:       gerarId(),
        salaId,
        apelido:  usuario.apelido,
        avatar:   usuario.avatar,
        texto:    textoFiltrado,
        emoji:    emoji || null,
        hora:     new Date().toISOString(),
      };

      db.adicionarMensagem(salaId, msg);
      io.to(salaId).emit("msg:nova", msg);

      // Cancela o "digitando" ao enviar
      if (digitandoTimers[salaId]?.[socket.id]) {
        clearTimeout(digitandoTimers[salaId][socket.id]);
        delete digitandoTimers[salaId][socket.id];
        io.to(salaId).emit("msg:digitando", getDigitandoList(salaId));
      }
    });

    // ----------------------------------------
    // INDICADOR DE DIGITAÇÃO (com debounce)
    // ----------------------------------------
    socket.on("msg:digitando", ({ salaId }) => {
      const usuario = db.getUsuarioPorSocket(socket.id);
      if (!usuario) return;

      if (!digitandoTimers[salaId]) digitandoTimers[salaId] = {};

      // Reseta o timer a cada tecla
      if (digitandoTimers[salaId][socket.id]) {
        clearTimeout(digitandoTimers[salaId][socket.id]);
      }

      digitandoTimers[salaId][socket.id] = setTimeout(() => {
        delete digitandoTimers[salaId][socket.id];
        io.to(salaId).emit("msg:digitando", getDigitandoList(salaId));
      }, 2500);

      io.to(salaId).emit("msg:digitando", getDigitandoList(salaId));
    });

    function getDigitandoList(salaId) {
      if (!digitandoTimers[salaId]) return [];
      return Object.keys(digitandoTimers[salaId]).map((sid) => {
        const u = db.getUsuarioPorSocket(sid);
        return u ? u.apelido : null;
      }).filter(Boolean);
    }

    // ----------------------------------------
    // REMOVER MENSAGEM (apenas criador da sala)
    // ----------------------------------------
    socket.on("msg:remover", ({ salaId, msgId }) => {
      const usuario = db.getUsuarioPorSocket(socket.id);
      const sala    = db.getSalaById(salaId);
      if (!usuario || !sala) return;
      if (sala.criador !== usuario.apelido) {
        return socket.emit("erro", "Apenas o criador da sala pode remover mensagens.");
      }
      const removida = db.removerMensagem(salaId, msgId);
      if (removida) {
        io.to(salaId).emit("msg:removida", msgId);
      }
    });

    // ----------------------------------------
    // REMOVER USUÁRIO DA SALA (apenas criador)
    // ----------------------------------------
    socket.on("usuario:remover", ({ salaId, apelidoAlvo }) => {
      const solicitante = db.getUsuarioPorSocket(socket.id);
      const sala        = db.getSalaById(salaId);
      if (!solicitante || !sala) return;
      if (sala.criador !== solicitante.apelido) {
        return socket.emit("erro", "Apenas o criador pode remover usuários.");
      }

      // Encontra o socket do usuário alvo
      const socketAlvo = Object.entries(io.sockets.sockets).find(([sid]) => {
        const u = db.getUsuarioPorSocket(sid);
        return u && u.apelido === apelidoAlvo && u.salaId === salaId;
      });

      if (socketAlvo) {
        const [sid] = socketAlvo;
        io.to(sid).emit("usuario:removido", "Você foi removido desta sala pelo criador.");
        io.sockets.sockets.get(sid)?.leave(salaId);
        db.sairSala(sid);
        io.to(salaId).emit("sala:membros", db.getUsuariosDaSala(salaId));
        io.to(salaId).emit("sala:sistema", {
          texto: `${apelidoAlvo} foi removido da sala.`,
          hora:  new Date().toISOString(),
        });
      }
    });

    // ----------------------------------------
    // DESCONEXÃO
    // ----------------------------------------
    socket.on("disconnect", () => {
      const usuario = db.sairSala(socket.id);
      if (usuario) {
        const { apelido, salaId } = usuario;

        // Limpa timers de digitação
        if (digitandoTimers[salaId]?.[socket.id]) {
          clearTimeout(digitandoTimers[salaId][socket.id]);
          delete digitandoTimers[salaId][socket.id];
          io.to(salaId).emit("msg:digitando", getDigitandoList(salaId));
        }

        io.to(salaId).emit("sala:membros", db.getUsuariosDaSala(salaId));
        io.to(salaId).emit("sala:sistema", {
          texto: `${apelido} saiu da sala.`,
          hora:  new Date().toISOString(),
        });
        console.log(`👋 ${apelido} desconectou.`);
      }
    });
  });
};