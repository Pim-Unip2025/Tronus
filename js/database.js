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
    console.log("Banco carregado do localStorage.");
  } else {
    db = new SQL.Database();
    createTables();
    seedReinos();
    saveDatabase();
    console.log("Banco novo criado.");
  }
}

function saveDatabase() {
  const data = db.export();
  const base64 = btoa(String.fromCharCode(...data));
  localStorage.setItem(DB_KEY, base64);
}

function createTables() {

  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      celular TEXT NOT NULL,
      senha TEXT NOT NULL
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

  console.log("Tabelas criadas.");
}

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

// Aceita nome de usuário OU email no mesmo campo
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

// Busca usuário pelo celular para redefinição de senha
function buscarUsuarioPorCelular(celular) {
  const result = db.exec(
    `SELECT * FROM usuarios WHERE celular = ?`,
    [celular]
  );

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
      r.id as reino_id,
      r.nome as reino_nome,
      f.id as fase_id,
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
