<div align="center">

<img src="img/logo.png" alt="Tronus" width="400"/>

# TRONUS

**Sistema gamificado de apoio acadêmico — PIM III & IV · ADS · UNIP**

[![GitHub](https://img.shields.io/badge/GitHub-Tronus-181717?style=for-the-badge&logo=github)](https://github.com/Pim-Unip2025/Tronus)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white)
![.NET 10](https://img.shields.io/badge/.NET_10-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

[Site Online](https://tronus-one.vercel.app) · [API REST / Docs](https://king-blue-nine.vercel.app/docs) · [Cliente Desktop](TronusDesktop/README.md)

</div>

---

## 📖 Sobre o Projeto

O **Tronus** é uma plataforma educacional gamificada concebida para auxiliar estudantes calouros do curso de Análise e Desenvolvimento de Sistemas (ADS) a superarem dificuldades iniciais na graduação. A jornada acadêmica é transformada em uma aventura épica: cada disciplina é um **Reino** a ser conquistado, composto por fases avaliativas e progressão nobiliárquica de patentes.

A plataforma possui duas interfaces clientes integradas à mesma API central:
1. 🌐 **Aplicação Web:** Interface responsiva em HTML5, CSS3 e JavaScript.
2. 🖥️ **Aplicação Desktop ([`TronusDesktop`](TronusDesktop/README.md)):** Cliente nativo Windows construído em C# e **.NET 10 (Windows Forms)** no modelo *Thin Client*, com atmosfera Dark Fantasy medieval.

---

## 📚 Documentação e Artefatos do Projeto

Abaixo estão os links de acesso direto aos artefatos de modelagem, arquitetura e documentação técnica do sistema Tronus:

| Artefato / Documento | Link de Acesso | Formato | Descrição e Finalidade Acadêmica |
| :--- | :---: | :---: | :--- |
| 🔄 **Diagrama de Sequência (UML)** | [**`DiagramaDeSequencia.md`**](docs/DiagramaDeSequencia.md) | Markdown / Astah | Modelagem comportamental e dinâmica com 11 diagramas de sequência cobrindo todas as telas, lifelines, tabelas de mensagens, regras de negócio e arquivos **Astah UML (`.asta` e `.astah`)**. |
| 🏛️ **Diagrama de Classes (UML)** | [**`DiagramaDeClasses.md`**](docs/DiagramaDeClasses.md) | Markdown / Astah | Modelagem estrutural estática com entidades, atributos tipados, métodos, multiplicidades e dicionário de dados. |
| 📐 **Diagrama de Casos de Uso (UML)** | [**`DiagramaDeCasosDeUso.md`**](docs/DiagramaDeCasosDeUso.md) | Markdown / Astah | Modelagem funcional com atores, dependências (`<<include>>`/`<<extend>>`) e matriz de rastreabilidade (RF01 a RF15). |
| 🔀 **Diagrama de Atividades (UML)** | [**`DiagramaDeAtividades.md`**](docs/DiagramaDeAtividades.md) | Markdown / Astah | Modelagem procedural dos fluxos operacionais (DA01 a DA06), raias e arquivos **Astah UML (`DiagramasDeAtividade.asta` e `.astah`)**. |
| 🗂️ **Projetos Modelados no Astah UML** | [**`DiagramasDeSequencia.astah`**](docs/DiagramasDeSequencia.astah) / [**`DiagramasDeAtividade.astah`**](docs/DiagramasDeAtividade.astah) | `.asta` / `.astah` | Arquivos oficiais do Astah com os diagramas de casos de uso, sequência e atividades integrados. |
| 📖 **Documentação do Software (Desktop)** | [**`SoftwareDocument.md`**](TronusDesktop/SoftwareDocument.md) | Markdown | Especificação técnica de arquitetura Thin Client, consumo de APIs REST, componentes visuais GDI+ e ciclo de vida. |
| 📘 **Manual do Usuário** | [**`ManualDoUsuario.md`**](TronusDesktop/ManualDoUsuario.md) | Markdown | Guia completo em 12 capítulos ilustrados para instalação, navegação e operação. |
| 📑 **Relatório Acadêmico (PIM III)** | [**`PIM_III_Tronus.docx`**](docs/PIM_III_Tronus.docx) | Word / ABNT | Monografia acadêmica completa com todas as etapas do PIM III integradas conforme normas da UNIP e ABNT. |
| 📊 **Apresentação da Modelagem UML** | [**`Apresentacao_Tronus_UML.pptx`**](docs/Apresentacao_Tronus_UML.pptx) | PowerPoint (16:9) | Apresentação executiva em 24 slides ilustrados com os diagramas de Casos de Uso, Atividades e Sequência explicados. |

---

## 🎮 Mecânica de Gamificação

| Elemento | Descrição |
|---|---|
| **Reinos** | Disciplinas do curso: Python, C++, Engenharia de Software, Banco de Dados e Redes. |
| **Fases** | Cada Reino possui 3 fases sequenciais de desafios no estilo ENADE. |
| **Estrelas** | Cada fase concede de 0 a 3 estrelas, persistindo sempre o melhor resultado histórico (`GREATEST`). |
| **Patentes Nobiliárquicas** | Plebeu (0 ★) → **Cavaleiro** (15 ★) → **Duque** (30 ★) → **Rei** (45 ★, domínio de todos os Reinos). |

Perfis de Acesso:
- **Aluno:** Joga desafios, customiza herói, avança na trilha e consulta ranking.
- **Professor:** Cadastra e gerencia questões, turmas e avalia o aproveitamento.
- **Administrador:** Governança geral de usuários, reinos e métricas do sistema.

---

## 🏗️ Como as Peças se Conectam

```mermaid
graph LR
    Web[Aplicação Web<br/>HTML5 / JS] ──> API[API Central NestJS<br/>Vercel HTTPS]
    Desk[Aplicação Desktop<br/>C# .NET 10] ──> API
    API ──> DB[(PostgreSQL Supabase<br/>Triggers & RLS)]
```

---

## 🚀 Como Executar o Projeto

### 1. Aplicação Desktop (C# / .NET 10)
Consulte a documentação em [`TronusDesktop/README.md`](TronusDesktop/README.md).
```bash
# Executar a aplicação desktop
dotnet run --project TronusDesktop/TronusDesktop.csproj
```

### 2. Aplicação Web
1. Abra o repositório no **VS Code**.
2. Utilize a extensão **Live Server** e clique com botão direito em `index.html` → **Open with Live Server**.
3. O projeto abrirá na porta `http://127.0.0.1:5500`.

---

## 🛠️ Tecnologias Utilizadas

- **C# / .NET 10 (Windows Forms)** — Aplicação Desktop nativa
- **HTML5 / CSS3 / JavaScript** — Aplicação Web responsiva
- **PostgreSQL / Supabase** — Banco de dados relacional com RLS e triggers ([`db/README.md`](db/README.md))
- **NestJS / REST API** — Backend centralizado
- **Astah Community / UML** — Ferramenta CASE para modelagem de Casos de Uso, Classes e Sequência
- **Boxicons & Google Fonts** — Ícones e tipografia medieval

---

## 👥 Equipe

| Nome | RA / Função | GitHub |
|---|:---:|---|
| Jhonatan Oliveira | RA: H654IJ1 | [@ojjhonatan](https://github.com/ojjhonatan) |
| Enzo Oliveira | RA: R714195 | [@EnzoOliveir19](https://github.com/EnzoOliveir19) |
| Renata Faria | RA: H74IAI3 | [@renatafaria001](https://github.com/renatafaria001) |
| Nickolas Barreto | RA: F35CBG6 | [@NckGoulart](https://github.com/NckGoulart) |
| Luiz Henrique | RA: F381551 | [@Luizzregis](https://github.com/Luizzregis) |
| Pedro Bueno | RA: H7460C0 | — |

<div align="center">Projeto Integrado Multidisciplinar (PIM) — <b>UNIP 2026</b></div>
