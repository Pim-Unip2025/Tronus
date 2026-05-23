// ============================================================
// DATABASE.JS — Banco de dados SQLite (sql.js) para o TRONUS
// ============================================================

let db;
const DB_KEY = "tronusDB";

async function initDatabase() {
  const SQL = await initSqlJs({
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${file}`
  });

  const saved = localStorage.getItem(DB_KEY);

  if (saved) {
    const buffer = Uint8Array.from(atob(saved), c => c.charCodeAt(0));
    db = new SQL.Database(buffer);
    migrateDatabase();
    console.log("Banco carregado e migrado.");
  } else {
    db = new SQL.Database();
    createTables();
    seedReinos();
    seedQuestoes();
    seedUsuariosEspeciais();
    saveDatabase();
    console.log("Banco novo criado.");
  }
}

function saveDatabase() {
  const data = db.export();
  const base64 = btoa(String.fromCharCode(...data));
  localStorage.setItem(DB_KEY, base64);
}

// ============================================================
// CRIAÇÃO DE TABELAS
// ============================================================

function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      celular TEXT NOT NULL,
      senha TEXT NOT NULL,
      papel TEXT DEFAULT 'aluno',
      professor_reino_id INTEGER DEFAULT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS personagens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      genero TEXT NOT NULL,
      avatar TEXT NOT NULL,
      titulo_atual TEXT DEFAULT 'Plebeu',
      total_estrelas INTEGER DEFAULT 0,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reinos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS fases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reino_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      FOREIGN KEY (reino_id) REFERENCES reinos(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS progresso_fases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personagem_id INTEGER NOT NULL,
      fase_id INTEGER NOT NULL,
      estrelas INTEGER DEFAULT 0 CHECK(estrelas BETWEEN 0 AND 3),
      FOREIGN KEY (personagem_id) REFERENCES personagens(id),
      FOREIGN KEY (fase_id) REFERENCES fases(id),
      UNIQUE(personagem_id, fase_id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS questoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fase_id INTEGER NOT NULL,
      enunciado TEXT NOT NULL,
      nivel_dificuldade TEXT DEFAULT 'Médio',
      FOREIGN KEY (fase_id) REFERENCES fases(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS alternativas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questao_id INTEGER NOT NULL,
      letra TEXT NOT NULL,
      texto TEXT NOT NULL,
      correta INTEGER DEFAULT 0,
      FOREIGN KEY (questao_id) REFERENCES questoes(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS respostas_usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personagem_id INTEGER NOT NULL,
      questao_id INTEGER NOT NULL,
      fase_id INTEGER NOT NULL,
      acertou INTEGER DEFAULT 0,
      data_resposta TEXT NOT NULL,
      FOREIGN KEY (personagem_id) REFERENCES personagens(id),
      FOREIGN KEY (questao_id) REFERENCES questoes(id)
    );
  `);

  console.log("Tabelas criadas.");
}

// ============================================================
// MIGRAÇÃO (banco existente no localStorage)
// ============================================================

function migrateDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS questoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fase_id INTEGER NOT NULL,
      enunciado TEXT NOT NULL,
      nivel_dificuldade TEXT DEFAULT 'Médio',
      FOREIGN KEY (fase_id) REFERENCES fases(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS alternativas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questao_id INTEGER NOT NULL,
      letra TEXT NOT NULL,
      texto TEXT NOT NULL,
      correta INTEGER DEFAULT 0,
      FOREIGN KEY (questao_id) REFERENCES questoes(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS respostas_usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personagem_id INTEGER NOT NULL,
      questao_id INTEGER NOT NULL,
      fase_id INTEGER NOT NULL,
      acertou INTEGER DEFAULT 0,
      data_resposta TEXT NOT NULL,
      FOREIGN KEY (personagem_id) REFERENCES personagens(id),
      FOREIGN KEY (questao_id) REFERENCES questoes(id)
    );
  `);

  // Adiciona colunas se ainda não existirem (bancos criados antes das migrações)
  try { db.run(`ALTER TABLE usuarios ADD COLUMN papel TEXT DEFAULT 'aluno'`); } catch(e) {}
  try { db.run(`ALTER TABLE usuarios ADD COLUMN professor_reino_id INTEGER DEFAULT NULL`); } catch(e) {}
  try { db.run(`ALTER TABLE questoes  ADD COLUMN nivel_dificuldade TEXT DEFAULT 'Médio'`); } catch(e) {}

  const res = db.exec(`SELECT COUNT(*) FROM questoes`);
  const count = res[0]?.values[0][0] || 0;
  if (count === 0) {
    seedQuestoes();
  }

  seedUsuariosEspeciais();
  saveDatabase();
}

// ============================================================
// SEED DE REINOS E FASES
// ============================================================

function seedReinos() {
  const reinos = [
    { nome: "Python",                 descricao: "Linguagem de programação Python" },
    { nome: "C++",                    descricao: "Linguagem de programação C++" },
    { nome: "Engenharia de Software", descricao: "Metodologias ágeis e boas práticas" },
    { nome: "Banco de Dados",         descricao: "SQL, modelagem e consultas" },
    { nome: "Redes",                  descricao: "Fundamentos de redes de computadores" },
  ];

  reinos.forEach(reino => {
    db.run(`INSERT INTO reinos (nome, descricao) VALUES (?, ?)`, [reino.nome, reino.descricao]);
    const result = db.exec(`SELECT last_insert_rowid() as id`);
    const reinoId = result[0].values[0][0];
    for (let i = 1; i <= 3; i++) {
      db.run(`INSERT INTO fases (reino_id, nome) VALUES (?, ?)`, [reinoId, `Fase ${i}`]);
    }
  });

  console.log("Reinos e fases inseridos.");
}

// ============================================================
// SEED DE QUESTÕES — PYTHON · Estilo ENADE (5 por fase)
// ============================================================

function seedQuestoes() {
  const reinoRes = db.exec(`SELECT id FROM reinos WHERE nome = 'Python'`);
  if (!reinoRes.length) return;
  const reinoId = reinoRes[0].values[0][0];

  const fasesRes = db.exec(`SELECT id FROM fases WHERE reino_id = ? ORDER BY id`, [reinoId]);
  if (!fasesRes.length) return;
  const faseIds = fasesRes[0].values.map(v => v[0]);

  const banco = [

    // ════════════════════════════════════════════════════════
    // Fase 1 — Fundamentos: Variáveis, Tipos e Operadores
    // ════════════════════════════════════════════════════════
    [
      {
        enunciado:
          "Sobre tipos de dados em Python, considere:\n\n" +
          "I.   Em Python, o tipo de uma variável é inferido automaticamente (tipagem dinâmica).\n" +
          "II.  O tipo int em Python 3 tem tamanho fixo de 32 bits.\n" +
          "III. A função type() retorna o tipo de qualquer objeto.\n" +
          "IV.  Strings em Python são imutáveis.\n\n" +
          "Assinale a alternativa correta:",
        nivel: "Médio",
        alts: [
          { letra: "A", texto: "Apenas I e II estão corretas.", correta: 0 },
          { letra: "B", texto: "Apenas I, III e IV estão corretas.", correta: 1 },
          { letra: "C", texto: "Apenas II e III estão corretas.", correta: 0 },
          { letra: "D", texto: "Apenas III e IV estão corretas.", correta: 0 },
          { letra: "E", texto: "Todas as afirmativas estão corretas.", correta: 0 },
        ]
      },
      {
        enunciado:
          "Sobre operadores em Python, considere:\n\n" +
          "I.   O operador // realiza divisão inteira (floor division).\n" +
          "II.  O operador % retorna o quociente da divisão.\n" +
          "III. O operador ** realiza potenciação.\n" +
          "IV.  O operador + pode concatenar strings.\n\n" +
          "Assinale a alternativa correta:",
        nivel: "Médio",
        alts: [
          { letra: "A", texto: "Apenas I e II estão corretas.", correta: 0 },
          { letra: "B", texto: "Apenas I, III e IV estão corretas.", correta: 1 },
          { letra: "C", texto: "Apenas II e III estão corretas.", correta: 0 },
          { letra: "D", texto: "Todas as afirmativas estão corretas.", correta: 0 },
          { letra: "E", texto: "Apenas III e IV estão corretas.", correta: 0 },
        ]
      },
      {
        enunciado:
          "Sobre entrada e saída em Python, considere:\n\n" +
          "I.   A função print() pode receber múltiplos argumentos separados por vírgula.\n" +
          "II.  A função input() sempre retorna um valor do tipo string.\n" +
          "III. f-strings permitem embutir expressões em strings com a sintaxe f\"{variavel}\".\n" +
          "IV.  A função print() retorna o texto impresso como valor de retorno.\n\n" +
          "Assinale a alternativa correta:",
        nivel: "Fácil",
        alts: [
          { letra: "A", texto: "Apenas I e II estão corretas.", correta: 0 },
          { letra: "B", texto: "Apenas I, II e III estão corretas.", correta: 1 },
          { letra: "C", texto: "Apenas II e III estão corretas.", correta: 0 },
          { letra: "D", texto: "Apenas III e IV estão corretas.", correta: 0 },
          { letra: "E", texto: "Todas as afirmativas estão corretas.", correta: 0 },
        ]
      },
      {
        enunciado:
          "Sobre conversão de tipos em Python, considere:\n\n" +
          "I.   int(\"42\") converte a string \"42\" para o inteiro 42.\n" +
          "II.  str(3.14) converte o float 3.14 para a string \"3.14\".\n" +
          "III. float(\"abc\") é válido e retorna 0.0.\n" +
          "IV.  bool(0) retorna False em Python.\n\n" +
          "Assinale a alternativa correta:",
        nivel: "Médio",
        alts: [
          { letra: "A", texto: "Apenas I e II estão corretas.", correta: 0 },
          { letra: "B", texto: "Apenas I, II e IV estão corretas.", correta: 1 },
          { letra: "C", texto: "Apenas II e III estão corretas.", correta: 0 },
          { letra: "D", texto: "Apenas I e IV estão corretas.", correta: 0 },
          { letra: "E", texto: "Todas as afirmativas estão corretas.", correta: 0 },
        ]
      },
      {
        enunciado:
          "Sobre comentários e indentação em Python, considere:\n\n" +
          "I.   A indentação define os blocos de código, substituindo as chaves {}.\n" +
          "II.  Comentários de linha são feitos com o caractere #.\n" +
          "III. Python aceita misturar tabulações e espaços na mesma indentação sem erros.\n" +
          "IV.  Strings com aspas triplas (\"\"\" \"\"\") podem funcionar como comentários de múltiplas linhas.\n\n" +
          "Assinale a alternativa correta:",
        nivel: "Fácil",
        alts: [
          { letra: "A", texto: "Apenas I e II estão corretas.", correta: 0 },
          { letra: "B", texto: "Apenas I e III estão corretas.", correta: 0 },
          { letra: "C", texto: "Apenas I, II e IV estão corretas.", correta: 1 },
          { letra: "D", texto: "Todas as afirmativas estão corretas.", correta: 0 },
          { letra: "E", texto: "Apenas II e IV estão corretas.", correta: 0 },
        ]
      },
    ],

    // ════════════════════════════════════════════════════════
    // Fase 2 — Estruturas de Controle: if/else, for, while
    // ════════════════════════════════════════════════════════
    [
      {
        enunciado:
          "Sobre a estrutura if/elif/else em Python, considere:\n\n" +
          "I.   O comando elif é equivalente a else if em outras linguagens.\n" +
          "II.  É obrigatório ter um bloco else após o if em Python.\n" +
          "III. O operador ternário em Python tem a forma: valor_verdadeiro if condição else valor_falso.\n" +
          "IV.  É possível encadear múltiplos elif em um mesmo bloco if.\n\n" +
          "Assinale a alternativa correta:",
        nivel: "Médio",
        alts: [
          { letra: "A", texto: "Apenas I e II estão corretas.", correta: 0 },
          { letra: "B", texto: "Apenas II e III estão corretas.", correta: 0 },
          { letra: "C", texto: "Apenas I, III e IV estão corretas.", correta: 1 },
          { letra: "D", texto: "Todas as afirmativas estão corretas.", correta: 0 },
          { letra: "E", texto: "Apenas I e IV estão corretas.", correta: 0 },
        ]
      },
      {
        enunciado:
          "Sobre os laços for e while em Python, considere:\n\n" +
          "I.   O laço for percorre qualquer objeto iterável.\n" +
          "II.  A função range(1, 10, 2) gera os números 1, 3, 5, 7, 9.\n" +
          "III. O laço while é executado enquanto sua condição for verdadeira.\n" +
          "IV.  O laço for em Python não pode ter um bloco else.\n\n" +
          "Assinale a alternativa correta:",
        nivel: "Médio",
        alts: [
          { letra: "A", texto: "Apenas I e III estão corretas.", correta: 0 },
          { letra: "B", texto: "Apenas I, II e III estão corretas.", correta: 1 },
          { letra: "C", texto: "Apenas II e IV estão corretas.", correta: 0 },
          { letra: "D", texto: "Todas as afirmativas estão corretas.", correta: 0 },
          { letra: "E", texto: "Apenas III e IV estão corretas.", correta: 0 },
        ]
      },
      {
        enunciado:
          "Sobre os comandos break e continue em Python, considere:\n\n" +
          "I.   O comando break encerra o laço mais interno imediatamente.\n" +
          "II.  O comando continue pula para a próxima iteração do laço.\n" +
          "III. O bloco else de um laço for é executado somente se o laço terminar sem break.\n" +
          "IV.  O comando break pode ser usado fora de um laço sem gerar erro.\n\n" +
          "Assinale a alternativa correta:",
        nivel: "Difícil",
        alts: [
          { letra: "A", texto: "Apenas I e II estão corretas.", correta: 0 },
          { letra: "B", texto: "Apenas I, II e III estão corretas.", correta: 1 },
          { letra: "C", texto: "Apenas II e III estão corretas.", correta: 0 },
          { letra: "D", texto: "Todas as afirmativas estão corretas.", correta: 0 },
          { letra: "E", texto: "Apenas I e IV estão corretas.", correta: 0 },
        ]
      },
      {
        enunciado:
          "Sobre o comando match/case (Python 3.10+), considere:\n\n" +
          "I.   O comando match é equivalente ao switch de outras linguagens.\n" +
          "II.  O padrão case _ funciona como um caso padrão (default).\n" +
          "III. O match só aceita valores inteiros como expressão de controle.\n" +
          "IV.  É possível usar guardas (if) dentro dos casos do match.\n\n" +
          "Assinale a alternativa correta:",
        nivel: "Difícil",
        alts: [
          { letra: "A", texto: "Apenas I e II estão corretas.", correta: 0 },
          { letra: "B", texto: "Apenas I, II e IV estão corretas.", correta: 1 },
          { letra: "C", texto: "Apenas I e III estão corretas.", correta: 0 },
          { letra: "D", texto: "Todas as afirmativas estão corretas.", correta: 0 },
          { letra: "E", texto: "Apenas II e III estão corretas.", correta: 0 },
        ]
      },
      {
        enunciado:
          "Sobre funções de iteração embutidas em Python, considere:\n\n" +
          "I.   enumerate() retorna pares (índice, valor) ao iterar sobre uma sequência.\n" +
          "II.  zip() combina dois ou mais iteráveis em pares de tuplas.\n" +
          "III. map() retorna diretamente uma lista com os resultados.\n" +
          "IV.  filter() retorna apenas os elementos para os quais a função fornecida retorna True.\n\n" +
          "Assinale a alternativa correta:",
        nivel: "Médio",
        alts: [
          { letra: "A", texto: "Apenas I e II estão corretas.", correta: 0 },
          { letra: "B", texto: "Apenas I, II e IV estão corretas.", correta: 1 },
          { letra: "C", texto: "Apenas II e III estão corretas.", correta: 0 },
          { letra: "D", texto: "Todas as afirmativas estão corretas.", correta: 0 },
          { letra: "E", texto: "Apenas III e IV estão corretas.", correta: 0 },
        ]
      },
    ],

    // ════════════════════════════════════════════════════════
    // Fase 3 — Funções, Listas, POO e Exceções
    // ════════════════════════════════════════════════════════
    [
      {
        enunciado:
          "Sobre definição de funções em Python, considere:\n\n" +
          "I.   Funções são definidas com a palavra-chave def.\n" +
          "II.  Uma função pode retornar múltiplos valores separados por vírgula (como tupla).\n" +
          "III. Parâmetros com valor padrão devem sempre vir antes dos sem valor padrão.\n" +
          "IV.  O uso de *args permite receber um número variável de argumentos posicionais.\n\n" +
          "Assinale a alternativa correta:",
        nivel: "Médio",
        alts: [
          { letra: "A", texto: "Apenas I e II estão corretas.", correta: 0 },
          { letra: "B", texto: "Apenas I, II e IV estão corretas.", correta: 1 },
          { letra: "C", texto: "Apenas II e III estão corretas.", correta: 0 },
          { letra: "D", texto: "Todas as afirmativas estão corretas.", correta: 0 },
          { letra: "E", texto: "Apenas I e IV estão corretas.", correta: 0 },
        ]
      },
      {
        enunciado:
          "Sobre listas e seus métodos em Python, considere:\n\n" +
          "I.   O método append() adiciona um elemento ao final da lista.\n" +
          "II.  O método sort() retorna uma nova lista ordenada sem modificar a original.\n" +
          "III. O método pop() remove e retorna o último elemento da lista por padrão.\n" +
          "IV.  O método extend() adiciona todos os elementos de um iterável ao final da lista.\n\n" +
          "Assinale a alternativa correta:",
        nivel: "Médio",
        alts: [
          { letra: "A", texto: "Apenas I e II estão corretas.", correta: 0 },
          { letra: "B", texto: "Apenas I, III e IV estão corretas.", correta: 1 },
          { letra: "C", texto: "Apenas II e III estão corretas.", correta: 0 },
          { letra: "D", texto: "Todas as afirmativas estão corretas.", correta: 0 },
          { letra: "E", texto: "Apenas I e IV estão corretas.", correta: 0 },
        ]
      },
      {
        enunciado:
          "Sobre herança e POO em Python, considere:\n\n" +
          "I.   Uma classe herda de outra usando a sintaxe: class Filha(Mae):.\n" +
          "II.  Python não permite herança múltipla de classes.\n" +
          "III. O método __init__ é o construtor da classe em Python.\n" +
          "IV.  A função super() permite chamar métodos da classe pai.\n\n" +
          "Assinale a alternativa correta:",
        nivel: "Médio",
        alts: [
          { letra: "A", texto: "Apenas I e III estão corretas.", correta: 0 },
          { letra: "B", texto: "Apenas I, III e IV estão corretas.", correta: 1 },
          { letra: "C", texto: "Apenas II e III estão corretas.", correta: 0 },
          { letra: "D", texto: "Todas as afirmativas estão corretas.", correta: 0 },
          { letra: "E", texto: "Apenas I e II estão corretas.", correta: 0 },
        ]
      },
      {
        enunciado:
          "Sobre tratamento de exceções em Python, considere:\n\n" +
          "I.   O bloco finally é sempre executado, independentemente de ocorrer exceção.\n" +
          "II.  Exceções personalizadas devem herdar da classe Exception.\n" +
          "III. O bloco except pode capturar tipos específicos de exceção.\n" +
          "IV.  Um bloco try pode ter apenas um bloco except.\n\n" +
          "Assinale a alternativa correta:",
        nivel: "Difícil",
        alts: [
          { letra: "A", texto: "Apenas I e II estão corretas.", correta: 0 },
          { letra: "B", texto: "Apenas I, II e III estão corretas.", correta: 1 },
          { letra: "C", texto: "Apenas II e III estão corretas.", correta: 0 },
          { letra: "D", texto: "Todas as afirmativas estão corretas.", correta: 0 },
          { letra: "E", texto: "Apenas III e IV estão corretas.", correta: 0 },
        ]
      },
      {
        enunciado:
          "Sobre módulos e gerenciamento de pacotes em Python, considere:\n\n" +
          "I.   O comando import permite usar módulos externos em Python.\n" +
          "II.  A instrução from math import sqrt importa apenas a função sqrt do módulo math.\n" +
          "III. Módulos criados pelo próprio programador não podem ser importados.\n" +
          "IV.  O comando pip é usado para instalar pacotes externos do PyPI.\n\n" +
          "Assinale a alternativa correta:",
        nivel: "Fácil",
        alts: [
          { letra: "A", texto: "Apenas I e II estão corretas.", correta: 0 },
          { letra: "B", texto: "Apenas I, II e IV estão corretas.", correta: 1 },
          { letra: "C", texto: "Apenas II e III estão corretas.", correta: 0 },
          { letra: "D", texto: "Todas as afirmativas estão corretas.", correta: 0 },
          { letra: "E", texto: "Apenas I e IV estão corretas.", correta: 0 },
        ]
      },
    ],
  ];

  banco.forEach((questoesFase, idx) => {
    const faseId = faseIds[idx];
    if (!faseId) return;

    questoesFase.forEach(q => {
      db.run(
        `INSERT INTO questoes (fase_id, enunciado, nivel_dificuldade) VALUES (?, ?, ?)`,
        [faseId, q.enunciado, q.nivel]
      );
      const qRes = db.exec(`SELECT last_insert_rowid() as id`);
      const questaoId = qRes[0].values[0][0];

      q.alts.forEach(alt => {
        db.run(
          `INSERT INTO alternativas (questao_id, letra, texto, correta) VALUES (?, ?, ?, ?)`,
          [questaoId, alt.letra, alt.texto, alt.correta]
        );
      });
    });
  });

  console.log("Questões de Python inseridas.");
}

// ============================================================
// FUNÇÕES DE USUÁRIO
// ============================================================

function cadastrarUsuario(nome, email, celular, senha) {
  try {
    db.run(
      `INSERT INTO usuarios (nome, email, celular, senha) VALUES (?, ?, ?, ?)`,
      [nome, email, celular, senha]
    );
    saveDatabase();
    return { sucesso: true };
  } catch (e) {
    if (e.message.includes("nome")) return { sucesso: false, erro: "Nome de usuário já cadastrado." };
    if (e.message.includes("email")) return { sucesso: false, erro: "Email já cadastrado." };
    return { sucesso: false, erro: "Erro ao cadastrar." };
  }
}

function loginUsuario(identificador, senha) {
  const result = db.exec(
    `SELECT * FROM usuarios WHERE (nome = ? OR email = ?) AND senha = ?`,
    [identificador, identificador, senha]
  );
  if (result.length === 0 || result[0].values.length === 0) return null;
  const cols = result[0].columns;
  const vals = result[0].values[0];
  const usuario = {};
  cols.forEach((col, i) => usuario[col] = vals[i]);
  return usuario;
}

function buscarUsuarioPorCelular(celular) {
  const result = db.exec(`SELECT * FROM usuarios WHERE celular = ?`, [celular]);
  if (result.length === 0 || result[0].values.length === 0) return null;
  const cols = result[0].columns;
  const vals = result[0].values[0];
  const usuario = {};
  cols.forEach((col, i) => usuario[col] = vals[i]);
  return usuario;
}

function redefinirSenha(usuarioId, novaSenha) {
  db.run(`UPDATE usuarios SET senha = ? WHERE id = ?`, [novaSenha, usuarioId]);
  saveDatabase();
}

// ============================================================
// FUNÇÕES DE PERSONAGEM
// ============================================================

function salvarPersonagem(usuarioId, nome, genero, avatar) {
  db.run(
    `INSERT INTO personagens (usuario_id, nome, genero, avatar) VALUES (?, ?, ?, ?)`,
    [usuarioId, nome, genero, avatar]
  );
  saveDatabase();
}

function buscarPersonagem(usuarioId) {
  const result = db.exec(`SELECT * FROM personagens WHERE usuario_id = ?`, [usuarioId]);
  if (result.length === 0 || result[0].values.length === 0) return null;
  const cols = result[0].columns;
  const vals = result[0].values[0];
  const personagem = {};
  cols.forEach((col, i) => personagem[col] = vals[i]);
  return personagem;
}

// ============================================================
// FUNÇÕES DE PROGRESSO
// ============================================================

function atualizarProgresso(personagemId, faseId, estrelas) {
  db.run(`
    INSERT INTO progresso_fases (personagem_id, fase_id, estrelas)
    VALUES (?, ?, ?)
    ON CONFLICT(personagem_id, fase_id) DO UPDATE SET estrelas = excluded.estrelas
  `, [personagemId, faseId, estrelas]);
  atualizarTitulo(personagemId);
  saveDatabase();
}

function atualizarTitulo(personagemId) {
  const result = db.exec(
    `SELECT SUM(estrelas) as total FROM progresso_fases WHERE personagem_id = ?`,
    [personagemId]
  );
  const total = result[0].values[0][0] || 0;
  let titulo = "Plebeu";
  if (total >= 50) titulo = "Rei";
  else if (total >= 30) titulo = "Duque";
  else if (total >= 15) titulo = "Cavaleiro";
  db.run(
    `UPDATE personagens SET titulo_atual = ?, total_estrelas = ? WHERE id = ?`,
    [titulo, total, personagemId]
  );
}

function buscarProgresso(personagemId) {
  const result = db.exec(`
    SELECT
      r.id   as reino_id,
      r.nome as reino_nome,
      f.id   as fase_id,
      f.nome as fase_nome,
      COALESCE(p.estrelas, 0) as estrelas
    FROM reinos r
    JOIN fases f ON f.reino_id = r.id
    LEFT JOIN progresso_fases p
      ON p.fase_id = f.id AND p.personagem_id = ?
    ORDER BY r.id, f.id
  `, [personagemId]);
  if (result.length === 0) return [];
  const cols = result[0].columns;
  return result[0].values.map(vals => {
    const row = {};
    cols.forEach((col, i) => row[col] = vals[i]);
    return row;
  });
}

// ============================================================
// FUNÇÕES DE QUIZ
// ============================================================

function buscarQuestoesPorFase(faseId) {
  const result = db.exec(`
    SELECT q.id, q.enunciado, q.nivel_dificuldade,
           a.id as alt_id, a.letra, a.texto, a.correta
    FROM questoes q
    JOIN alternativas a ON a.questao_id = q.id
    WHERE q.fase_id = ?
    ORDER BY q.id, a.id
  `, [faseId]);

  if (!result.length || !result[0].values.length) return [];

  const questoesMap = {};
  result[0].values.forEach(row => {
    const qId = row[0];
    if (!questoesMap[qId]) {
      questoesMap[qId] = { id: qId, enunciado: row[1], nivel: row[2], alternativas: [] };
    }
    questoesMap[qId].alternativas.push({
      id: row[3], letra: row[4], texto: row[5], correta: row[6] === 1
    });
  });

  return Object.values(questoesMap);
}

function registrarResposta(personagemId, questaoId, faseId, acertou) {
  const hoje = new Date().toISOString().split("T")[0];
  db.run(`
    INSERT INTO respostas_usuario (personagem_id, questao_id, fase_id, acertou, data_resposta)
    VALUES (?, ?, ?, ?, ?)
  `, [personagemId, questaoId, faseId, acertou ? 1 : 0, hoje]);
  saveDatabase();
}

// ============================================================
// FUNÇÕES DE ANÁLISE DE DADOS (dashboard)
// ============================================================

function buscarEstatisticas(personagemId) {
  const result = db.exec(`
    SELECT
      r.nome                              AS reino,
      f.id                                AS fase_id,
      f.nome                              AS fase,
      COUNT(ru.id)                        AS tentativas,
      COALESCE(SUM(ru.acertou), 0)        AS acertos,
      COALESCE(ROUND(AVG(ru.acertou) * 100, 1), 0) AS taxa_acerto,
      COALESCE(pf.estrelas, 0)            AS estrelas
    FROM reinos r
    JOIN fases f ON f.reino_id = r.id
    LEFT JOIN questoes q ON q.fase_id = f.id
    LEFT JOIN respostas_usuario ru
      ON ru.questao_id = q.id AND ru.personagem_id = ?
    LEFT JOIN progresso_fases pf
      ON pf.fase_id = f.id AND pf.personagem_id = ?
    GROUP BY r.id, f.id
    ORDER BY r.id, f.id
  `, [personagemId, personagemId]);

  if (!result.length) return [];
  const cols = result[0].columns;
  return result[0].values.map(vals => {
    const row = {};
    cols.forEach((col, i) => row[col] = vals[i]);
    return row;
  });
}

function buscarResumoGeral(personagemId) {
  const res = db.exec(`
    SELECT
      COUNT(ru.id)                        AS total_respostas,
      COALESCE(SUM(ru.acertou), 0)        AS total_acertos,
      COALESCE(ROUND(AVG(ru.acertou) * 100, 1), 0) AS taxa_geral,
      (SELECT SUM(estrelas) FROM progresso_fases WHERE personagem_id = ?) AS total_estrelas,
      (SELECT COUNT(*) FROM progresso_fases WHERE personagem_id = ? AND estrelas > 0) AS fases_iniciadas,
      (SELECT COUNT(*) FROM progresso_fases WHERE personagem_id = ? AND estrelas = 3) AS fases_completas
    FROM respostas_usuario ru
    WHERE ru.personagem_id = ?
  `, [personagemId, personagemId, personagemId, personagemId]);

  if (!res.length || !res[0].values.length) {
    return { total_respostas: 0, total_acertos: 0, taxa_geral: 0,
             total_estrelas: 0, fases_iniciadas: 0, fases_completas: 0 };
  }
  const cols = res[0].columns;
  const row = {};
  cols.forEach((col, i) => row[col] = res[0].values[0][i]);
  return row;
}

// ============================================================
// SEED DE USUÁRIOS ESPECIAIS (Admin e Professor Python)
// ============================================================

function seedUsuariosEspeciais() {
  // Administrador
  const adminExiste = db.exec(`SELECT id FROM usuarios WHERE email = 'admin@tronus.com'`);
  if (!adminExiste.length || !adminExiste[0].values.length) {
    db.run(
      `INSERT INTO usuarios (nome, email, celular, senha, papel) VALUES (?, ?, ?, ?, ?)`,
      ['admin', 'admin@tronus.com', '00000000000', 'Tronus@adm1', 'admin']
    );
    console.log("Usuário admin criado.");
  }

  // Professor de Python
  const profExiste = db.exec(`SELECT id FROM usuarios WHERE email = 'prof.python@tronus.com'`);
  if (!profExiste.length || !profExiste[0].values.length) {
    const reinoRes = db.exec(`SELECT id FROM reinos WHERE nome = 'Python'`);
    const reinoId = (reinoRes.length && reinoRes[0].values.length) ? reinoRes[0].values[0][0] : null;
    db.run(
      `INSERT INTO usuarios (nome, email, celular, senha, papel, professor_reino_id) VALUES (?, ?, ?, ?, ?, ?)`,
      ['prof_python', 'prof.python@tronus.com', '11111111111', 'Python@prof1', 'professor', reinoId]
    );
    console.log("Usuário professor Python criado.");
  }
}

// ============================================================
// FUNÇÕES DO PAINEL DO PROFESSOR
// ============================================================

/**
 * Cria uma nova questão com suas alternativas em uma fase.
 * @param {number} faseId
 * @param {string} enunciado
 * @param {string} nivel  'Fácil' | 'Médio' | 'Difícil'
 * @param {Array}  alts   [{letra, texto, correta}]
 * @returns {number} id da questão criada
 */
function criarQuestao(faseId, enunciado, nivel, alts) {
  db.run(
    `INSERT INTO questoes (fase_id, enunciado, nivel_dificuldade) VALUES (?, ?, ?)`,
    [faseId, enunciado, nivel]
  );
  const qRes = db.exec(`SELECT last_insert_rowid() as id`);
  const questaoId = qRes[0].values[0][0];
  alts.forEach(alt => {
    db.run(
      `INSERT INTO alternativas (questao_id, letra, texto, correta) VALUES (?, ?, ?, ?)`,
      [questaoId, alt.letra, alt.texto, alt.correta ? 1 : 0]
    );
  });
  saveDatabase();
  return questaoId;
}

/**
 * Remove uma questão e todos os seus dados relacionados.
 * @param {number} questaoId
 */
function excluirQuestao(questaoId) {
  db.run(`DELETE FROM respostas_usuario WHERE questao_id = ?`, [questaoId]);
  db.run(`DELETE FROM alternativas       WHERE questao_id = ?`, [questaoId]);
  db.run(`DELETE FROM questoes           WHERE id = ?`,         [questaoId]);
  saveDatabase();
}

/**
 * Busca lista de questões (só cabeçalho, sem alternativas) de uma fase.
 * @param {number} faseId
 * @returns {Array} [{id, enunciado, nivel_dificuldade, total_alts}]
 */
function listarQuestoesDaFase(faseId) {
  const result = db.exec(`
    SELECT q.id, q.enunciado, q.nivel_dificuldade,
           COUNT(a.id) AS total_alts
    FROM questoes q
    LEFT JOIN alternativas a ON a.questao_id = q.id
    WHERE q.fase_id = ?
    GROUP BY q.id
    ORDER BY q.id
  `, [faseId]);
  if (!result.length) return [];
  const cols = result[0].columns;
  return result[0].values.map(vals => {
    const row = {};
    cols.forEach((c, i) => row[c] = vals[i]);
    return row;
  });
}

/**
 * Busca alunos pelo nome de usuário (busca parcial).
 * Retorna dados do usuário + personagem + resumo de desempenho.
 * @param {string} nome
 * @returns {Array}
 */
function buscarAlunosPorNome(nome) {
  const result = db.exec(`
    SELECT u.id  AS uid,
           u.nome AS usuario_nome,
           p.id   AS pid,
           p.nome AS personagem_nome,
           p.titulo_atual,
           COALESCE(p.total_estrelas, 0) AS total_estrelas
    FROM usuarios u
    LEFT JOIN personagens p ON p.usuario_id = u.id
    WHERE u.papel = 'aluno' AND u.nome LIKE ?
    ORDER BY u.nome
  `, [`%${nome}%`]);
  if (!result.length) return [];
  const cols = result[0].columns;
  return result[0].values.map(vals => {
    const row = {};
    cols.forEach((c, i) => row[c] = vals[i]);
    return row;
  });
}

/**
 * Retorna o resumo de desempenho por fase de um personagem
 * (reutiliza buscarEstatisticas, que já existe).
 */
function buscarDesempenhoAluno(personagemId) {
  return buscarEstatisticas(personagemId);
}

/**
 * Retorna todas as fases de um reino específico.
 * @param {number} reinoId
 * @returns {Array} [{id, nome}]
 */
function buscarFasesPorReino(reinoId) {
  const result = db.exec(
    `SELECT id, nome FROM fases WHERE reino_id = ? ORDER BY id`,
    [reinoId]
  );
  if (!result.length) return [];
  const cols = result[0].columns;
  return result[0].values.map(vals => {
    const row = {};
    cols.forEach((c, i) => row[c] = vals[i]);
    return row;
  });
}
