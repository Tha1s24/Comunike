// ============================================
// COMUNIKE — js/chat.js
// Chat com localStorage + voz + arquivos
// ============================================

var EMOJI_CATS = {
  "😀": ["😀","😂","😍","🥰","😎","🤔","😅","🙄","😢","😡","😱","🤯","😴","🤗","😏","🥳","😇","🤩","🥺","😤","😬","🫠"],
  "👍": ["👍","👏","🙌","🤝","💪","✌️","🫶","❤️","🔥","⭐","🎉","✅","💯","🙏","👀","💬","💡","🚀","🎨","📸"],
  "🐱": ["🐱","🐶","🦊","🐧","🦁","🐸","🐼","🦋","🐻","🐨","🦄","🐙","🌸","🌟","🍕","☕","🎮","🎵","🏀","🎲"]
};
var EMOJI_LABELS = { "😀": "Rostos", "👍": "Gestos", "🐱": "Outros" };

document.addEventListener("DOMContentLoaded", function () {

  // ---- Sessão ----
  var usuario = lerSessao();
  if (!usuario) { window.location.href = "/login"; return; }

  // ---- Parâmetro da sala ----
  var params = new URLSearchParams(window.location.search);
  var salaId = params.get("sala");
  if (!salaId) { window.location.href = "/salas"; return; }

  // ---- localStorage ----
  var SALAS_KEY = "comunike_salas";
  var MSGS_KEY  = "comunike_msgs_" + salaId;
  var MAX_MSGS  = 100;

  function lerSalasLocal() {
    try { return JSON.parse(localStorage.getItem(SALAS_KEY)) || []; }
    catch (e) { return []; }
  }
  function lerMsgsLocal() {
    try { return JSON.parse(localStorage.getItem(MSGS_KEY)) || []; }
    catch (e) { return []; }
  }
  function salvarMsgsLocal(lista) {
    if (lista.length > MAX_MSGS) lista = lista.slice(-MAX_MSGS);
    localStorage.setItem(MSGS_KEY, JSON.stringify(lista));
  }
  function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  // ---- Carrega sala ----
  var salas    = lerSalasLocal();
  var salaInfo = salas.find(function (s) { return s.id === salaId; });
  if (!salaInfo) {
    showToast("Sala não encontrada.", "erro");
    setTimeout(function () { window.location.href = "/salas"; }, 1500);
    return;
  }

  var eCriador  = salaInfo.criador === usuario.apelido;
  var mensagens = lerMsgsLocal();

  // ---- Preenche cabeçalho ----
  var cls = catParaClasse(salaInfo.categoria);
  document.getElementById("sala-info").innerHTML =
    '<div class="sala-info-nome">' + sanitizar(salaInfo.nome) + "</div>" +
    '<span class="sala-info-cat ' + cls + '">' + sanitizar(salaInfo.categoria) + "</span>";
  document.getElementById("chat-header-nome").textContent   = salaInfo.nome;
  document.getElementById("chat-header-online").textContent = "chat local";
  document.title = "Comunike — " + salaInfo.nome;

  renderMembros([{ apelido: usuario.apelido, avatar: usuario.avatar || "🐱" }]);

  // ============================================
  // ELEMENTOS DOM
  // ============================================
  var chatMsgs       = document.getElementById("chat-mensagens");
  var inputMsg       = document.getElementById("inp-msg");
  var charsContador  = document.getElementById("chars-contador");
  var typingEl       = document.getElementById("typing-indicator");
  var btnEnviar      = document.getElementById("btn-enviar");
  var btnVoz         = document.getElementById("btn-voz");
  var btnEmojiToggle = document.getElementById("btn-emoji-toggle");
  var emojiPicker    = document.getElementById("emoji-picker");
  var emojiGrid      = document.getElementById("emoji-grid");
  var emojiCatsCont  = document.getElementById("emoji-categorias");
  var btnUpload      = document.getElementById("btn-upload");
  var inpArquivo     = document.getElementById("inp-arquivo");
  var arquivoPreview = document.getElementById("arquivo-preview");
  var arquivoNome    = document.getElementById("arquivo-preview-nome");
  var arquivoIcone   = document.getElementById("arquivo-preview-icone");
  var arquivoRemover = document.getElementById("arquivo-preview-remover");
  var vozPreview     = document.getElementById("voz-preview");
  var vozTimer       = document.getElementById("voz-timer");
  var vozParar       = document.getElementById("voz-parar");
  var vozCancelar    = document.getElementById("voz-cancelar");
  var lightbox       = document.getElementById("lightbox");
  var lightboxImg    = document.getElementById("lightbox-img");
  var lightboxFechar = document.getElementById("lightbox-fechar");
  var sidebar        = document.getElementById("chat-sidebar");
  var btnMembros     = document.getElementById("btn-membros");
  var btnFecharSb    = document.getElementById("btn-fechar-sidebar");

  var arquivoSelecionado = null;

  // ============================================
  // HISTÓRICO
  // ============================================
  mensagens.forEach(renderMsg);
  scrollBaixo(false);

  // ============================================
  // RENDER MENSAGEM
  // ============================================
  function renderMsg(msg) {
    var minha   = msg.apelido === usuario.apelido;
    var podeDel = minha || eCriador; // dono da msg ou criador da sala

    var item = document.createElement("div");
    item.className     = "msg-item";
    item.dataset.msgId = msg.id;
    item.setAttribute("role", "listitem");

    var conteudo = "";

    // -- ÁUDIO --
    if (msg.audio) {
      conteudo =
        '<div class="msg-audio-wrap">' +
          '<span class="msg-audio-icone" aria-hidden="true">🎙️</span>' +
          '<audio class="msg-audio-player" controls preload="none" src="' + msg.audio.dataUrl + '"' +
            ' aria-label="Mensagem de voz de ' + sanitizar(msg.apelido) + '"></audio>' +
          '<span class="msg-audio-dur">' + msg.audio.duracao + '</span>' +
        '</div>';

    // -- IMAGEM --
    } else if (msg.arquivo && msg.arquivo.tipo && msg.arquivo.tipo.startsWith("image/")) {
      conteudo =
        '<div class="msg-imagem-wrap">' +
          '<img class="msg-imagem" src="' + msg.arquivo.dataUrl +
          '" alt="' + sanitizar(msg.arquivo.nome) + '" loading="lazy">' +
        '</div>';
      if (msg.texto) conteudo += '<span class="msg-texto">' + sanitizar(msg.texto) + "</span>";

    // -- ARQUIVO GENÉRICO --
    } else if (msg.arquivo) {
      var ext = msg.arquivo.nome.split(".").pop().toUpperCase();
      conteudo =
        '<div class="msg-arquivo">' +
          '<span class="msg-arquivo-ext">' + sanitizar(ext) + "</span>" +
          '<div class="msg-arquivo-info">' +
            '<span class="msg-arquivo-nome">' + sanitizar(msg.arquivo.nome) + "</span>" +
            '<span class="msg-arquivo-tam">'  + formatarTamanho(msg.arquivo.tamanho) + "</span>" +
          "</div>" +
          '<a class="msg-arquivo-baixar" href="' + msg.arquivo.dataUrl +
          '" download="' + sanitizar(msg.arquivo.nome) + '" aria-label="Baixar">⬇</a>' +
        "</div>";
      if (msg.texto) conteudo += '<span class="msg-texto">' + sanitizar(msg.texto) + "</span>";

    // -- EMOJI PURO --
    } else if (msg.emoji && !msg.texto) {
      conteudo = '<span class="msg-emoji-grande">' + msg.emoji + "</span>";

    // -- TEXTO --
    } else {
      var textoFinal = (msg.emoji ? msg.emoji + " " : "") + (msg.texto || "");
      conteudo = '<span class="msg-texto">' + sanitizar(textoFinal) + "</span>";
    }

    item.innerHTML =
      '<span class="msg-avatar" aria-hidden="true">' + sanitizar(msg.avatar || "🐱") + "</span>" +
      '<div class="msg-corpo">' +
        '<div class="msg-cabecalho">' +
          '<span class="msg-apelido">' + sanitizar(msg.apelido) +
            (minha ? ' <span class="msg-voce">você</span>' : "") + "</span>" +
          '<time class="msg-hora" datetime="' + msg.hora + '">' + formatarHora(msg.hora) + "</time>" +
        "</div>" +
        conteudo +
      "</div>" +
      (podeDel
        ? '<div class="msg-acoes"><button class="btn-del-msg" type="button" data-id="' + msg.id + '" aria-label="' + (minha ? 'Apagar minha mensagem' : 'Remover mensagem') + '" title="' + (minha ? 'Apagar' : 'Remover') + '">🗑</button></div>'
        : "");

    // Lightbox imagem
    var imgEl = item.querySelector(".msg-imagem");
    if (imgEl) {
      imgEl.addEventListener("click", function () {
        lightboxImg.src = imgEl.src;
        lightboxImg.alt = imgEl.alt;
        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
      });
    }

    // Remover mensagem
    if (podeDel) {
      item.querySelector(".btn-del-msg").addEventListener("click", function (e) {
        e.stopPropagation();
        var pergunta = minha
          ? "Apagar sua mensagem? Esta ação não pode ser desfeita."
          : "Remover a mensagem de " + msg.apelido + "?";
        if (!confirm(pergunta)) return;
        removerMsg(msg.id);
      });
    }

    chatMsgs.appendChild(item);
  }

  // ============================================
  // RENDER MEMBROS
  // ============================================
  function renderMembros(lista) {
    var contador = document.getElementById("membros-contador");
    if (contador) contador.textContent = lista.length;
    var onlineEl = document.getElementById("chat-header-online");
    if (onlineEl) onlineEl.textContent = lista.length + " participante" + (lista.length !== 1 ? "s" : "");
    var membrosList = document.getElementById("membros-lista");
    if (!membrosList) return;
    membrosList.innerHTML = lista.map(function (m) {
      var isCriador = salaInfo && m.apelido === salaInfo.criador;
      return '<li class="membro-item" role="listitem">' +
        '<span class="membro-avatar" aria-hidden="true">' + sanitizar(m.avatar || "🐱") + "</span>" +
        '<span class="membro-apelido">' + sanitizar(m.apelido) + "</span>" +
        (isCriador
          ? '<span class="membro-criador">CRIADOR</span>'
          : '<span class="badge-online" aria-hidden="true"></span>') +
        "</li>";
    }).join("");
  }

  // ============================================
  // ENVIO DE MENSAGEM DE TEXTO / ARQUIVO
  // ============================================
  function enviarMensagem() {
    var texto = inputMsg.value.trim();
    if (!texto && !arquivoSelecionado) return;

    var msg = {
      id:      gerarId(),
      apelido: usuario.apelido,
      avatar:  usuario.avatar || "🐱",
      texto:   texto,
      emoji:   null,
      audio:   null,
      arquivo: arquivoSelecionado ? {
        dataUrl: arquivoSelecionado.dataUrl,
        nome:    arquivoSelecionado.nome,
        tipo:    arquivoSelecionado.tipo,
        tamanho: arquivoSelecionado.tamanho
      } : null,
      hora: new Date().toISOString()
    };

    mensagens.push(msg);
    salvarMsgsLocal(mensagens);
    renderMsg(msg);
    scrollBaixo(true);

    inputMsg.value            = "";
    charsContador.textContent = "500";
    charsContador.className   = "chars-contador";
    typingEl.textContent      = "";
    limparArquivo();
    atualizarBotaoEnvio();
    inputMsg.focus();
  }

  btnEnviar.addEventListener("click", function (e) {
    e.preventDefault();
    enviarMensagem();
  });

  inputMsg.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      enviarMensagem();
    }
  });

  // ============================================
  // CONTADOR + TOGGLE BOTÃO ENVIO / VOZ
  // ============================================
  function atualizarBotaoEnvio() {
    var temConteudo = inputMsg.value.trim().length > 0 || arquivoSelecionado !== null;
    btnEnviar.className = "btn-enviar" + (temConteudo ? " btn-enviar--visivel" : " btn-enviar--oculto");
    btnVoz.style.display = temConteudo ? "none" : "";
  }

  inputMsg.addEventListener("input", function () {
    var restam = 500 - inputMsg.value.length;
    charsContador.textContent = restam;
    charsContador.className   = "chars-contador" +
      (restam <= 50 ? " baixo" : "") +
      (restam < 0   ? " over"  : "");
    atualizarBotaoEnvio();

    if (inputMsg.value.length > 0) {
      typingEl.textContent = "você está digitando...";
      clearTimeout(inputMsg._timer);
      inputMsg._timer = setTimeout(function () { typingEl.textContent = ""; }, 1500);
    } else {
      typingEl.textContent = "";
    }
  });

  // ============================================
  // REMOVER MENSAGEM
  // ============================================
  function removerMsg(msgId) {
    mensagens = mensagens.filter(function (m) { return m.id !== msgId; });
    salvarMsgsLocal(mensagens);
    var el = document.querySelector('[data-msg-id="' + msgId + '"]');
    if (el) {
      el.style.opacity    = "0";
      el.style.transform  = "translateX(-10px)";
      el.style.transition = "all 0.2s ease";
      setTimeout(function () { el.remove(); }, 220);
    }
  }

  // ============================================
  // UPLOAD DE ARQUIVO / IMAGEM
  // ============================================
  btnUpload.addEventListener("click", function (e) {
    e.stopPropagation();
    inpArquivo.click();
  });

  inpArquivo.addEventListener("change", function () {
    var file = inpArquivo.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Arquivo muito grande. Máximo 5 MB.", "erro");
      inpArquivo.value = "";
      return;
    }
    lerArquivo(file);
    inpArquivo.value = "";
  });

  function lerArquivo(file) {
    var reader = new FileReader();
    reader.onload = function (ev) {
      arquivoSelecionado = {
        dataUrl: ev.target.result,
        nome:    file.name,
        tipo:    file.type,
        tamanho: file.size
      };
      var eImagem = file.type.startsWith("image/");
      arquivoIcone.textContent = eImagem ? "🖼️" : "📎";
      arquivoNome.textContent  = file.name;
      arquivoPreview.hidden    = false;
      atualizarBotaoEnvio();
      inputMsg.focus();
    };
    reader.readAsDataURL(file);
  }

  arquivoRemover.addEventListener("click", function () {
    limparArquivo();
    atualizarBotaoEnvio();
  });

  function limparArquivo() {
    arquivoSelecionado    = null;
    arquivoPreview.hidden = true;
    arquivoNome.textContent = "";
    inpArquivo.value = "";
  }

  // Drag & drop de imagem/arquivo
  chatMsgs.addEventListener("dragover", function (e) {
    e.preventDefault();
    chatMsgs.classList.add("drag-over");
  });
  chatMsgs.addEventListener("dragleave", function () {
    chatMsgs.classList.remove("drag-over");
  });
  chatMsgs.addEventListener("drop", function (e) {
    e.preventDefault();
    chatMsgs.classList.remove("drag-over");
    var file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Arquivo muito grande. Máximo 5 MB.", "erro");
      return;
    }
    lerArquivo(file);
    showToast("Arquivo pronto. Clique em enviar.", "ok");
  });

  // ============================================
  // GRAVAÇÃO DE VOZ (MediaRecorder API)
  // ============================================
  var mediaRecorder    = null;
  var chunksAudio      = [];
  var timerGravacao    = null;
  var segundosGravados = 0;

  btnVoz.addEventListener("click", function (e) {
    e.stopPropagation();
    iniciarGravacao();
  });

  vozParar.addEventListener("click", function (e) {
    e.stopPropagation();
    pararGravacao(true);
  });

  vozCancelar.addEventListener("click", function (e) {
    e.stopPropagation();
    pararGravacao(false);
  });

  function iniciarGravacao() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast("Seu navegador não suporta gravação de voz.", "erro");
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (stream) {
        chunksAudio      = [];
        segundosGravados = 0;

        // Tenta usar webm, senão usa ogg, senão usa o padrão
        var mimeType = "";
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          mimeType = "audio/webm;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")) {
          mimeType = "audio/ogg;codecs=opus";
        }

        var opcoes = mimeType ? { mimeType: mimeType } : {};
        mediaRecorder = new MediaRecorder(stream, opcoes);

        mediaRecorder.addEventListener("dataavailable", function (e) {
          if (e.data && e.data.size > 0) chunksAudio.push(e.data);
        });

        mediaRecorder.addEventListener("stop", function () {
          stream.getTracks().forEach(function (t) { t.stop(); });
          if (chunksAudio.length === 0) return;

          var blob     = new Blob(chunksAudio, { type: mediaRecorder.mimeType || "audio/webm" });
          var duracao  = formatarDuracao(segundosGravados);
          var reader   = new FileReader();
          reader.onload = function (ev) {
            var msg = {
              id:      gerarId(),
              apelido: usuario.apelido,
              avatar:  usuario.avatar || "🐱",
              texto:   "",
              emoji:   null,
              arquivo: null,
              audio: {
                dataUrl: ev.target.result,
                duracao: duracao
              },
              hora: new Date().toISOString()
            };
            mensagens.push(msg);
            salvarMsgsLocal(mensagens);
            renderMsg(msg);
            scrollBaixo(true);
          };
          reader.readAsDataURL(blob);
        });

        mediaRecorder.start(100);
        btnVoz.classList.add("gravando");
        vozPreview.hidden = false;
        atualizarTimerGravacao();

        timerGravacao = setInterval(function () {
          segundosGravados++;
          vozTimer.textContent = formatarDuracao(segundosGravados);

          // Limite de 2 minutos
          if (segundosGravados >= 120) {
            showToast("Limite de 2 minutos atingido. Enviando...", "aviso");
            pararGravacao(true);
          }
        }, 1000);
      })
      .catch(function (err) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          showToast("Permissão de microfone negada. Verifique as configurações do navegador.", "erro");
        } else {
          showToast("Não foi possível acessar o microfone.", "erro");
        }
      });
  }

  function pararGravacao(enviar) {
    clearInterval(timerGravacao);
    btnVoz.classList.remove("gravando");
    vozPreview.hidden     = true;
    vozTimer.textContent  = "00:00";

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      if (!enviar) {
        // Cancela — descarta os dados coletados
        mediaRecorder.addEventListener("stop", function handler() {
          chunksAudio = [];
          mediaRecorder.removeEventListener("stop", handler);
        }, { once: true });
      }
      mediaRecorder.stop();
    }
  }

  function atualizarTimerGravacao() {
    vozTimer.textContent = formatarDuracao(segundosGravados);
  }

  function formatarDuracao(segundos) {
    var m = Math.floor(segundos / 60);
    var s = segundos % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  // ============================================
  // EMOJI PICKER
  // ============================================
  var catAtiva = Object.keys(EMOJI_CATS)[0];

  function renderEmojiCats() {
    emojiCatsCont.innerHTML = Object.keys(EMOJI_CATS).map(function (key) {
      return '<button type="button" class="emoji-cat-btn' + (key === catAtiva ? " ativo" : "") + '"' +
        ' data-cat="' + key + '" aria-label="' + EMOJI_LABELS[key] + '" title="' + EMOJI_LABELS[key] + '">' +
        key + "</button>";
    }).join("");

    emojiCatsCont.querySelectorAll(".emoji-cat-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        catAtiva = btn.dataset.cat;
        emojiCatsCont.querySelectorAll(".emoji-cat-btn").forEach(function (b) {
          b.classList.toggle("ativo", b.dataset.cat === catAtiva);
        });
        renderEmojiGrid();
      });
    });
  }

  function renderEmojiGrid() {
    emojiGrid.innerHTML = EMOJI_CATS[catAtiva].map(function (e) {
      return '<button type="button" class="emoji-btn" data-emoji="' + e + '" aria-label="' + e + '" role="listitem">' + e + "</button>";
    }).join("");

    emojiGrid.querySelectorAll(".emoji-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        inputMsg.value += btn.dataset.emoji;
        inputMsg.focus();
        fecharEmoji();
        var restam = 500 - inputMsg.value.length;
        charsContador.textContent = restam;
        atualizarBotaoEnvio();
      });
    });
  }

  function abrirEmoji() {
    renderEmojiCats();
    renderEmojiGrid();
    emojiPicker.hidden = false;
    btnEmojiToggle.setAttribute("aria-expanded", "true");
  }

  function fecharEmoji() {
    emojiPicker.hidden = true;
    btnEmojiToggle.setAttribute("aria-expanded", "false");
  }

  btnEmojiToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    emojiPicker.hidden ? abrirEmoji() : fecharEmoji();
  });

  document.addEventListener("click", function (e) {
    if (!emojiPicker.hidden &&
        !emojiPicker.contains(e.target) &&
        e.target !== btnEmojiToggle) {
      fecharEmoji();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      fecharEmoji();
      if (lightbox && !lightbox.hidden) fecharLightbox();
    }
  });

  // ============================================
  // LIGHTBOX
  // ============================================
  function fecharLightbox() {
    lightbox.hidden              = true;
    lightboxImg.src              = "";
    document.body.style.overflow = "";
  }
  if (lightboxFechar) lightboxFechar.addEventListener("click", fecharLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) fecharLightbox();
    });
  }

  // ============================================
  // SIDEBAR TOGGLE
  // ============================================
  function toggleSidebar() {
    var recolhida = sidebar.classList.contains("recolhida");
    sidebar.classList.toggle("recolhida", !recolhida);
    sidebar.classList.toggle("aberta", recolhida);
    btnMembros.setAttribute("aria-expanded", String(recolhida));
  }
  if (btnMembros)  btnMembros.addEventListener("click", toggleSidebar);
  if (btnFecharSb) btnFecharSb.addEventListener("click", toggleSidebar);

  // ============================================
  // UTILITÁRIOS
  // ============================================
  function scrollBaixo(suave) {
    chatMsgs.scrollTo({ top: chatMsgs.scrollHeight, behavior: suave ? "smooth" : "auto" });
  }

  function formatarTamanho(bytes) {
    if (bytes < 1024)        return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  // Estado inicial do botão
  atualizarBotaoEnvio();
});