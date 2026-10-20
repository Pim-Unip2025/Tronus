<div align="center">

<img src="img/logo.png" alt="Tronus" width="400"/>

# TRONUS

**Sistema gamificado de apoio acadêmico — PIM IV · ADS · UNIP**

<<<<<<< HEAD
[Site](https://tronus-one.vercel.app) · [API](https://king-blue-nine.vercel.app/docs) · [App mobile](https://github.com/Pim-Unip2025/mobile)
=======
[![GitHub](https://img.shields.io/badge/GitHub-Tronus-181717?style=for-the-badge&logo=github)](https://github.com/Pim-Unip2025/Tronus)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white)
![.NET 10](https://img.shields.io/badge/.NET_10-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
>>>>>>> 7afe996 (feat: implementa cliente desktop nativo C# .NET 10, todas as telas, modelos, documentacao completa e diagramas UML)

</div>

---

## Sobre

<<<<<<< HEAD
O **Tronus** ajuda calouros com dificuldade no semestre transformando a jornada acadêmica numa aventura: cada matéria é um **Reino** a ser conquistado.
=======
### 📖 Sobre o Projeto

**Tronus** é um sistema gamificado de apoio acadêmico desenvolvido para ajudar alunos calouros que estão com dificuldades no semestre. A ideia é transformar a jornada acadêmica em uma aventura épica, onde cada matéria é um **Reino** a ser conquistado.

A plataforma possui duas interfaces clientes integradas à mesma API central:
1. 🌐 **Aplicação Web:** Interface responsiva construída em HTML5, CSS3 e JavaScript.
2. 🖥️ **Aplicação Desktop ([`TronusDesktop`](TronusDesktop/README.md)):** Cliente nativo Windows construído em C# e **.NET 10 (Windows Forms)** no modelo *Thin Client*, com atmosfera medieval personalizada.

### 🎮 Como Funciona
>>>>>>> 7afe996 (feat: implementa cliente desktop nativo C# .NET 10, todas as telas, modelos, documentacao completa e diagramas UML)

| Elemento | Descrição |
|---|---|
| **Reinos** | As matérias do semestre (Python, C++, Engenharia de Software, Banco de Dados, Redes) |
| **Fases** | Cada Reino tem 3 fases, cada uma um quiz |
| **Estrelas** | Cada fase vale até 3 estrelas; vale sempre a melhor tentativa |
| **Títulos** | Plebeu → **Cavaleiro** (15 ★) → **Duque** (30 ★) → **Rei** (45 ★, todos os Reinos dominados) |

Perfis: **aluno** joga; **professor** cuida das perguntas do seu Reino e acompanha os alunos; **admin** gerencia usuários e vê os números da plataforma.

<<<<<<< HEAD
## Como as peças se conectam

```
Site (este repo)  ─┐
App mobile        ─┼──>  API (repo king, NestJS na Vercel)  ──>  PostgreSQL (Supabase)
App desktop       ─┘
=======
- 🔐 Cadastro e login com nome de usuário ou e-mail (autenticação JWT)
- 📱 Recuperação de senha com validações de segurança
- 🧙 Criação de personagem com escolha de gênero e avatar medieval
- 🗺️ Sistema de Reinos (matérias) com fases sequenciais e estrelas
- 🏆 Progressão automática de títulos no banco de dados conforme conquistas
- 📊 Dashboard de análise de desempenho e taxa de acertos
- ☁️ Banco de dados relacional centralizado **PostgreSQL (Supabase)** e API REST (NestJS)

### 🚀 Como Rodar o Projeto

#### 1. Versão Desktop (C# / .NET 10)
Consulte a documentação completa em [`TronusDesktop/README.md`](TronusDesktop/README.md).
```bash
# Executar a aplicação desktop
dotnet run --project TronusDesktop/TronusDesktop.csproj
```

#### 2. Versão Web (Navegador)
1. Abra a pasta no **VSCode**
2. Instale a extensão **Live Server**
3. Clique com o botão direito no `index.html` → **Open with Live Server**
4. Pronto! O projeto abrirá no navegador 🎉

### 🛠️ Tecnologias Utilizadas

- **C# / .NET 10 (Windows Forms)** — Aplicação Desktop nativa
- **HTML5 / CSS3 / JavaScript** — Aplicação Web responsiva
- **PostgreSQL / Supabase** — Banco de dados relacional com RLS e triggers ([`db/README.md`](db/README.md))
- **NestJS / REST API** — Backend centralizado
- **Boxicons & Google Fonts** — Ícones e tipografia (Poppins)

---

## 🇺🇸 English

### 📖 About the Project

**Tronus** is a gamified academic support system developed to help freshman students who are struggling during the semester. The idea is to transform the academic journey into an epic adventure, where each subject is a **Kingdom** to be conquered.

### 🎮 How It Works

| Element | Description |
|---|---|
| 👑 **Plebeian** | Freshman's initial title |
| ⚔️ **Kingdoms** | Represent the semester's subjects |
| 🏰 **Phases** | Each kingdom has 3 phases to complete |
| ⭐ **Stars** | Each phase is worth up to 3 stars |
| 🎖️ **Knight** | Achieved at 15 stars |
| 🦅 **Duke** | Achieved at 30 stars |
| 👑 **King** | Achieved at 50 stars — all kingdoms conquered |

### ✨ Features

- 🔐 Register and login with username or email
- 📱 Password recovery via phone number
- 🧙 Character creation with gender and avatar selection
- 🗺️ Kingdom system (subjects) with phases and stars
- 🏆 Title progression based on achievements
- 💾 Local SQLite database via `sql.js`

### 🚀 How to Run

1. Clone the repository:
```bash
git clone https://github.com/Pim-Unip2025/Tronus.git
>>>>>>> 7afe996 (feat: implementa cliente desktop nativo C# .NET 10, todas as telas, modelos, documentacao completa e diagramas UML)
```

- **Este repositório** tem o site (HTML/CSS/JS puro, sem build) e os scripts do banco (`db/`).
- O site **não guarda dados**: tudo passa pela API. O único estado no navegador é o token de login.
- Regras do jogo (correção, estrelas, título) ficam na API e no banco, nunca no navegador.

## Rodar o site localmente

1. Abra a pasta no VS Code e use a extensão **Live Server** em `index.html` (porta 5500).
2. O site usa a API de produção. Para usar a API rodando na sua máquina, rode no console do navegador:
   ```js
   localStorage.setItem("tronus.api", "http://localhost:3000")
   ```
   Para voltar à produção: `localStorage.removeItem("tronus.api")`.

> Se o site abrir mas nada carregar, confira `https://king-blue-nine.vercel.app/health`. Se vier erro, o Supabase pode ter pausado o projeto (plano grátis, após dias sem uso): retome em supabase.com.

## Páginas

| Página | Quem usa | O que faz |
|---|---|---|
| `index.html` | Todos | Página inicial (landing) |
| `login.html` · `register.html` · `forgot_password.html` | Todos | Entrar, cadastrar aluno, recuperar senha |
| `character.html` | Aluno | Criar o personagem |
| `reinos.html` · `trilha.html` · `dashboard.html` | Aluno | Reinos, fases e quiz, desempenho |
| `professor.html` | Professor | Perguntas do Reino e desempenho dos alunos |
| `admin.html` | Admin | Estatísticas e usuários |

O código compartilhado fica em `js/api.js` (chamadas da API, sessão, `escapar()` para todo texto vindo da API).

## Banco de dados

Os scripts estão em [`db/`](db/README.md), com o passo a passo de como subir no Supabase. As perguntas do Reino Python ficam em `db/questoes_python.js`; depois de editar, gere de novo o SQL:

```bash
npm install
npm run db:seeds
```

Usuários de teste: veja [`LOGINS.md`](LOGINS.md). Roteiro de testes: [`ROTEIRO_TESTES.md`](ROTEIRO_TESTES.md).

## Deploy

O site está na **Vercel** (`https://tronus-one.vercel.app`), sem build, publicado a partir da branch `main`. Cada PR ganha um link de preview.

O endereço do site precisa estar na variável `CORS_ORIGINS` da API (projeto `king` na Vercel); sem isso, o navegador bloqueia as chamadas.

Fluxo de branches: trabalho em branch própria → PR para `develop` → `develop` vai para `main` na entrega.

## Equipe

| Nome | GitHub |
|---|---|
| Jhonatan Oliveira | [@ojjhonatan](https://github.com/ojjhonatan) |
| Enzo Oliveira | [@EnzoOliveir19](https://github.com/EnzoOliveir19) |
| Renata Faria | [@renatafaria001](https://github.com/renatafaria001) |
| Nickolas | [@NckGoulart](https://github.com/NckGoulart) |
| Luiz | [@Luizzregis](https://github.com/Luizzregis) |
| Pedro Bueno | — |

<div align="center">Feito por estudantes da <b>UNIP</b> — 2025/2026</div>
