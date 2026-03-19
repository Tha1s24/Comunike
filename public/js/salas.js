// ============================================
// COMUNIKE — js/salas.js
// Listagem, criação, edição e exclusão de salas
// Persistência via localStorage (sem servidor)
// ============================================

document.addEventListener("DOMContentLoaded", function () {

  // ---- Garante sessão ativa ----
  var usuario = lerSessao();
  if (!usuario) {
    irPara("/login");
    return;
  }

  // ---- Exibe usuário no header ----
  var headerUsuario = document.getElementById("header-usuario");
  if (headerUsuario) {
    headerUsuario.innerHTML =
      '<span style="font-size:18px">' + sanitizar(usuario.avatar || "🐱") + "</span>" +
      "<span>" + sanitizar(usuario.apelido) + "</span>";
  }

  // ============================================
  // BANCO DE DADOS LOCAL (localStorage)
  // ============================================

  var STORAGE_KEY = "comunike_salas";

  function carregarSalasStorage() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function salvarSalasStorage(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  }

  function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  // Seed inicial com salas de exemplo se vazio
  function garantirSeedInicial() {
    var lista = carregarSalasStorage();
    if (lista.length === 0) {
      lista = [
        { id: gerarId(), nome: "Fotografia",  descricao: "Dicas, equipamentos e fotos incríveis.",   categoria: "Arte e criatividade", criador: "admin", criadaEm: new Date().toISOString() },
        { id: gerarId(), nome: "Games",        descricao: "Jogos, lançamentos e recomendações.",       categoria: "Tecnologia e games",  criador: "admin", criadaEm: new Date().toISOString() },
        { id: gerarId(), nome: "Culinária",    descricao: "Receitas, técnicas e gastronomia.",         categoria: "Gastronomia",         criador: "admin", criadaEm: new Date().toISOString() },
        { id: gerarId(), nome: "Leitura",      descricao: "Livros, resenhas e clubes do livro.",       categoria: "Conhecimento",        criador: "admin", criadaEm: new Date().toISOString() },
        { id: gerarId(), nome: "Música",       descricao: "Bandas, instrumentos e playlists.",          categoria: "Arte e criatividade", criador: "admin", criadaEm: new Date().toISOString() },
        { id: gerarId(), nome: "Corrida",      descricao: "Treinos, provas e evolução pessoal.",        categoria: "Esportes",            criador: "admin", criadaEm: new Date().toISOString() },
      ];
      salvarSalasStorage(lista);
    }
    return lista;
  }

  // ============================================
  // ESTADO DA PÁGINA
  // ============================================

  var salas       = garantirSeedInicial();
  var filtroAtual = "todas";
  var buscaAtual  = "";
  var editandoId  = null;

  // ============================================
  // RENDERIZAÇÃO DO GRID DE SALAS
  // ============================================

  function renderSalas() {
    var grid  = document.getElementById("salas-grid");
    var vazio = document.getElementById("salas-vazio");

    // Aplica filtro de categoria e busca por nome/descrição
    var filtradas = salas.filter(function (s) {
      var matchCat   = filtroAtual === "todas" || s.categoria === filtroAtual;
      var termoBusca = buscaAtual.toLowerCase().trim();
      var matchBusca = !termoBusca ||
        s.nome.toLowerCase().includes(termoBusca) ||
        (s.descricao || "").toLowerCase().includes(termoBusca) ||
        s.categoria.toLowerCase().includes(termoBusca);
      return matchCat && matchBusca;
    });

    // Estado vazio
    if (!filtradas.length) {
      grid.innerHTML = "";
      vazio.classList.remove("salas-vazio--oculto");
      return;
    }
    vazio.classList.add("salas-vazio--oculto");

    // Renderiza cards
    grid.innerHTML = filtradas.map(function (s) {
      var cls      = catParaClasse(s.categoria);
      var eCriador = s.criador === usuario.apelido;

      return (
        '<li class="sala-card ' + cls + '" role="listitem" tabindex="0"' +
        ' data-id="' + s.id + '"' +
        ' aria-label="Sala ' + sanitizar(s.nome) + '">' +

        '<div class="sala-card-cabecalho">' +
          '<h2 class="sala-nome">' + sanitizar(s.nome) + "</h2>" +
          (eCriador
            ? '<div class="sala-card-acoes">' +
                '<button class="btn-icon btn-edit" data-id="' + s.id + '" type="button" aria-label="Editar" title="Editar">✎</button>' +
                '<button class="btn-icon btn-del"  data-id="' + s.id + '" type="button" aria-label="Excluir" title="Excluir">✕</button>' +
              "</div>"
            : "") +
        "</div>" +

        (s.descricao
          ? '<p class="sala-desc">' + sanitizar(s.descricao) + "</p>"
          : "") +

        '<div class="sala-card-rodape">' +
          '<span class="sala-cat-badge">' + sanitizar(s.categoria) + "</span>" +
          '<span class="sala-online">' +
            '<span class="badge-online" aria-hidden="true"></span>' +
            "0 online" +
          "</span>" +
        "</div>" +

        "</li>"
      );
    }).join("");

    // ---- Eventos: entrar na sala ----
    grid.querySelectorAll(".sala-card").forEach(function (card) {
      card.addEventListener("click", function (e) {
        if (e.target.closest(".sala-card-acoes")) return;
        window.location.href = "/chat?sala=" + card.dataset.id;
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });

    // ---- Eventos: editar sala ----
    grid.querySelectorAll(".btn-edit").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        abrirModalEdicao(btn.dataset.id);
      });
    });

    // ---- Eventos: excluir sala ----
    grid.querySelectorAll(".btn-del").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (!confirm('Excluir a sala "' + (salas.find(function(s){ return s.id === btn.dataset.id; }) || {}).nome + '"?')) return;
        excluirSalaLocal(btn.dataset.id);
      });
    });
  }

  // ============================================
  // FILTROS DE CATEGORIA
  // ============================================

  document.querySelectorAll(".cat-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".cat-btn").forEach(function (b) {
        b.classList.remove("cat-btn--ativo");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("cat-btn--ativo");
      btn.setAttribute("aria-pressed", "true");
      filtroAtual = btn.dataset.cat;
      renderSalas();
    });
  });

  // ============================================
  // BUSCA POR NOME
  // ============================================

  var inputBusca = document.getElementById("inp-busca");
  if (inputBusca) {
    inputBusca.addEventListener("input", function () {
      buscaAtual = inputBusca.value;
      renderSalas();
    });
  }

  // ============================================
  // MINI MODAL — CRIAR / EDITAR SALA
  // ============================================

  var modal       = document.getElementById("mini-modal-sala");
  var modalTitulo = document.getElementById("mini-modal-titulo");
  var btnSalvar   = document.getElementById("btn-salvar-sala");
  var inputNome   = document.getElementById("sala-nome");
  var inputDesc   = document.getElementById("sala-desc");
  var selectCat   = document.getElementById("sala-cat");
  var erroNome    = document.getElementById("erro-sala-nome");
  var erroCat     = document.getElementById("erro-sala-cat");

  function abrirModal() {
    editandoId              = null;
    modalTitulo.textContent = "Nova sala";
    btnSalvar.textContent   = "Criar sala";
    inputNome.value         = "";
    inputDesc.value         = "";
    selectCat.value         = "";
    erroNome.textContent    = "";
    erroCat.textContent     = "";
    modal.hidden            = false;
    document.body.style.overflow = "hidden";
    inputNome.focus();
  }

  function abrirModalEdicao(id) {
    var sala = salas.find(function (s) { return s.id === id; });
    if (!sala) return;
    editandoId              = id;
    modalTitulo.textContent = "Editar sala";
    btnSalvar.textContent   = "Salvar alterações";
    inputNome.value         = sala.nome;
    inputDesc.value         = sala.descricao || "";
    selectCat.value         = sala.categoria;
    erroNome.textContent    = "";
    erroCat.textContent     = "";
    modal.hidden            = false;
    document.body.style.overflow = "hidden";
    inputNome.focus();
  }

  function fecharModal() {
    modal.hidden                 = true;
    editandoId                   = null;
    document.body.style.overflow = "";
  }

  // Abre pelo botão do header
  document.getElementById("btn-nova-sala").addEventListener("click", abrirModal);

  // Fecha
  document.getElementById("mini-modal-fechar").addEventListener("click", fecharModal);
  document.getElementById("btn-cancelar-modal").addEventListener("click", fecharModal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) fecharModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) fecharModal();
  });

  // ---- Submissão do modal ----
  btnSalvar.addEventListener("click", function () {
    var nome      = inputNome.value.trim();
    var descricao = inputDesc.value.trim();
    var categoria = selectCat.value;

    erroNome.textContent = "";
    erroCat.textContent  = "";

    var valido = true;
    if (!nome)      { erroNome.textContent = "Informe o nome da sala.";      valido = false; }
    if (!categoria) { erroCat.textContent  = "Selecione uma categoria.";     valido = false; }
    if (!valido) return;

    if (editandoId) {
      editarSalaLocal(editandoId, { nome: nome, descricao: descricao, categoria: categoria });
    } else {
      criarSalaLocal({ nome: nome, descricao: descricao, categoria: categoria });
    }

    fecharModal();
  });

  // ============================================
  // CRUD LOCAL (localStorage)
  // ============================================

  function criarSalaLocal(dados) {
    var nova = {
      id:        gerarId(),
      nome:      dados.nome.slice(0, 60),
      descricao: (dados.descricao || "").slice(0, 120),
      categoria: dados.categoria,
      criador:   usuario.apelido,
      criadaEm:  new Date().toISOString()
    };
    salas.unshift(nova); // adiciona no início para aparecer primeiro
    salvarSalasStorage(salas);
    renderSalas();
    showToast("Sala \"" + nova.nome + "\" criada!", "ok");
  }

  function editarSalaLocal(id, dados) {
    var idx = salas.findIndex(function (s) { return s.id === id; });
    if (idx === -1) return;
    salas[idx].nome      = dados.nome.slice(0, 60);
    salas[idx].descricao = (dados.descricao || "").slice(0, 120);
    salas[idx].categoria = dados.categoria;
    salvarSalasStorage(salas);
    renderSalas();
    showToast("Sala atualizada!", "ok");
  }

  function excluirSalaLocal(id) {
    salas = salas.filter(function (s) { return s.id !== id; });
    salvarSalasStorage(salas);
    renderSalas();
    showToast("Sala excluída.", "aviso");
  }

  // ============================================
  // INICIALIZAÇÃO
  // ============================================

  renderSalas();
});