<div align="center">

<img src="img/logo.png" alt="Tronus" width="400"/>

# TRONUS

**Sistema gamificado de apoio acadêmico — PIM IV · ADS · UNIP**

[Site](https://tronus-one.vercel.app) · [API](https://king-blue-nine.vercel.app/docs) · [App mobile](https://github.com/Pim-Unip2025/mobile)

</div>

---

## Sobre

O **Tronus** ajuda calouros com dificuldade no semestre transformando a jornada acadêmica numa aventura: cada matéria é um **Reino** a ser conquistado.

| Elemento | Descrição |
|---|---|
| **Reinos** | As matérias do semestre (Python, C++, Engenharia de Software, Banco de Dados, Redes) |
| **Fases** | Cada Reino tem 3 fases, cada uma um quiz |
| **Estrelas** | Cada fase vale até 3 estrelas; vale sempre a melhor tentativa |
| **Títulos** | Plebeu → **Cavaleiro** (15 ★) → **Duque** (30 ★) → **Rei** (45 ★, todos os Reinos dominados) |

Perfis: **aluno** joga; **professor** cuida das perguntas do seu Reino e acompanha os alunos; **admin** gerencia usuários e vê os números da plataforma.

## Como as peças se conectam

```
Site (este repo)  ─┐
App mobile        ─┼──>  API (repo king, NestJS na Vercel)  ──>  PostgreSQL (Supabase)
App desktop       ─┘
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
