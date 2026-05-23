// gerar_pim.js — Gera o documento PIM III em DOCX
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, Header, Footer, PageOrientation, LevelFormat
} = require("docx");
const fs = require("fs");

// ── Helpers ───────────────────────────────────────────────────────────────────
const GOLD_BORDER = { style: BorderStyle.SINGLE, size: 1, color: "888888" };
const ALL_BORDERS = { top: GOLD_BORDER, bottom: GOLD_BORDER, left: GOLD_BORDER, right: GOLD_BORDER };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 120 },
    children: [new TextRun({ text, bold: true, size: 28, font: "Arial" })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 80 },
    children: [new TextRun({ text, bold: true, size: 24, font: "Arial" })],
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 60 },
    children: [new TextRun({ text, bold: true, size: 22, font: "Arial" })],
  });
}
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 160 },
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 708 }, // 1,25 cm
    children: [new TextRun({ text, size: 24, font: "Arial", ...opts })],
  });
}
function pNoIndent(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    alignment: AlignmentType.JUSTIFIED,
    children: [new TextRun({ text, size: 24, font: "Arial", ...opts })],
  });
}
function bullet(text) {
  return new Paragraph({
    spacing: { after: 100 },
    indent: { left: 720, hanging: 360 },
    children: [
      new TextRun({ text: "•  ", size: 24, font: "Arial" }),
      new TextRun({ text, size: 24, font: "Arial" }),
    ],
  });
}
function emptyLine() {
  return new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "" })] });
}
function pageBreak() {
  return new Paragraph({ pageBreakBefore: true, children: [new TextRun({ text: "" })] });
}
function centered(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 160 },
    children: [new TextRun({ text, size: 24, font: "Arial", ...opts })],
  });
}
function tableRow(cells, header = false) {
  return new TableRow({
    children: cells.map((txt, i) =>
      new TableCell({
        borders: ALL_BORDERS,
        shading: header ? { fill: "D0D0D0", type: ShadingType.CLEAR } : undefined,
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [new TextRun({ text: String(txt), size: 22, font: "Arial", bold: header })],
        })],
      })
    ),
  });
}

