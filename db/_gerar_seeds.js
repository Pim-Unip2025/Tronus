// Gera db/02_seeds.sql e db/02b_seed_usuarios.sql a partir do banco de
// questões que hoje vive dentro de js/database.js.
// Rodar: node db/_gerar_seeds.js

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const RAIZ = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(RAIZ, 'js/database.js'), 'utf8');

// --- extrai o array `banco` de seedQuestoes() -------------------------------
const i = src.indexOf('const banco = [');
const ini = src.indexOf('[', i);
let prof = 0, fim = ini;
for (; fim < src.length; fim++) {
  if (src[fim] === '[') prof++;
  else if (src[fim] === ']') { prof--; if (prof === 0) { fim++; break; } }
}
const banco = eval(src.slice(ini, fim));

const q = (s) => "'" + String(s).replace(/'/g, "''") + "'";

// --- reinos e fases ---------------------------------------------------------
const REINOS = [
  ['Python',                 'Linguagem de programação Python'],
  ['C++',                    'Linguagem de programação C++'],
  ['Engenharia de Software', 'Metodologias ágeis e boas práticas'],
  ['Banco de Dados',         'SQL, modelagem e consultas'],
  ['Redes',                  'Fundamentos de redes de computadores'],
];

let out = [];
out.push('-- ============================================================================');
out.push('-- TRONUS — 02_seeds.sql');
out.push('-- Carga inicial: Reinos, Fases e o banco de questões do Reino Python.');
out.push('--');
out.push('-- ARQUIVO GERADO por db/_gerar_seeds.js a partir de js/database.js.');
out.push('-- Não editar à mão: altere a fonte e gere de novo.');
out.push('--');
out.push('-- Idempotente: rodar duas vezes não duplica nada.');
out.push('-- ============================================================================');
out.push('');
out.push('BEGIN;');
out.push('');
out.push('-- ---------------------------------------------------------------- Reinos');
for (const [nome, desc] of REINOS) {
  out.push(`INSERT INTO reinos (nome, descricao) VALUES (${q(nome)}, ${q(desc)})`);
  out.push(`    ON CONFLICT (nome) DO NOTHING;`);
}
out.push('');
out.push('-- ----------------------------------------------------------------- Fases');
out.push('-- Três fases por Reino, numeradas pela coluna ordem.');
out.push('INSERT INTO fases (reino_id, nome, ordem)');
out.push("SELECT r.id, 'Fase ' || o.ordem, o.ordem");
out.push('  FROM reinos r');
out.push('  CROSS JOIN (VALUES (1::SMALLINT), (2), (3)) AS o(ordem)');
out.push('  ON CONFLICT (reino_id, ordem) DO NOTHING;');
out.push('');
out.push('-- -------------------------------------------------- Questões do Python');
out.push('-- 5 questões por fase, 5 alternativas (A a E), exatamente 1 correta.');
out.push('-- A verificação de duplicata usa o par (fase, enunciado).');
out.push('');

banco.forEach((questoes, idxFase) => {
  const ordem = idxFase + 1;
  out.push(`-- ---------- Fase ${ordem} ----------`);
  questoes.forEach((questao, idxQ) => {
    out.push(`-- Fase ${ordem}, questão ${idxQ + 1}`);
    out.push('WITH alvo AS (');
    out.push('    SELECT f.id AS fase_id');
    out.push('      FROM fases f JOIN reinos r ON r.id = f.reino_id');
    out.push(`     WHERE r.nome = 'Python' AND f.ordem = ${ordem}`);
    out.push('), nova AS (');
    out.push('    INSERT INTO questoes (fase_id, enunciado, nivel_dificuldade)');
    out.push(`    SELECT alvo.fase_id, ${q(questao.enunciado)}, ${q(questao.nivel)}`);
    out.push('      FROM alvo');
    out.push('     WHERE NOT EXISTS (');
    out.push('         SELECT 1 FROM questoes x');
    out.push(`          WHERE x.fase_id = alvo.fase_id AND x.enunciado = ${q(questao.enunciado)}`);
    out.push('     )');
    out.push('    RETURNING id');
    out.push(')');
    out.push('INSERT INTO alternativas (questao_id, letra, texto, correta)');
    const vals = questao.alts.map(a =>
      `    SELECT nova.id, ${q(a.letra)}, ${q(a.texto)}, ${a.correta === 1 ? 'TRUE' : 'FALSE'} FROM nova`
    );
    out.push(vals.join('\n    UNION ALL\n'));
    out.push(';');
    out.push('');
  });
});

out.push('COMMIT;');
out.push('');

fs.writeFileSync(path.join(RAIZ, 'db/02_seeds.sql'), out.join('\n'));

// --- usuários de teste ------------------------------------------------------
// O bcrypt usa salt aleatório: regerar produz um hash diferente a cada vez,
// mesmo sem nada ter mudado. Para o arquivo não aparecer modificado no git
// sem motivo, só regeramos os usuários quando pedido explicitamente:
//
//     node db/_gerar_seeds.js --usuarios
//
const ARQ_USUARIOS = path.join(RAIZ, 'db/02b_seed_usuarios.sql');
const forcarUsuarios = process.argv.includes('--usuarios');

if (fs.existsSync(ARQ_USUARIOS) && !forcarUsuarios) {
  console.log('02b_seed_usuarios.sql -> mantido (use --usuarios para regerar os hashes)');
} else {
  gerarUsuarios();
}

function gerarUsuarios() {
const SALT = 10;
const usuarios = [
  { nome: 'admin', email: 'admin@tronus.com', celular: '00000000000',
    senha: 'Tronus@adm1', papel: 'admin', reino: null },
  { nome: 'prof_python', email: 'prof.python@tronus.com', celular: '11111111111',
    senha: 'Python@prof1', papel: 'professor', reino: 'Python' },
];

let u = [];
u.push('-- ============================================================================');
u.push('-- TRONUS — 02b_seed_usuarios.sql');
u.push('-- Usuários de teste: administrador e professor do Reino Python.');
u.push('--');
u.push('-- ARQUIVO GERADO por db/_gerar_seeds.js.');
u.push('--');
u.push('-- As senhas estão gravadas como hash bcrypt (custo 10), nunca em texto');
u.push('-- puro. Os hashes abaixo correspondem às mesmas senhas documentadas no');
u.push('-- guia de onboarding, para que o time continue testando com elas.');
u.push('--');
u.push('-- IMPORTANTE: estes usuários existem para teste e demonstração. Antes de');
u.push('-- qualquer uso real, troque as senhas.');
u.push('-- ============================================================================');
u.push('');
u.push('BEGIN;');
u.push('');
for (const user of usuarios) {
  const hash = bcrypt.hashSync(user.senha, SALT);
  u.push(`-- ${user.nome} / senha: ${user.senha}`);
  u.push('INSERT INTO usuarios (nome, email, celular, senha_hash, papel, professor_reino_id)');
  if (user.reino) {
    u.push(`SELECT ${q(user.nome)}, ${q(user.email)}, ${q(user.celular)}, ${q(hash)}, ${q(user.papel)}, r.id`);
    u.push(`  FROM reinos r WHERE r.nome = ${q(user.reino)}`);
    u.push(`  ON CONFLICT (email) DO NOTHING;`);
  } else {
    u.push(`VALUES (${q(user.nome)}, ${q(user.email)}, ${q(user.celular)}, ${q(hash)}, ${q(user.papel)}, NULL)`);
    u.push(`  ON CONFLICT (email) DO NOTHING;`);
  }
  u.push('');
}
u.push('COMMIT;');
u.push('');

fs.writeFileSync(ARQ_USUARIOS, u.join('\n'));
console.log(`02b_seed_usuarios.sql -> ${usuarios.length} usuários com hash bcrypt`);
}

const totalQ = banco.reduce((a, f) => a + f.length, 0);
console.log(`02_seeds.sql        -> ${REINOS.length} reinos, ${REINOS.length * 3} fases, ${totalQ} questões`);
