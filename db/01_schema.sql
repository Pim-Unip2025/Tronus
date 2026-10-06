-- ============================================================================
-- TRONUS — 01_schema.sql
-- Esquema físico em PostgreSQL. Portado de js/database.js (SQLite/sql.js).
--
-- Ordem de execução: 01_schema → 02_seeds → 03_procedures → 04_triggers
-- Idempotente: pode rodar novamente em base limpa sem erro.
-- ============================================================================

-- Derruba tudo antes de recriar. Em produção isso sairia; aqui é proposital,
-- porque o roteiro de validação exige recriar a base do zero.
DROP TABLE IF EXISTS respostas_usuario CASCADE;
DROP TABLE IF EXISTS alternativas     CASCADE;
DROP TABLE IF EXISTS questoes         CASCADE;
DROP TABLE IF EXISTS progresso_fases  CASCADE;
DROP TABLE IF EXISTS personagens      CASCADE;
DROP TABLE IF EXISTS fases            CASCADE;
DROP TABLE IF EXISTS usuarios         CASCADE;
DROP TABLE IF EXISTS reinos           CASCADE;

-- ----------------------------------------------------------------------------
-- reinos — cada disciplina do curso é um Reino
-- ----------------------------------------------------------------------------
CREATE TABLE reinos (
    id        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome      VARCHAR(80)  NOT NULL UNIQUE,
    descricao VARCHAR(255)
);

COMMENT ON TABLE reinos IS 'Disciplinas do curso representadas como Reinos a conquistar.';

-- ----------------------------------------------------------------------------
-- usuarios — contas de aluno, professor e administrador
--
-- Mudanças em relação ao SQLite:
--   senha TEXT  ->  senha_hash TEXT
--     No PIM III a senha era gravada em texto puro, limitação registrada na
--     documentação. O hash passa a ser gerado na API (bcrypt) e o banco nunca
--     vê a senha original.
--   professor_reino_id ganhou FOREIGN KEY, que não existia.
-- ----------------------------------------------------------------------------
CREATE TABLE usuarios (
    id                 INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome               VARCHAR(60)  NOT NULL UNIQUE,
    email              VARCHAR(120) NOT NULL UNIQUE,
    celular            VARCHAR(20)  NOT NULL,
    senha_hash         TEXT         NOT NULL,
    papel              VARCHAR(10)  NOT NULL DEFAULT 'aluno',
    professor_reino_id INTEGER,
    criado_em          TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT ck_usuarios_papel
        CHECK (papel IN ('aluno', 'professor', 'admin')),

    -- Professor precisa de Reino; aluno e admin não podem ter.
    CONSTRAINT ck_usuarios_reino_do_professor
        CHECK (
            (papel = 'professor' AND professor_reino_id IS NOT NULL)
            OR (papel <> 'professor' AND professor_reino_id IS NULL)
        ),

    CONSTRAINT fk_usuarios_reino
        FOREIGN KEY (professor_reino_id) REFERENCES reinos (id)
        ON DELETE RESTRICT
);

COMMENT ON COLUMN usuarios.senha_hash IS
    'Hash bcrypt gerado pela API. O banco nunca armazena a senha em texto puro.';

-- ----------------------------------------------------------------------------
-- personagens — avatar do aluno dentro da jornada
--
-- total_estrelas e titulo_atual são COLUNAS DERIVADAS: nunca devem ser
-- escritas pela aplicação. A trigger trg_progresso_atualiza_personagem
-- mantém as duas sincronizadas com progresso_fases.
-- ----------------------------------------------------------------------------
CREATE TABLE personagens (
    id             INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id     INTEGER     NOT NULL UNIQUE,
    nome           VARCHAR(60) NOT NULL,
    genero         VARCHAR(20) NOT NULL,
    avatar         VARCHAR(80) NOT NULL,
    titulo_atual   VARCHAR(20) NOT NULL DEFAULT 'Plebeu',
    total_estrelas INTEGER     NOT NULL DEFAULT 0,

    CONSTRAINT ck_personagens_titulo
        CHECK (titulo_atual IN ('Plebeu', 'Cavaleiro', 'Duque', 'Rei')),

    CONSTRAINT ck_personagens_estrelas
        CHECK (total_estrelas >= 0),

    -- Apagar o usuário apaga o personagem e, em cascata, o progresso dele.
    CONSTRAINT fk_personagens_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        ON DELETE CASCADE
);

COMMENT ON COLUMN personagens.total_estrelas IS
    'Coluna derivada, mantida por trigger. Não escrever pela aplicação.';