// ── Documento ─────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  styles: {
    default: {
      document: { run: { font: "Arial", size: 24 } },
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal",
        run: { size: 28, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0 },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal",
        run: { size: 24, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 1 },
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal",
        run: { size: 22, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 180, after: 60 }, outlineLevel: 2 },
      },
    ],
  },
  sections: [
    // ══════════════════════════════════════════════════════════════════
    // SEÇÃO 1 — CAPA
    // ══════════════════════════════════════════════════════════════════
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1701, bottom: 1134, left: 1701, right: 1134 }, // 3/3/2/2 cm
        },
      },
      children: [
        emptyLine(), emptyLine(), emptyLine(),
        centered("UNIVERSIDADE PAULISTA – UNIP", { bold: true, size: 26 }),
        emptyLine(),
        centered("Projeto Integrado Multidisciplinar III – PIM III", { bold: true, size: 24 }),
        centered("Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas", { size: 24 }),
        emptyLine(), emptyLine(), emptyLine(), emptyLine(),
        centered("TRONUS", { bold: true, size: 40 }),
        emptyLine(),
        centered("Plataforma Web Gamificada de Avaliação e Apoio à Aprendizagem", { bold: true, size: 26 }),
        emptyLine(), emptyLine(), emptyLine(), emptyLine(), emptyLine(),
        centered("Engenharia de Software Ágil Aplicada", { size: 24 }),
        centered("Banco de Dados Relacional", { size: 24 }),
        centered("Desenvolvimento Web Responsivo", { size: 24 }),
        centered("UX e UI Design", { size: 24 }),
        centered("Machine Learning e Análise de Dados", { size: 24 }),
        centered("Comunicação, Liderança e LIBRAS", { size: 24 }),
        emptyLine(), emptyLine(), emptyLine(), emptyLine(),
        centered("São Paulo", { size: 24 }),
        centered("2026", { size: 24 }),
      ],
    },

    // ══════════════════════════════════════════════════════════════════
    // SEÇÃO 2 — FOLHA DE ROSTO
    // ══════════════════════════════════════════════════════════════════
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1701, bottom: 1134, left: 1701, right: 1134 },
        },
      },
      children: [
        pageBreak(),
        centered("TRONUS — Plataforma Web Gamificada de Avaliação e Apoio à Aprendizagem", { bold: true, size: 26 }),
        emptyLine(), emptyLine(),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 120 },
          children: [new TextRun({
            text: "Projeto Integrado Multidisciplinar para obtenção do título de Tecnólogo em Análise e Desenvolvimento de Sistemas, apresentado à Universidade Paulista – UNIP.",
            size: 22, font: "Arial", italics: true,
          })],
        }),
        emptyLine(),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 80 },
          children: [new TextRun({ text: "Orientador(a): Professor(a) da disciplina", size: 22, font: "Arial" })],
        }),
        emptyLine(), emptyLine(), emptyLine(),
        centered("São Paulo – 2026", { size: 24 }),
      ],
    },

    // ══════════════════════════════════════════════════════════════════
    // SEÇÃO 3 — RESUMO + ABSTRACT
    // ══════════════════════════════════════════════════════════════════
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1701, bottom: 1134, left: 1701, right: 1134 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "TRONUS — PIM III · UNIP · 2026", size: 18, font: "Arial", color: "666666" })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: "Página ", size: 20, font: "Arial" }),
              new TextRun({ children: [PageNumber.CURRENT], size: 20, font: "Arial" }),
            ],
          })],
        }),
      },
      children: [
        pageBreak(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
          children: [new TextRun({ text: "RESUMO", bold: true, size: 24, font: "Arial" })],
        }),
        p("O presente trabalho descreve o desenvolvimento da plataforma Tronus, uma aplicação web gamificada de avaliação e apoio à aprendizagem voltada para estudantes do primeiro ano do curso de Análise e Desenvolvimento de Sistemas (ADS). A empresa fictícia Tronus EdTech, criada como contexto organizacional do projeto, identificou o alto índice de reprovação e evasão entre calouros universitários como problema central a ser endereçado. A solução proposta transforma o processo de estudo em uma jornada de RPG: os conteúdos de cada disciplina são organizados em Reinos, cada Reino possui três Fases com quizzes no estilo ENADE, e o estudante acumula estrelas que determinam seu título — de Plebeu a Rei."),
        p("O sistema foi desenvolvido integralmente com tecnologias web (HTML5, CSS3 e JavaScript), banco de dados relacional modelado com SQL e persistido via sql.js no navegador, e princípios de UX/UI que priorizam responsividade e usabilidade. O trabalho contempla, ainda, análise de indicadores de desempenho dos usuários, proposta de acessibilidade em LIBRAS e práticas de engenharia de software ágil."),
        emptyLine(),
        pNoIndent("Palavras-chave: Gamificação. Plataforma educacional. Desenvolvimento web. Banco de dados. UX/UI Design. Análise de dados. LIBRAS."),

        emptyLine(), emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
          children: [new TextRun({ text: "ABSTRACT", bold: true, size: 24, font: "Arial" })],
        }),
        p("This paper describes the development of Tronus, a gamified web-based assessment and learning support platform aimed at first-year students of the Systems Analysis and Development (ADS) undergraduate program. The fictitious company Tronus EdTech was created as the organizational context, addressing the high failure and dropout rates among incoming university students. The proposed solution transforms the study process into an RPG journey: each subject area is a Kingdom, each Kingdom has three Phases with ENADE-style quizzes, and students collect stars that determine their rank — from Commoner to King."),
        p("The system was built entirely with web technologies (HTML5, CSS3, JavaScript), a relational database modeled in SQL and persisted via sql.js in the browser, and UX/UI principles focused on responsiveness and usability. The work also covers user performance analytics, a LIBRAS accessibility proposal, and agile software engineering practices."),
        emptyLine(),
        pNoIndent("Keywords: Gamification. Educational platform. Web development. Database. UX/UI Design. Data analysis. LIBRAS."),

        // ── SUMÁRIO ──────────────────────────────────────────────────────────
        pageBreak(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 360 },
          children: [new TextRun({ text: "SUMÁRIO", bold: true, size: 24, font: "Arial" })],
        }),
        ...[
          ["1", "INTRODUÇÃO", "4"],
          ["2", "ETAPA 1 — DEFINIÇÃO DO NEGÓCIO FICTÍCIO", "5"],
          ["3", "ETAPA 2 — ENGENHARIA DE SOFTWARE ÁGIL APLICADA", "7"],
          ["4", "ETAPA 3 — MODELAGEM DE BANCO DE DADOS E NoSQL", "10"],
          ["5", "ETAPA 4 — DESENVOLVIMENTO WEB RESPONSIVO", "14"],
          ["6", "ETAPA 5 — UX E UI DESIGN", "17"],
          ["7", "ETAPA 6 — MACHINE LEARNING E ANÁLISE DE DADOS", "19"],
          ["8", "ETAPA 7 — COMUNICAÇÃO, LIDERANÇA E LIBRAS", "22"],
          ["9", "CONCLUSÃO", "24"],
          ["", "REFERÊNCIAS", "25"],
        ].map(([num, titulo, pag]) =>
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({ text: num ? `${num}  ${titulo}` : `   ${titulo}`, size: 22, font: "Arial" }),
              new TextRun({ text: `  .........  ${pag}`, size: 22, font: "Arial", color: "888888" }),
            ],
          })
        ),

        // ══════════════════════════════════════════════════════════════
        // INTRODUÇÃO
        // ══════════════════════════════════════════════════════════════
        pageBreak(),
        h1("1  INTRODUÇÃO"),
        p("O avanço das tecnologias digitais tem ampliado a presença de plataformas educacionais que apoiam o processo de ensino e aprendizagem por meio de recursos interativos e análise de dados. Nesse contexto, empresas de tecnologia educacional (EdTech) buscam oferecer soluções inovadoras que vão além da transmissão passiva de conteúdo."),
        p("O presente Projeto Integrado Multidisciplinar (PIM III) descreve o desenvolvimento da plataforma Tronus, criada no âmbito de uma empresa fictícia de EdTech denominada Tronus EdTech. O sistema propõe transformar o processo de aprendizagem de calouros universitários em uma experiência gamificada, na qual cada disciplina do curso de Análise e Desenvolvimento de Sistemas (ADS) é representada como um \"Reino\" a ser conquistado."),
        p("O objetivo geral deste projeto é desenvolver uma plataforma web de avaliação e apoio à aprendizagem, integrando conceitos de engenharia de software ágil, modelagem de dados, desenvolvimento web responsivo, UX/UI design e análise de indicadores de desempenho, com atenção à acessibilidade e à Lei Geral de Proteção de Dados (LGPD)."),
        p("Do ponto de vista metodológico, o trabalho foi organizado segundo as etapas do PIM III, cada uma correspondendo a um capítulo do presente documento. As tecnologias utilizadas incluem HTML5, CSS3, JavaScript, sql.js (SQLite no navegador) e princípios de design responsivo, contemplando todos os perfis de dispositivos."),
        p("Este documento está estruturado em oito etapas: (1) definição do negócio fictício; (2) engenharia de software ágil; (3) modelagem de banco de dados; (4) desenvolvimento web responsivo; (5) UX/UI design; (6) análise de dados; (7) comunicação, liderança e LIBRAS; seguidas da conclusão e referências."),

        // ══════════════════════════════════════════════════════════════
        // ETAPA 1 — NEGÓCIO FICTÍCIO
        // ══════════════════════════════════════════════════════════════
        pageBreak(),
        h1("2  ETAPA 1 — DEFINIÇÃO DO NEGÓCIO FICTÍCIO"),
        h2("2.1 Denominação e Segmento"),
        p("A empresa fictícia criada para este projeto chama-se Tronus EdTech. Trata-se de uma startup do segmento de tecnologia educacional (EdTech), com foco no desenvolvimento de soluções digitais gamificadas para o ensino superior."),
        h2("2.2 Público-Alvo"),
        p("O público-alvo da Tronus EdTech são estudantes universitários matriculados nos primeiros semestres do curso de Análise e Desenvolvimento de Sistemas (ADS), com faixa etária predominante entre 17 e 25 anos, oriundos de distintas realidades socioeconômicas e com variados níveis de experiência prévia com programação e tecnologia."),
        h2("2.3 Produto ou Serviço Oferecido"),
        p("A Tronus EdTech oferece a plataforma Tronus: um ambiente web gamificado de avaliação e apoio ao aprendizado. A plataforma organiza o conteúdo das disciplinas do curso em Reinos (Python, C++, Engenharia de Software, Banco de Dados e Redes), cada um com três Fases compostas por quizzes no estilo ENADE."),
        p("O estudante cria um personagem (com gênero e avatar personalizados), percorre os Reinos, responde questões de múltipla escolha e acumula estrelas (0 a 3 por fase). O desempenho define o título do personagem: Plebeu (0), Cavaleiro (15 estrelas), Duque (30) e Rei (50). Um painel de análise de dados exibe as métricas de desempenho individuais."),
        h2("2.4 Problemas que a Plataforma Busca Solucionar"),
        p("De acordo com dados do Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (INEP), o índice de evasão nos cursos de tecnologia chega a 40% nos dois primeiros semestres. Os principais fatores apontados são a dificuldade de adaptação ao conteúdo técnico e a falta de engajamento."),
        p("A Tronus EdTech identificou dois problemas centrais:"),
        bullet("Baixo engajamento dos calouros com o material de estudo tradicional, levando à procrastinação e ao baixo desempenho nas avaliações formais."),
        bullet("Ausência de feedback imediato e personalizado sobre o progresso individual, dificultando que o estudante saiba em quais tópicos precisa se aprofundar."),
        p("A plataforma Tronus endereça esses problemas ao oferecer um ambiente lúdico e competitivo, com feedback instantâneo por questão e visualização clara do progresso, mantendo o estudante engajado e orientado."),
        h2("2.5 Aspectos de Conformidade com a LGPD"),
        p("A plataforma coleta dados pessoais dos usuários (nome, e-mail, celular e senha). Em conformidade com a Lei nº 13.709/2018 (LGPD), o sistema:"),
        bullet("Armazena os dados localmente no dispositivo do usuário (localStorage), sem transferência para servidores de terceiros."),
        bullet("Solicita apenas os dados estritamente necessários para o funcionamento da plataforma (princípio da minimização)."),
        bullet("Prevê, em versões futuras, a implementação de criptografia de senhas (hash bcrypt) e funcionalidade de exclusão de conta."),

        // ══════════════════════════════════════════════════════════════
        // ETAPA 2 — ENGENHARIA ÁGIL
        // ══════════════════════════════════════════════════════════════
        pageBreak(),
        h1("3  ETAPA 2 — ENGENHARIA DE SOFTWARE ÁGIL APLICADA"),
        h2("3.1 Partes Interessadas (Stakeholders)"),
        p("A identificação das partes interessadas é passo fundamental na engenharia ágil. Para o projeto Tronus, foram identificados os seguintes stakeholders:"),
        new Table({
          width: { size: 9026, type: WidthType.DXA },
          columnWidths: [2500, 3263, 3263],
          rows: [
            tableRow(["Stakeholder", "Papel", "Interesse"], true),
            tableRow(["Estudante (calouro)", "Usuário principal", "Aprender de forma engajante e acompanhar seu progresso"]),
            tableRow(["Professor", "Administrador de conteúdo", "Cadastrar questões e monitorar o desempenho da turma"]),
            tableRow(["Coordenação do curso", "Patrocinador", "Reduzir evasão e elevar o desempenho médio dos alunos"]),
            tableRow(["Equipe de desenvolvimento", "Fornecedor da solução", "Entregar um produto funcional e bem documentado"]),
          ],
        }),
        emptyLine(),
        h2("3.2 Requisitos Funcionais"),
        p("Os requisitos funcionais descrevem o que o sistema deve fazer. Os principais são:"),
        ...[
          "RF01 — O sistema deve permitir o cadastro de usuário com nome, e-mail, celular e senha.",
          "RF02 — O sistema deve permitir login via nome de usuário ou e-mail.",
          "RF03 — O sistema deve permitir a criação de um personagem com nome, gênero e avatar.",
          "RF04 — O sistema deve exibir os Reinos disponíveis com o progresso do usuário.",
          "RF05 — O sistema deve apresentar quizzes com 5 questões por fase.",
          "RF06 — O sistema deve calcular e exibir estrelas com base no desempenho (0–3 por fase).",
          "RF07 — O sistema deve atualizar o título do personagem conforme o total de estrelas.",
          "RF08 — O sistema deve exibir um painel de análise com taxa de acerto por fase e reino.",
          "RF09 — O sistema deve oferecer glossário de termos de TI em LIBRAS.",
          "RF10 — O sistema deve permitir a redefinição de senha via número de celular.",
          "RF11 — O sistema deve disponibilizar painel exclusivo ao professor para criar e excluir questões por fase.",
          "RF12 — O sistema deve permitir que o professor busque alunos por nome e visualize o desempenho individual.",
          "RF13 — O sistema deve disponibilizar painel exclusivo ao administrador com estatísticas gerais e CRUD de usuários.",
          "RF14 — O sistema deve exibir confirmação (double-check) ao usuário antes de efetuar logout.",
          "RF15 — O sistema deve redirecionar automaticamente o usuário para a interface correspondente ao seu papel (aluno, professor ou admin) após o login.",
        ].map(txt => bullet(txt)),
        emptyLine(),
        h2("3.3 Requisitos Não Funcionais"),
        ...[
          "RNF01 — Usabilidade: a interface deve ser intuitiva, com tempo de aprendizagem inferior a 5 minutos.",
          "RNF02 — Responsividade: o sistema deve funcionar em dispositivos móveis (320 px) e desktops.",
          "RNF03 — Desempenho: o carregamento inicial deve ocorrer em até 3 segundos em conexão 4G.",
          "RNF04 — Persistência: os dados devem ser mantidos entre sessões via localStorage.",
          "RNF05 — Acessibilidade: o sistema deve incorporar elementos de LIBRAS e seguir boas práticas de contraste.",
          "RNF06 — Privacidade: os dados pessoais não devem ser transmitidos a servidores externos.",
        ].map(txt => bullet(txt)),
        emptyLine(),
        h2("3.4 Backlog e Priorização"),
        p("O backlog foi organizado e priorizado segundo o método MoSCoW (Must have, Should have, Could have, Won't have):"),
        new Table({
          width: { size: 9026, type: WidthType.DXA },
          columnWidths: [1800, 4726, 2500],
          rows: [
            tableRow(["Prioridade", "Funcionalidade", "Sprint"], true),
            tableRow(["Must have", "Cadastro e login de usuário", "Sprint 1"]),
            tableRow(["Must have", "Criação de personagem", "Sprint 1"]),
            tableRow(["Must have", "Listagem de Reinos com progresso", "Sprint 2"]),
            tableRow(["Must have", "Quiz por fase com 5 questões", "Sprint 2"]),
            tableRow(["Must have", "Sistema de estrelas e títulos", "Sprint 3"]),
            tableRow(["Must have", "Questões Python no estilo ENADE (5 por fase)", "Sprint 3"]),
            tableRow(["Should have", "Painel de análise de desempenho (dashboard)", "Sprint 3"]),
            tableRow(["Should have", "Tema dark/light", "Sprint 3"]),
            tableRow(["Should have", "Glossário LIBRAS", "Sprint 4"]),
            tableRow(["Should have", "Painel do Professor (CRUD questões, desempenho alunos)", "Sprint 4"]),
            tableRow(["Should have", "Painel do Administrador (stats, CRUD usuários)", "Sprint 4"]),
            tableRow(["Should have", "Controle de acesso por papel (aluno / professor / admin)", "Sprint 4"]),
            tableRow(["Should have", "Double-check de logout", "Sprint 4"]),
            tableRow(["Could have", "Questões para todos os reinos", "Sprint 5"]),
            tableRow(["Could have", "Ranking entre usuários", "Sprint 5"]),
          ],
        }),
        emptyLine(),
        h2("3.5 Iterações e Critérios de Aceite"),
        p("O desenvolvimento foi organizado em 4 sprints de duas semanas cada, seguindo o framework Scrum simplificado:"),
        bullet("Sprint 1 (Semanas 1–2): Autenticação completa, criação de personagem. Critério: usuário consegue se cadastrar, logar e criar personagem sem erros."),
        bullet("Sprint 2 (Semanas 3–4): Reinos, trilha e quiz funcional. Critério: quiz exibe 5 questões, registra acertos e atribui estrelas automaticamente."),
        bullet("Sprint 3 (Semanas 5–6): Dashboard de análise, questões ENADE Python, tema e progresso persistente. Critério: dados são mantidos após fechar o navegador; quiz exibe questões no formato I/II/III/IV com feedback por alternativa."),
        bullet("Sprint 4 (Semanas 7–8): Painel do professor (CRUD questões, busca de alunos), painel do admin (stats, CRUD usuários), controle de acesso por papel, double-check de logout, glossário LIBRAS e responsividade. Critério: professor consegue criar e excluir questões; admin visualiza estatísticas e exclui usuários; interface funciona em tela de 320 px."),

        // ══════════════════════════════════════════════════════════════
        // ETAPA 3 — BANCO DE DADOS
        // ══════════════════════════════════════════════════════════════
        pageBreak(),
        h1("4  ETAPA 3 — MODELAGEM DE BANCO DE DADOS E NoSQL"),
        h2("4.1 Informações Essenciais ao Negócio"),
        p("Para o funcionamento da plataforma Tronus, foram identificadas as seguintes informações essenciais: dados dos usuários, perfil do personagem, estrutura de reinos e fases, questões e alternativas, progresso por fase e respostas individuais para análise."),
        h2("4.2 Modelo Conceitual"),
        p("O modelo conceitual identifica as entidades e seus relacionamentos de alto nível:"),
        bullet("Usuario (1) ←→ (1) Personagem"),
        bullet("Personagem (1) ←→ (N) ProgressoFase"),
        bullet("Reino (1) ←→ (N) Fase"),
        bullet("Fase (1) ←→ (N) Questao"),
        bullet("Questao (1) ←→ (N) Alternativa"),
        bullet("Personagem (1) ←→ (N) RespostaUsuario"),
        bullet("Questao (1) ←→ (N) RespostaUsuario"),
        emptyLine(),
        h2("4.3 Modelo Lógico — Banco de Dados Relacional"),
        p("O modelo lógico detalha as tabelas, atributos, chaves primárias (PK) e estrangeiras (FK) do sistema:"),
        new Table({
          width: { size: 9026, type: WidthType.DXA },
          columnWidths: [2000, 4026, 3000],
          rows: [
            tableRow(["Tabela", "Atributos Principais", "Relacionamentos"], true),
            tableRow(["usuarios", "id (PK), nome (UNIQUE), email (UNIQUE), celular, senha, papel (aluno|professor|admin), professor_reino_id (FK)", "1:1 com personagens; papel define o nível de acesso"]),
            tableRow(["personagens", "id (PK), usuario_id (FK), nome, genero, avatar, titulo_atual, total_estrelas", "N:1 com usuarios"]),
            tableRow(["reinos", "id (PK), nome, descricao", "1:N com fases"]),
            tableRow(["fases", "id (PK), reino_id (FK), nome", "N:1 com reinos; 1:N com questoes"]),
            tableRow(["questoes", "id (PK), fase_id (FK), enunciado, nivel_dificuldade", "N:1 com fases; 1:N com alternativas"]),
            tableRow(["alternativas", "id (PK), questao_id (FK), letra, texto, correta", "N:1 com questoes"]),
            tableRow(["progresso_fases", "id (PK), personagem_id (FK), fase_id (FK), estrelas", "UNIQUE(personagem_id, fase_id)"]),
            tableRow(["respostas_usuario", "id (PK), personagem_id (FK), questao_id (FK), fase_id (FK), acertou, data_resposta", "Tabela de fatos para analytics"]),
          ],
        }),
        emptyLine(),
        h2("4.4 Script DDL de Criação do Banco"),
        p("O banco de dados é criado e gerenciado pela biblioteca sql.js (SQLite compilado em WebAssembly), executado diretamente no navegador. O script DDL das tabelas principais é apresentado a seguir:"),
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({
            text:
              "CREATE TABLE usuarios (\n" +
              "  id INTEGER PRIMARY KEY AUTOINCREMENT,\n" +
              "  nome TEXT UNIQUE NOT NULL,\n" +
              "  email TEXT UNIQUE NOT NULL,\n" +
              "  celular TEXT NOT NULL,\n" +
              "  senha TEXT NOT NULL,\n" +
              "  papel TEXT DEFAULT 'aluno',         -- aluno | professor | admin\n" +
              "  professor_reino_id INTEGER DEFAULT NULL\n" +
              ");\n\n" +
              "CREATE TABLE questoes (\n" +
              "  id INTEGER PRIMARY KEY AUTOINCREMENT,\n" +
              "  fase_id INTEGER NOT NULL,\n" +
              "  enunciado TEXT NOT NULL,\n" +
              "  nivel_dificuldade TEXT DEFAULT 'Médio',\n" +
              "  FOREIGN KEY (fase_id) REFERENCES fases(id)\n" +
              ");\n\n" +
              "CREATE TABLE alternativas (\n" +
              "  id INTEGER PRIMARY KEY AUTOINCREMENT,\n" +
              "  questao_id INTEGER NOT NULL,\n" +
              "  letra TEXT NOT NULL,\n" +
              "  texto TEXT NOT NULL,\n" +
              "  correta INTEGER DEFAULT 0,\n" +
              "  FOREIGN KEY (questao_id) REFERENCES questoes(id)\n" +
              ");\n\n" +
              "CREATE TABLE respostas_usuario (\n" +
              "  id INTEGER PRIMARY KEY AUTOINCREMENT,\n" +
              "  personagem_id INTEGER NOT NULL,\n" +
              "  questao_id INTEGER NOT NULL,\n" +
              "  fase_id INTEGER NOT NULL,\n" +
              "  acertou INTEGER DEFAULT 0,\n" +
              "  data_resposta TEXT NOT NULL\n" +
              ");",
            size: 18, font: "Courier New", color: "333333",
          })],
        }),
        emptyLine(),
        h3("4.4.1 Controle de Acesso por Papel (Role-Based Access Control)"),
        p("A coluna papel na tabela usuarios implementa um controle de acesso baseado em papéis (RBAC). Três papéis estão definidos:"),
        bullet("aluno — acesso ao fluxo de jogo (reinos, trilha, quiz, dashboard pessoal). Criado automaticamente no cadastro."),
        bullet("professor — acesso ao painel do professor (professor.html): criar/excluir questões por fase, visualizar desempenho de alunos por nome. Vinculado a um reino via professor_reino_id."),
        bullet("admin — acesso ao painel administrativo (admin.html): estatísticas gerais do sistema, listagem e exclusão de usuários."),
        p("Ao efetuar login, o sistema verifica o campo papel e redireciona automaticamente: alunos para reinos.html, professores para professor.html e administradores para admin.html. Dois usuários especiais são criados automaticamente na inicialização do banco — prof_python (professor do Reino Python) e admin — cujas credenciais estão documentadas no arquivo LOGINS.md do repositório."),
        emptyLine(),
        h2("4.5 Consultas SQL Relevantes"),
        p("Exemplos de consultas utilizadas pelo sistema para análise de desempenho:"),
        new Paragraph({
          spacing: { after: 160 },
          children: [new TextRun({
            text:
              "-- Taxa de acerto por reino e fase\n" +
              "SELECT r.nome AS reino, f.nome AS fase,\n" +
              "  COUNT(ru.id) AS tentativas,\n" +
              "  SUM(ru.acertou) AS acertos,\n" +
              "  ROUND(AVG(ru.acertou)*100, 1) AS taxa_acerto\n" +
              "FROM reinos r\n" +
              "JOIN fases f ON f.reino_id = r.id\n" +
              "LEFT JOIN questoes q ON q.fase_id = f.id\n" +
              "LEFT JOIN respostas_usuario ru ON ru.questao_id = q.id\n" +
              "WHERE ru.personagem_id = :id\n" +
              "GROUP BY r.id, f.id;",
            size: 18, font: "Courier New", color: "333333",
          })],
        }),
        h2("4.6 Justificativa Relacional vs. NoSQL"),
        p("O banco de dados relacional (SQLite) foi adotado como tecnologia primária pela forte dependência entre entidades (usuário → personagem → progresso → questões) e pela necessidade de integridade referencial via chaves estrangeiras."),
        p("A adoção de um banco NoSQL poderia ser justificada em dois cenários futuros:"),
        bullet("MongoDB (documento): para armazenar questões com conteúdo multimídia (imagens, áudios) sem esquema fixo, com maior flexibilidade na estrutura do enunciado."),
        bullet("Redis (chave-valor): para cache de sessão e armazenamento temporário de estado do quiz em tempo real, reduzindo a latência em uma versão com backend centralizado."),
        p("Na versão atual, a escolha pelo SQLite via sql.js é justificada pela simplicidade de implantação (sem servidor), pela portabilidade e pelo suporte nativo a transações ACID — características adequadas a um ambiente acadêmico offline."),

        // ══════════════════════════════════════════════════════════════
        // ETAPA 4 — WEB RESPONSIVO
        // ══════════════════════════════════════════════════════════════
        pageBreak(),
        h1("5  ETAPA 4 — DESENVOLVIMENTO WEB RESPONSIVO"),
        h2("5.1 Arquitetura Geral da Aplicação"),
        p("A plataforma Tronus é uma Single Page Application (SPA) estática, composta integralmente por HTML5, CSS3 e JavaScript vanilla, sem dependência de frameworks ou servidores de aplicação. A comunicação com o banco de dados é feita via sql.js, que executa um motor SQLite compilado em WebAssembly (WASM) diretamente no navegador."),
        new Table({
          width: { size: 9026, type: WidthType.DXA },
          columnWidths: [2500, 4026, 2500],
          rows: [
            tableRow(["Camada", "Tecnologia", "Função"], true),
            tableRow(["Apresentação", "HTML5 + CSS3", "Estrutura e estilo das interfaces"]),
            tableRow(["Lógica", "JavaScript ES6+", "Regras de negócio e interação"]),
            tableRow(["Dados", "sql.js (SQLite/WASM)", "Banco relacional no navegador"]),
            tableRow(["Persistência", "localStorage (base64)", "Armazenamento entre sessões"]),
            tableRow(["Ícones", "Boxicons", "Biblioteca de ícones vetoriais"]),
            tableRow(["Tipografia", "Google Fonts", "Fontes Poppins, Cinzel, Crimson Text"]),
          ],
        }),
        emptyLine(),
        h2("5.2 Telas Desenvolvidas"),
        p("O sistema é composto por dez telas, organizadas por perfil de acesso:"),
        h3("5.2.1 Telas do Aluno"),
        ...[
          "landing.html — Página de boas-vindas com apresentação da plataforma.",
          "index.html — Tela de login com suporte a nome de usuário ou e-mail e redirecionamento por papel.",
          "register.html — Cadastro de novo usuário (papel 'aluno' atribuído por padrão).",
          "forgot_password.html — Redefinição de senha via número de celular.",
          "character.html — Criação de personagem (nome, gênero, avatar).",
          "reinos.html — Seleção do Reino com exibição de progresso e barra de título.",
          "trilha.html — Trilha de fases com quiz interativo (estilo ENADE), cards de atividades e botão de acessibilidade LIBRAS.",
          "dashboard.html — Painel de análise de desempenho individual com gráfico por reino e tabela detalhada por fase.",
        ].map(t => bullet(t)),
        emptyLine(),
        h3("5.2.2 Telas de Gestão"),
        ...[
          "professor.html — Painel do Professor: aba 'Questões' (criar/excluir questões por fase) e aba 'Alunos' (busca por nome e visualização de desempenho individual expandível).",
          "admin.html — Painel do Administrador: estatísticas gerais do sistema (usuários, questões, respostas), listagem completa de usuários com exclusão e módulos futuros sinalizados.",
        ].map(t => bullet(t)),
        emptyLine(),
        h2("5.3 Responsividade"),
        p("A responsividade foi implementada por meio de CSS Flexbox, CSS Grid e media queries. As principais adaptações para dispositivos móveis incluem:"),
        bullet("Sidebar retrátil que se oculta em telas menores que 480 px."),
        bullet("Grid de Reinos que colapsa de 3 colunas para 1 coluna em dispositivos móveis."),
        bullet("Alternativas do quiz ocupando 100% da largura em telas pequenas."),
        bullet("Botão LIBRAS reposicionado para o canto inferior direito, afastado de elementos interativos."),
        p("Testes foram realizados nos breakpoints de 320 px (smartphone compacto), 768 px (tablet) e 1280 px (desktop), utilizando o DevTools do Google Chrome."),
        h2("5.4 Integração Front-End e Banco de Dados"),
        p("A integração entre a camada de apresentação e o banco de dados é feita diretamente em JavaScript. O arquivo js/database.js centraliza todas as funções de acesso ao banco, organizadas por domínio:"),
        bullet("Autenticação: cadastrarUsuario(), loginUsuario(), redefinirSenha()."),
        bullet("Personagem e progresso: salvarPersonagem(), buscarPersonagem(), atualizarProgresso(), atualizarTitulo()."),
        bullet("Quiz: buscarQuestoesPorFase(), registrarResposta()."),
        bullet("Analytics: buscarEstatisticas(), buscarResumoGeral()."),
        bullet("Painel do professor: criarQuestao(), excluirQuestao(), listarQuestoesDaFase(), buscarAlunosPorNome(), buscarDesempenhoAluno(), buscarFasesPorReino()."),
        bullet("Seeds e migração: seedReinos(), seedQuestoes(), seedUsuariosEspeciais(), migrateDatabase() — garante compatibilidade com bancos já existentes no localStorage sem perda de dados."),
        p("Cada tela importa este arquivo e chama as funções necessárias após a inicialização assíncrona do banco via initDatabase(). A função migrateDatabase() aplica ALTER TABLE de forma idempotente (try/catch), permitindo que usuários com versões antigas do banco recebam as novas colunas automaticamente na próxima visita."),

        // ══════════════════════════════════════════════════════════════
        // ETAPA 5 — UX/UI DESIGN
        // ══════════════════════════════════════════════════════════════
        pageBreak(),
        h1("6  ETAPA 5 — UX E UI DESIGN"),
        h2("6.1 Personas"),
        h3("Persona 1 — Carlos, o Calouro"),
        bullet("Idade: 19 anos | Semestre: 1º ADS"),
        bullet("Motivação: Quer aprender programação, mas se sente sobrecarregado com o volume de conteúdo."),
        bullet("Frustrações: Provas chegam rápido; não sabe por onde estudar."),
        bullet("Expectativa com a plataforma: Ter um guia claro de progresso e feedback imediato ao errar."),
        emptyLine(),
        h3("Persona 2 — Ana, a Estudante Intermediária"),
        bullet("Idade: 22 anos | Semestre: 2º ADS (repetente em Python)"),
        bullet("Motivação: Quer reforçar fundamentos de programação de forma prática."),
        bullet("Frustrações: Estuda sozinha, sem saber se está no caminho certo."),
        bullet("Expectativa com a plataforma: Acompanhar sua evolução em cada tópico e identificar pontos fracos."),
        emptyLine(),
        h2("6.2 Fluxos de Navegação"),
        p("O fluxo principal do usuário segue o seguinte caminho:"),
        p("Landing Page → Login → (Cadastro) → Criar Personagem → Selecionar Reino → Trilha de Fases → Quiz → Resultado (estrelas) → Dashboard de Análise"),
        h2("6.3 Identidade Visual"),
        p("A identidade visual da plataforma adota um tema medieval fantástico para reforçar a narrativa de RPG:"),
        bullet("Paleta de cores: dourado (#d4af37), preto profundo (#0a0500) e pergaminho (#f0e6c8)."),
        bullet("Tipografia: Cinzel (títulos medievais) + Crimson Text (corpo do texto) + Poppins (UI moderna)."),
        bullet("Fundo: imagem de mapa de reino com overlay escuro para garantir legibilidade."),
        bullet("Ícones: Boxicons para consistência visual em toda a interface."),
        h2("6.4 Princípios de Usabilidade Aplicados"),
        bullet("Visibilidade do estado do sistema: barras de progresso, estrelas e título do personagem sempre visíveis."),
        bullet("Feedback imediato: após cada resposta do quiz, o sistema indica em verde (correto) ou vermelho (errado)."),
        bullet("Prevenção de erros: fases bloqueadas evitam que o usuário avance sem completar etapas anteriores."),
        bullet("Consistência: o mesmo padrão visual (modal, botões dourados, fonte Cinzel) é mantido em todas as telas."),
        bullet("Tema dark/light: botão de alternância para reduzir fadiga visual em diferentes contextos de uso."),

        // ══════════════════════════════════════════════════════════════
        // ETAPA 6 — ANÁLISE DE DADOS
        // ══════════════════════════════════════════════════════════════
        pageBreak(),
        h1("7  ETAPA 6 — MACHINE LEARNING E ANÁLISE DE DADOS"),
        h2("7.1 Dados Relevantes para Análise"),
        p("A plataforma Tronus coleta, para cada usuário, os seguintes dados relevantes para análise de desempenho:"),
        ...[
          "questao_id: identificador da questão respondida.",
          "fase_id: fase à qual a questão pertence.",
          "acertou: 1 (correto) ou 0 (incorreto).",
          "data_resposta: data da resposta no formato YYYY-MM-DD.",
          "personagem_id: identificador do estudante.",
          "estrelas: quantidade de estrelas obtidas por fase (0 a 3).",
        ].map(t => bullet(t)),
        h2("7.2 Indicadores de Desempenho Gerados"),
        new Table({
          width: { size: 9026, type: WidthType.DXA },
          columnWidths: [3500, 3000, 2526],
          rows: [
            tableRow(["Indicador", "Fórmula", "Interpretação"], true),
            tableRow(["Taxa de acerto geral", "Σ acertou / Σ tentativas × 100", "Desempenho global do estudante"]),
            tableRow(["Taxa por reino", "Acertos reino / Tentativas reino × 100", "Identifica reinos com mais dificuldade"]),
            tableRow(["Taxa por fase", "Acertos fase / Tentativas fase × 100", "Pinpoints tópicos específicos"]),
            tableRow(["Estrelas por fase", "0–3 (calculado no quiz)", "Mede o nível de domínio"]),
            tableRow(["Fases com 3 estrelas", "COUNT(estrelas = 3)", "Mede quantidade de fases dominadas"]),
            tableRow(["Tentativas por fase", "COUNT(respostas) / 5", "Indica quantas vezes o quiz foi refeito"]),
          ],
        }),
        emptyLine(),
        h2("7.3 Dashboard de Análise — Tela dashboard.html"),
        p("O painel de análise de dados (dashboard.html) apresenta as informações de desempenho de forma visual e interativa, permitindo que o estudante compreenda facilmente seus pontos fortes e fracos."),
        p("Componentes do dashboard:"),
        bullet("Resumo geral: cards com total de questões respondidas, total de acertos, taxa de acerto geral, estrelas conquistadas e fases com 3 estrelas."),
        bullet("Gráfico de barras (CSS puro): exibe a taxa de acerto por Reino. Barras mais altas indicam maior domínio do conteúdo."),
        bullet("Tabela detalhada: lista todos os Reinos e Fases com colunas de tentativas, acertos, taxa de acerto, barra visual de progresso e estrelas."),
        h2("7.4 Aplicação de Técnicas de Análise de Dados"),
        p("As análises são realizadas por meio de consultas SQL com funções agregadas (COUNT, SUM, AVG, ROUND) diretamente no banco SQLite embarcado. Embora o escopo atual utilize estatística descritiva básica, a arquitetura foi projetada para suportar técnicas mais avançadas em versões futuras:"),
        bullet("Recomendação por conteúdo (filtragem colaborativa): sugerir questões das áreas com maior índice de erro para reforço personalizado."),
        bullet("Modelo preditivo de evasão: identificar estudantes com baixo engajamento (poucas tentativas, queda na taxa de acerto ao longo do tempo) e acionar alertas."),
        bullet("Clusterização de perfis: agrupar estudantes com padrões de desempenho semelhantes para sugerir estratégias de estudo personalizadas."),
        h2("7.5 Interpretação dos Resultados"),
        p("Os resultados gerados pelo dashboard permitem ao estudante tomar decisões pedagógicas embasadas em dados. Por exemplo: um estudante com taxa de acerto de 40% no Reino de Python — Fase 2 (Estruturas de Controle) recebe o sinal de que deve revisar laços de repetição e comandos de desvio de fluxo antes de avançar para a Fase 3."),
        p("A proposta de valor é transformar dados de interação (respostas certas e erradas) em inteligência educacional acionável, apoiando a tomada de decisão do estudante de forma autônoma e contínua."),

        // ══════════════════════════════════════════════════════════════
        // ETAPA 7 — COMUNICAÇÃO, LIDERANÇA E LIBRAS
        // ══════════════════════════════════════════════════════════════
        pageBreak(),
        h1("8  ETAPA 7 — COMUNICAÇÃO, LIDERANÇA, NEGOCIAÇÃO E LIBRAS"),
        h2("8.1 Estratégias de Comunicação na Equipe"),
        p("A comunicação da equipe de desenvolvimento foi estruturada em três canais principais:"),
        bullet("Reuniões de sprint (semanais): planejamento e revisão das entregas via videoconferência, com registro em ata digital."),
        bullet("Repositório GitHub (Pim-Unip2025/Tronus): controle de versão e histórico de alterações acessível a todos os membros."),
        bullet("Sprint Planning (planilha SPRINT PLANNING.xlsx): backlog priorizado e distribuição de tarefas por membro."),
        h2("8.2 Situações de Liderança e Negociação"),
        p("Durante o desenvolvimento, duas situações de negociação foram relevantes:"),
        bullet("Priorização do quiz vs. dashboard: a equipe debateu a ordem de implementação. O argumento vencedor foi que o quiz gera os dados que o dashboard exibe, portanto a ordem natural é quiz primeiro. Decisão tomada por consenso."),
        bullet("Escolha entre sql.js e backend Node.js: o líder técnico argumentou que sql.js eliminava a necessidade de hospedagem de servidor, simplificando a entrega no prazo. A proposta foi aceita pela equipe com a ressalva de documentar a limitação para versões futuras."),
        h2("8.3 Proposta de Acessibilidade — LIBRAS"),
        p("A Língua Brasileira de Sinais (LIBRAS), regulamentada pela Lei nº 10.436/2002 e decreto nº 5.626/2005, é reconhecida como meio legal de comunicação da comunidade surda no Brasil. Sua incorporação em sistemas digitais é um passo importante para a inclusão digital."),
        p("A plataforma Tronus implementa a seguinte proposta de acessibilidade em LIBRAS:"),
        bullet("Botão flutuante \"👋 LIBRAS\" acessível em todas as telas da trilha (posição fixa, canto inferior direito)."),
        bullet("Glossário interativo com 10 termos essenciais de Tecnologia da Informação (Computador, Programação, Internet, Software, Hardware, Algoritmo, Variável, Função, Banco de Dados, Rede)."),
        bullet("Para cada termo: descrição textual do sinal correspondente em LIBRAS e link direto ao dicionário Spread The Sign (plataforma com vídeos de LIBRAS)."),
        emptyLine(),
        new Table({
          width: { size: 9026, type: WidthType.DXA },
          columnWidths: [2000, 4526, 2500],
          rows: [
            tableRow(["Termo", "Descrição do Sinal (LIBRAS)", "Referência"], true),
            tableRow(["Computador", "Mãos abertas no peito, dedos movendo como se digitasse.", "spreadthesign.com"]),
            tableRow(["Programação", "Indicador direito 'escreve' sobre a palma da mão esquerda.", "spreadthesign.com"]),
            tableRow(["Internet", "Dedos entrelaçados girando um ao redor do outro na frente do rosto.", "spreadthesign.com"]),
            tableRow(["Algoritmo", "Mão em 'A' move-se em etapas da esquerda para a direita.", "spreadthesign.com"]),
            tableRow(["Variável", "Mão em 'V' balança suavemente — indica algo que muda.", "spreadthesign.com"]),
          ],
        }),
        emptyLine(),
        p("Em versões futuras, a equipe propõe a incorporação de vídeos embutidos de LIBRAS no próprio enunciado das questões, com legenda em Português, tornando o conteúdo acessível também a estudantes surdos ou com deficiência auditiva."),

        // ══════════════════════════════════════════════════════════════
        // CONCLUSÃO
        // ══════════════════════════════════════════════════════════════
        pageBreak(),
        h1("9  CONCLUSÃO"),
        p("O presente trabalho demonstrou a viabilidade técnica e pedagógica da plataforma Tronus como solução gamificada de avaliação e apoio ao aprendizado para estudantes universitários de ADS. Ao longo do desenvolvimento, a equipe integrou conhecimentos de oito disciplinas distintas em um único produto funcional, coerente e documentado."),
        p("Do ponto de vista técnico, a escolha por tecnologias web puras (HTML5, CSS3, JavaScript) e banco de dados SQLite embarcado (sql.js) permitiu a entrega de uma aplicação sem dependência de servidores, com boa usabilidade e responsividade. O sistema de quiz com questões no estilo ENADE — com enunciados compostos por afirmativas I, II, III e IV — combinado ao painel de análise de desempenho, cumpre o objetivo central da plataforma: transformar a interação do estudante em dados acionáveis para o seu desenvolvimento."),
        p("O controle de acesso por papéis (RBAC) diferencia três perfis: aluno, professor e administrador. O painel do professor permite gerenciar questões por fase e acompanhar o desempenho individual dos alunos por busca nominal. O painel do administrador oferece visibilidade sobre as estatísticas gerais do sistema e o gerenciamento de usuários. Ambos os perfis especiais são pré-cadastrados automaticamente na inicialização do banco, com credenciais documentadas."),
        p("Os indicadores de análise implementados — taxa de acerto por fase e reino, gráfico de barras por reino e tabela detalhada — oferecem ao estudante uma visão clara de seus pontos fortes e das áreas que demandam revisão. A incorporação do glossário de LIBRAS representa um passo concreto em direção à acessibilidade digital, alinhada à legislação brasileira e aos princípios de inclusão. O double-check de logout e o redirecionamento inteligente por papel reforçam a qualidade da experiência do usuário."),
        p("Como trabalhos futuros, a equipe propõe: (i) implementação de backend com Node.js e banco de dados centralizado para suporte a múltiplos dispositivos e turmas; (ii) expansão do banco de questões para todos os reinos (C++, Engenharia de Software, Banco de Dados, Redes); (iii) módulo completo de administração de turmas, vínculos professor–turma e regras de XP configuráveis; (iv) desenvolvimento do módulo de Machine Learning para recomendação personalizada de conteúdo; e (v) incorporação de vídeos de LIBRAS nos enunciados das questões."),
        p("Conclui-se que o PIM III contribuiu significativamente para a formação prática da equipe, consolidando competências técnicas e colaborativas essenciais ao exercício profissional na área de Análise e Desenvolvimento de Sistemas."),

        // ══════════════════════════════════════════════════════════════
        // REFERÊNCIAS
        // ══════════════════════════════════════════════════════════════
        pageBreak(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 320 },
          children: [new TextRun({ text: "REFERÊNCIAS", bold: true, size: 24, font: "Arial" })],
        }),
        ...[
          "BRASIL. Lei nº 10.436, de 24 de abril de 2002. Dispõe sobre a Língua Brasileira de Sinais – LIBRAS. Brasília: Presidência da República, 2002.",
          "BRASIL. Lei nº 13.709, de 14 de agosto de 2018. Lei Geral de Proteção de Dados Pessoais (LGPD). Brasília: Presidência da República, 2018.",
          "INEP. Censo da Educação Superior 2022. Brasília: Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira, 2023.",
          "PRESSMAN, Roger S.; MAXIM, Bruce R. Engenharia de Software: uma abordagem profissional. 8. ed. Porto Alegre: McGraw-Hill, 2021.",
          "SILBERSCHATZ, Abraham; KORTH, Henry F.; SUDARSHAN, S. Sistema de Banco de Dados. 7. ed. Rio de Janeiro: Elsevier, 2020.",
          "SOMMERVILLE, Ian. Engenharia de Software. 10. ed. São Paulo: Pearson, 2019.",
          "SQL.JS. SQL.js — SQLite compiled to JavaScript. Disponível em: https://sql.js.org. Acesso em: maio 2026.",
          "SPREAD THE SIGN. Dicionário Internacional de Língua de Sinais. Disponível em: https://www.spreadthesign.com/pt.br/. Acesso em: maio 2026.",
          "W3SCHOOLS. HTML5, CSS3 e JavaScript Reference. Disponível em: https://www.w3schools.com. Acesso em: maio 2026.",
        ].map(ref =>
          new Paragraph({
            spacing: { after: 160 },
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 0, hanging: 0 },
            children: [new TextRun({ text: ref, size: 22, font: "Arial" })],
          })
        ),
      ],
    },
  ],
});

// Gera o arquivo
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("PIM_III_Tronus.docx", buffer);
  console.log("✅ PIM_III_Tronus.docx gerado com sucesso!");
}).catch(err => {
  console.error("Erro:", err.message);
  process.exit(1);
});
