# 💬 Comunike — Plataforma de Chat por Interesses

> Plataforma web de chat baseada em interesses em comum. Encontre sua comunidade, participe de salas temáticas e conecte-se com pessoas que compartilham as mesmas paixões.
> Desenvolvida com **HTML, CSS e JavaScript (Vanilla)** no front-end e **Node.js** no back-end.

---

## 🖥️ Preview

[![Comunike Preview](https://via.placeholder.com/900x450/141311/e84b3a?text=Comunike+–+Clique+para+acessar)](https://comunike.onrender.com)

<p align="center">

🔗 <strong><a href="https://comunike.onrender.com">Acessar aplicação</a></strong>

<br><br>

<img src="https://img.shields.io/badge/Deploy-Render-0B0D0E?style=for-the-badge&logo=render&logoColor=white" />
<img src="https://img.shields.io/badge/Status-Online-2ECC71?style=for-the-badge" />
<img src="https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
<img src="https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />

</p>

> ⚠️ **Nota:** Substitua a imagem de preview por um screenshot real do projeto e atualize os links conforme o ambiente de deploy.

---

## ✨ Funcionalidades

### 🔐 Autenticação

* Cadastro com apelido, e-mail, senha e avatar
* Indicador de força de senha em tempo real (4 níveis)
* Seleção de até 3 interesses no cadastro
* Login com apelido e senha
* Feedback visual de sucesso no cadastro
* Persistência de sessão via `sessionStorage`

---

### 🏠 Salas

* CRUD completo (criação, edição e exclusão)
* Validação em tempo real nos formulários
* Filtro por categoria (6 temas)
* Busca por nome e descrição
* Persistência com `localStorage`
* Salas iniciais geradas automaticamente
* Interface em cards com categorização visual

---

### 💬 Chat em Tempo Real

* Envio de mensagens via botão ou tecla `Enter`
* Limite de 500 caracteres com contador dinâmico
* Indicador de digitação
* Histórico das últimas 100 mensagens por sala
* Remoção de mensagens (restrita ao criador)
* Lista de participantes na sala

---

### 😊 Emojis

* Seletor com categorias (Rostos, Gestos, Outros)
* Inserção inline ou envio como mensagem única
* Fechamento automático (`Escape` ou clique externo)

---

### 🎙️ Mensagens de Voz

* Gravação com `MediaRecorder API`
* Preview com timer e feedback visual
* Limite de 2 minutos
* Compatível com `audio/webm` e `audio/ogg`
* Player nativo integrado ao chat
* Cancelamento ou envio da gravação

---

### 📎 Upload de Arquivos

* Upload via botão ou **drag & drop**
* Suporte a imagens e documentos
* Limite de 5 MB por arquivo
* Preview antes do envio
* Imagens com visualização ampliada (lightbox)
* Arquivos com metadados e download

---

### 🌙 Tema e Acessibilidade

* Dark mode com alternância manual
* Suporte a `prefers-color-scheme`
* Navegação completa por teclado
* Suporte a leitores de tela (`aria-*`)
* `prefers-reduced-motion` para acessibilidade
* Alto contraste e foco visível

---

## 🛠️ Tecnologias

| Camada          | Tecnologia        | Finalidade                   |
| --------------- | ----------------- | ---------------------------- |
| Front-end       | HTML5             | Estrutura semântica          |
| Front-end       | CSS3              | Estilização e responsividade |
| Front-end       | JavaScript ES6+   | Lógica da aplicação          |
| Back-end        | Node.js + Express | API e servidor               |
| Tempo real      | Socket.IO         | Comunicação WebSocket        |
| Configuração    | dotenv            | Variáveis de ambiente        |
| Desenvolvimento | nodemon           | Hot reload                   |

> 💡 Projeto full stack utilizando JavaScript puro no cliente (sem frameworks).

---

## 📁 Estrutura do Projeto

```
comunike/
├── server.js
├── package.json
├── .env
├── .gitignore
├── README.md
│
├── src/
│   ├── db.js
│   └── socketHandler.js
│
├── public/
│   ├── pages/
│   ├── css/
│   └── js/
│
└── data/
    ├── salas.json
    └── mensagens.json
```

---

## 🚀 Execução Local

### Pré-requisitos

* Node.js v18+
* npm ou yarn

### Instalação

```bash
git clone https://github.com/Tha1s24/Comunike.git
cd comunike

mkdir data
npm install
npm run dev
```

Acesse: **[http://localhost:3000](http://localhost:3000)**

---

### Scripts

```bash
npm run dev    # Desenvolvimento (nodemon)
npm start      # Produção
```

---

## 📦 Dependências

| Pacote    | Função                    |
| --------- | ------------------------- |
| express   | Servidor HTTP             |
| socket.io | Comunicação em tempo real |
| dotenv    | Variáveis de ambiente     |
| nodemon   | Desenvolvimento           |

---

## 🗂️ Categorias

* 🟢 Esportes
* 🟣 Tecnologia
* 🔴 Arte
* 🟠 Gastronomia
* 🔵 Cultura
* 🟡 Hobbies

---

## 🎙️ Requisitos para Áudio

* Navegador moderno
* Permissão de microfone
* HTTPS ou `localhost`

---

## ♿ Acessibilidade

* Suporte a leitores de tela
* Navegação por teclado
* Uso de ARIA
* Alto contraste
* Redução de animações

---

## 🌐 Deploy

### Plataformas compatíveis

* Render
* Railway
* Fly.io

> ⚠️ GitHub Pages não suporta aplicações Node.js.

---

## 🔮 Roadmap

* [ ] Mensagens privadas
* [ ] Reações com emojis
* [ ] Salas privadas
* [ ] Edição de mensagens
* [ ] Integração com banco de dados
* [ ] Autenticação com JWT
* [ ] Notificações push

---

## 👩‍💻 Autora

**Thaís Vitória Ferraz Rangel**

* GitHub: [https://github.com/Tha1s24](https://github.com/Tha1s24)
* LinkedIn: [https://www.linkedin.com/in/thais-vitória-ferraz-rangel](https://www.linkedin.com/in/thais-vitória-ferraz-rangel)

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

<p align="center">Desenvolvido com ❤️ e JavaScript</p>






