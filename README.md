# 💬 Comunike — Plataforma de Chat por Hobbies

> Plataforma web de chat por interesses em comum. Encontre sua tribo, entre em salas temáticas e conecte-se com pessoas que compartilham as mesmas paixões. Desenvolvida com HTML, CSS e JavaScript puro no front-end e Node.js no back-end.

<br>

## 🖥️ Preview

[![Comunike Preview](https://via.placeholder.com/900x450/141311/e84b3a?text=Comunike+–+Clique+para+acessar)](https://seu-usuario.up.railway.app)

<div align="center">

🔗 **[Acessar projeto online](https://seu-usuario.up.railway.app)**

[![Deploy](https://img.shields.io/badge/Deploy-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://seu-usuario.up.railway.app)
[![Status](https://img.shields.io/badge/Status-Online-e84b3a?style=for-the-badge)](https://seu-usuario.up.railway.app)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://github.com/Tha1s24/Comunike.git)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)

</div>

> _Substitua `seu-usuario` e os links pela sua URL de deploy real e troque a imagem por um screenshot do projeto._

<br>

## ✨ Funcionalidades

### 🔐 Autenticação
- Cadastro com apelido, e-mail, senha e escolha de avatar
- Indicador de força da senha em tempo real (4 níveis)
- Seleção de hobbies de interesse (até 3) no cadastro
- Login com apelido e senha
- Mini modal de sucesso animado ao concluir o cadastro
- Sessão salva via `sessionStorage`

### 🏠 Salas
- **CRUD completo** — criar, editar e excluir salas temáticas
- Mini modal de criação com validação inline
- Filtro por categoria com 6 opções temáticas
- Busca por nome e descrição em tempo real
- Persistência das salas via `localStorage`
- 6 salas de exemplo criadas automaticamente na primeira abertura
- Cards com badge de categoria colorido por tema

### 💬 Chat
- Envio de mensagens de texto com `Enter` ou botão
- Contador de caracteres regressivo (limite de 500)
- Indicador de digitação animado
- Histórico das últimas 100 mensagens por sala (via `localStorage`)
- Remoção de mensagens (apenas criador da sala)
- Sidebar com lista de participantes

### 😊 Emojis
- Seletor de emojis com 3 categorias: Rostos, Gestos e Outros
- Inserção no campo de texto ou envio como emoji puro (grande)
- Fecha ao clicar fora ou pressionar `Escape`

### 🎙️ Mensagem de Voz
- Gravação direta pelo navegador via `MediaRecorder API`
- Preview de gravação com timer e ondas animadas
- Limite de 2 minutos com aviso automático
- Compatível com `audio/webm` e `audio/ogg`
- Player de áudio nativo inline nas mensagens
- Opção de cancelar ou enviar a gravação

### 📎 Envio de Arquivos e Imagens
- Upload via botão 📎 ou **drag & drop** na área de mensagens
- Suporte a imagens (PNG, JPG, GIF, WebP) e documentos (PDF, DOC, XLS, TXT, ZIP)
- Limite de 5 MB por arquivo
- Imagens exibidas inline com **lightbox** ao clicar para ampliar
- Arquivos com badge de extensão, tamanho e botão de download
- Preview do arquivo selecionado antes de enviar

### 🌙 Tema e Acessibilidade
- **Dark mode** nativo com toggle manual
- Respeita automaticamente `prefers-color-scheme` do sistema
- `role="log"` na área de mensagens para leitores de tela
- `aria-live` em indicadores, toasts e contadores
- `aria-label` em todos os botões de ícone
- `.sr-only` para labels acessíveis sem impacto visual
- `:focus-visible` com outline de alto contraste
- `prefers-reduced-motion` para desativar animações
- Navegação completa por teclado

<br>

## 🛠️ Tecnologias

| Camada | Tecnologia | Finalidade |
|---|---|---|
| Front-end | HTML5 semântico | Estrutura e marcação acessível |
| Front-end | CSS3 + variáveis | Estilização, dark mode, responsividade |
| Front-end | JavaScript ES6+ | Lógica, CRUD, MediaRecorder, FileReader |
| Back-end | Node.js + Express | Servidor HTTP e API REST |
| Tempo real | Socket.IO | WebSocket bidirecional |
| Ambiente | dotenv | Variáveis de ambiente via `.env` |
| Dev | nodemon | Reinício automático em desenvolvimento |

> Projeto full stack sem frameworks front-end. 100% vanilla JS no cliente.

<br>

## 📁 Estrutura do Projeto

```
comunike/
├── server.js                  ← Servidor Express + Socket.IO
├── package.json
├── .env                       ← Variáveis de ambiente (não versionar)
├── .gitignore
├── README.md
│
├── src/
│   ├── db.js                  ← Banco de dados em memória + JSON
│   └── socketHandler.js       ← Todos os eventos Socket.IO
│
├── public/
│   ├── pages/
│   │   ├── index.html         ← Landing page (visitante)
│   │   ├── login.html         ← Tela de login
│   │   ├── cadastro.html      ← Tela de cadastro
│   │   ├── salas.html         ← Listagem e filtro de salas
│   │   └── chat.html          ← Interface do chat
│   │
│   ├── css/
│   │   ├── global.css         ← Variáveis, reset, dark mode, globais
│   │   ├── index.css          ← Estilos da landing page
│   │   ├── auth.css           ← Login e cadastro
│   │   ├── salas.css          ← Listagem de salas + mini modal
│   │   └── chat.css           ← Chat, voz, upload, lightbox
│   │
│   └── js/
│       ├── theme.js           ← Gerenciamento de tema claro/escuro
│       ├── utils.js           ← Sessão, toast, formatação, sanitização
│       ├── login.js           ← Lógica da tela de login
│       ├── cadastro.js        ← Lógica do cadastro + força de senha
│       ├── salas.js           ← CRUD de salas + filtros + modal
│       └── chat.js            ← Chat, voz, upload, emojis, lightbox
│
└── data/                      ← Criada automaticamente pelo servidor
    ├── salas.json             ← Salas persistidas
    └── mensagens.json         ← Histórico de mensagens
```

<br>

## 🚀 Como Executar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org) v18 ou superior instalado
- [VS Code](https://code.visualstudio.com/) com extensão **Live Server** (para o front-end estático)

### Passo a passo completo

```bash
# 1. Clone o repositório
git clone https://github.com/Tha1s24/Comunike.git

# 2. Entre na pasta do projeto
cd comunike

# 3. Crie a pasta de dados (obrigatório antes de rodar)
mkdir data

# 4. Instale todas as dependências
npm install

# 5. Inicie em modo desenvolvimento (servidor reinicia ao salvar)
npm run dev
```

Acesse em: **`http://localhost:3000`**

### Comandos disponíveis

```bash
npm run dev    # Inicia com nodemon — recarrega automaticamente ao salvar
npm start      # Inicia em modo produção com node
```

<br>

## 📦 Instalação das Dependências

Caso queira criar o projeto do zero ao invés de clonar:

```bash
# Cria a pasta e entra nela
mkdir comunike && cd comunike

# Inicializa o package.json
npm init -y

# Cria a pasta de dados obrigatória
mkdir data

# Instala as dependências de produção
npm install express socket.io dotenv

# Instala as dependências de desenvolvimento
npm install -D nodemon

# Abre o projeto no VS Code
code .
```

### Tabela de dependências

| Pacote | Versão | Tipo | Finalidade |
|---|---|---|---|
| `express` | ^4.19 | Produção | Servidor HTTP, rotas e arquivos estáticos |
| `socket.io` | ^4.7 | Produção | WebSocket bidirecional em tempo real |
| `dotenv` | ^16.4 | Produção | Leitura de variáveis do arquivo `.env` |
| `nodemon` | ^3.1 | Dev | Reinício automático do servidor ao salvar |

### Scripts do package.json

Adicione os scripts abaixo ao `package.json` após criar o projeto:

```json
"scripts": {
  "start": "node server.js",
  "dev":   "nodemon server.js"
}
```

<br>

## 🗂️ Categorias de Salas

| Cor | Categoria | Exemplos de hobbies |
|---|---|---|
| 🟢 | Esportes e movimento | Futebol, Corrida, Ciclismo, Natação, Yoga, Escalada |
| 🟣 | Tecnologia e games | Games, Programação, Robótica, IA, Anime |
| 🔴 | Arte e criatividade | Fotografia, Desenho, Música, Design, Dança |
| 🟠 | Gastronomia e bem-estar | Culinária, Confeitaria, Café especial, Churrasco |
| 🔵 | Conhecimento e cultura | Leitura, Idiomas, Astronomia, Cinema, Viagens |
| 🟡 | Colecionismo e hobbies manuais | Board games, Xadrez, Artesanato, Lego |

<br>

## 🎙️ Gravação de Voz — Requisitos

A funcionalidade de mensagem de voz usa a `MediaRecorder API` nativa do navegador.

**Requisitos para funcionar:**
- Navegador moderno: Chrome 47+, Firefox 25+, Edge 79+, Safari 14.1+
- Permissão de microfone concedida pelo usuário
- Site rodando em `https://` ou `localhost` (requisito de segurança do navegador)

> O Live Server (`http://127.0.0.1:5500`) é considerado `localhost` e suporta a API normalmente.

<br>

## ♿ Acessibilidade

| Recurso | Implementação |
|---|---|
| Leitores de tela | `role="log"` na área de mensagens |
| Atualizações dinâmicas | `aria-live="polite"` e `"assertive"` |
| Modais | `role="dialog"` + `aria-modal="true"` + `aria-labelledby` |
| Botões de ícone | `aria-label` descritivo em todos |
| Toggles | `aria-pressed` nos filtros, avatares e temas |
| Labels ocultos | `.sr-only` para campos sem label visível |
| Foco | `:focus-visible` com outline de alto contraste |
| Animações | `prefers-reduced-motion` desativa todas as animações |
| Contraste | Paleta testada para modo claro e escuro |

<br>

## 🌐 Deploy

### Railway (recomendado — suporta WebSocket)

```bash
# Instala a CLI do Railway
npm install -g @railway/cli

# Faz login
railway login

# Inicializa o projeto e faz deploy
railway init
railway up
```

### Outras plataformas compatíveis

| Plataforma | Suporte a WebSocket | Plano gratuito |
|---|---|---|
| [Railway](https://railway.app) | ✅ | ✅ |
| [Render](https://render.com) | ✅ | ✅ |
| [Fly.io](https://fly.io) | ✅ | ✅ |
| [Heroku](https://heroku.com) | ✅ | Pago |

> ⚠️ **GitHub Pages não suporta Node.js nem WebSocket.** Use uma das plataformas acima para o deploy completo.

<br>

## 🔮 Melhorias Futuras

- [ ] Mensagens privadas entre usuários
- [ ] Reações a mensagens com emojis (👍 ❤️ 😂)
- [ ] Salas privadas com senha de acesso
- [ ] Edição de mensagens enviadas
- [ ] Banco de dados real (PostgreSQL ou MongoDB)
- [ ] Autenticação segura com JWT
- [ ] Notificações push no mobile
- [ ] Modo de transcrição de mensagens de voz

<br>

## 👨‍💻 Desenvolvido por

<table>
  <tr>
    <td align="center">
      <b>Seu Nome Aqui</b>
      <br><br>
      <a href="https://github.com/Tha1s24/Comunike.git">
        <img src="https://img.shields.io/badge/GitHub-seu--usuario-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
      </a>
      <br><br>
      <a href="www.linkedin.com/in/thais-vitória-ferraz-rangel">
        <img src="https://img.shields.io/badge/LinkedIn-seu--usuario-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
      </a>
    </td>
  </tr>
</table>

<br>

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar, modificar e distribuir.

---

<p align="center">Feito com ❤️ e JavaScript puro</p>