-- ----------------------------------------------------------------------------
-- fases — cada Reino tem três Fases
-- ----------------------------------------------------------------------------
CREATE TABLE fases (
    id       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    reino_id INTEGER     NOT NULL,
    nome     VARCHAR(60) NOT NULL,
    ordem    SMALLINT    NOT NULL DEFAULT 1,

    CONSTRAINT ck_fases_ordem CHECK (ordem BETWEEN 1 AND 3),

    CONSTRAINT uq_fases_reino_ordem UNIQUE (reino_id, ordem),

    CONSTRAINT fk_fases_reino
        FOREIGN KEY (reino_id) REFERENCES reinos (id)
        ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- progresso_fases — estrelas conquistadas por personagem em cada fase
-- ----------------------------------------------------------------------------
CREATE TABLE progresso_fases (
    id             INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    personagem_id  INTEGER     NOT NULL,
    fase_id        INTEGER     NOT NULL,
    estrelas       SMALLINT    NOT NULL DEFAULT 0,
    atualizado_em  TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT ck_progresso_estrelas
        CHECK (estrelas BETWEEN 0 AND 3),

    -- Um personagem tem no máximo um registro por fase.
    CONSTRAINT uq_progresso_personagem_fase
        UNIQUE (personagem_id, fase_id),

    CONSTRAINT fk_progresso_personagem
        FOREIGN KEY (personagem_id) REFERENCES personagens (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_progresso_fase
        FOREIGN KEY (fase_id) REFERENCES fases (id)
        ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- questoes — perguntas de cada fase
-- ----------------------------------------------------------------------------
CREATE TABLE questoes (
    id                INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fase_id           INTEGER     NOT NULL,
    enunciado         TEXT        NOT NULL,
    nivel_dificuldade VARCHAR(10) NOT NULL DEFAULT 'Médio',
    criada_em         TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT ck_questoes_nivel
        CHECK (nivel_dificuldade IN ('Fácil', 'Médio', 'Difícil')),

    CONSTRAINT fk_questoes_fase
        FOREIGN KEY (fase_id) REFERENCES fases (id)
        ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- alternativas — opções de A a E de cada questão
--
-- Mudança: correta INTEGER (0/1) -> BOOLEAN.
-- A regra "exatamente uma correta por questão" não cabe em CHECK, porque
-- envolve várias linhas. Ela é garantida pela trigger deferida
-- trg_valida_alternativa_correta, em 04_triggers.sql.
-- ----------------------------------------------------------------------------
CREATE TABLE alternativas (
    id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    questao_id INTEGER NOT NULL,
    letra      CHAR(1) NOT NULL,
    texto      TEXT    NOT NULL,
    correta    BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT ck_alternativas_letra
        CHECK (letra IN ('A', 'B', 'C', 'D', 'E')),

    CONSTRAINT uq_alternativas_questao_letra
        UNIQUE (questao_id, letra),

    CONSTRAINT fk_alternativas_questao
        FOREIGN KEY (questao_id) REFERENCES questoes (id)
        ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- respostas_usuario — histórico de respostas, base do painel de desempenho
--
-- Mudanças:
--   acertou INTEGER (0/1)  ->  BOOLEAN
--   data_resposta TEXT     ->  TIMESTAMPTZ
--     Guardar data como texto impede ordenação e filtro por período
--     sem conversão, e quebra qualquer relatório temporal.
--   fase_id ganhou FOREIGN KEY, que não existia no esquema original.
-- ----------------------------------------------------------------------------
CREATE TABLE respostas_usuario (
    id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    personagem_id INTEGER     NOT NULL,
    questao_id    INTEGER     NOT NULL,
    fase_id       INTEGER     NOT NULL,
    acertou       BOOLEAN     NOT NULL DEFAULT FALSE,
    data_resposta TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_respostas_personagem
        FOREIGN KEY (personagem_id) REFERENCES personagens (id)
        ON DELETE CASCADE,

    -- Apagar uma questão apaga o histórico de respostas dela. O professor
    -- exclui questões pelo painel, e manter resposta órfã corromperia a
    -- taxa de acerto.
    CONSTRAINT fk_respostas_questao
        FOREIGN KEY (questao_id) REFERENCES questoes (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_respostas_fase
        FOREIGN KEY (fase_id) REFERENCES fases (id)
        ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- Índices — as chaves estrangeiras mais consultadas pela aplicação.
-- PostgreSQL cria índice para PRIMARY KEY e UNIQUE, mas não para FOREIGN KEY.
-- ----------------------------------------------------------------------------
CREATE INDEX idx_fases_reino              ON fases (reino_id);
CREATE INDEX idx_progresso_personagem     ON progresso_fases (personagem_id);
CREATE INDEX idx_questoes_fase            ON questoes (fase_id);
CREATE INDEX idx_alternativas_questao     ON alternativas (questao_id);
CREATE INDEX idx_respostas_personagem     ON respostas_usuario (personagem_id);
CREATE INDEX idx_respostas_questao        ON respostas_usuario (questao_id);
CREATE INDEX idx_usuarios_papel           ON usuarios (papel);

-- ----------------------------------------------------------------------------
-- Segurança no Supabase — Row Level Security
--
-- O Supabase publica automaticamente uma API REST (PostgREST) sobre o schema
-- public, acessível com a chave anônima. Sem RLS, qualquer pessoa com essa
-- chave lê e escreve as tabelas direto, ignorando a nossa API.
--
-- Habilitamos RLS SEM criar policy nenhuma: isso nega todo acesso vindo da
-- API pública do Supabase. A nossa API NestJS conecta com o usuário dono do
-- banco, que não é afetado por RLS.
-- ----------------------------------------------------------------------------
ALTER TABLE reinos            ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios          ENABLE ROW LEVEL SECURITY;
ALTER TABLE personagens       ENABLE ROW LEVEL SECURITY;
ALTER TABLE fases             ENABLE ROW LEVEL SECURITY;
ALTER TABLE progresso_fases   ENABLE ROW LEVEL SECURITY;
ALTER TABLE questoes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE alternativas      ENABLE ROW LEVEL SECURITY;
ALTER TABLE respostas_usuario ENABLE ROW LEVEL SECURITY;
