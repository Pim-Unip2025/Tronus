-- ============================================================================
-- TRONUS — 03_procedures.sql
-- Rotinas em PL/pgSQL. Portadas da lógica de negócio que hoje vive em
-- js/database.js, onde roda no navegador.
--
-- Por que mover para o banco: com três clientes diferentes (web, mobile e
-- WinForms) consumindo a mesma API, a regra precisa existir em um lugar só.
-- Regra duplicada em três linguagens diverge na primeira alteração.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- fn_titulo_por_estrelas — fonte única dos limiares de progressão.
--
-- Origem: atualizarTitulo(), js/database.js linha 616.
-- Os limiares 15 / 30 / 45 ficam declarados AQUI e em nenhum outro lugar.
-- Rei = 45 porque é o máximo possível: 5 Reinos x 3 fases x 3 estrelas.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_titulo_por_estrelas(p_total INTEGER)
RETURNS VARCHAR(20)
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    IF p_total IS NULL OR p_total < 15 THEN
        RETURN 'Plebeu';
    ELSIF p_total < 30 THEN
        RETURN 'Cavaleiro';
    ELSIF p_total < 45 THEN
        RETURN 'Duque';
    ELSE
        RETURN 'Rei';
    END IF;
END;
$$;

COMMENT ON FUNCTION fn_titulo_por_estrelas IS
    'Converte total de estrelas em título. Limiares: 15 Cavaleiro, 30 Duque, 45 Rei (máximo: 15 fases x 3 estrelas).';


-- ----------------------------------------------------------------------------
-- sp_atualizar_titulo — recalcula total de estrelas e título do personagem.
--
-- Origem: atualizarTitulo(), js/database.js linha 616.
-- A trigger trg_progresso_atualiza_personagem já faz isso automaticamente.
-- Esta procedure existe para recálculo manual — correção de dados ou
-- manutenção — sem depender de alterar progresso_fases.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE sp_atualizar_titulo(p_personagem_id INTEGER)
LANGUAGE plpgsql
AS $$
DECLARE
    v_total INTEGER;
BEGIN
    SELECT COALESCE(SUM(estrelas), 0)
      INTO v_total
      FROM progresso_fases
     WHERE personagem_id = p_personagem_id;

    UPDATE personagens
       SET total_estrelas = v_total,
           titulo_atual   = fn_titulo_por_estrelas(v_total)
     WHERE id = p_personagem_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Personagem % não encontrado.', p_personagem_id;
    END IF;
END;
$$;


-- ----------------------------------------------------------------------------
-- sp_registrar_progresso — grava o resultado de uma fase.
--
-- Origem: atualizarProgresso(), js/database.js linha 606.
--
-- MUDANÇA DE COMPORTAMENTO — ler antes de usar:
-- O código atual faz "DO UPDATE SET estrelas = excluded.estrelas", ou seja,
-- SOBRESCREVE com a última nota. Na prática, um aluno que refaz uma fase e
-- vai pior PERDE as estrelas que já tinha, e pode até cair de título.
--
-- Esta procedure usa GREATEST: mantém a melhor nota já conquistada. Refazer
-- uma fase só pode melhorar o resultado, nunca piorar.
--
-- Se a equipe preferir o comportamento antigo, troque GREATEST(...) por
-- EXCLUDED.estrelas na linha indicada.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE sp_registrar_progresso(
    p_personagem_id INTEGER,
    p_fase_id       INTEGER,
    p_estrelas      SMALLINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_estrelas IS NULL OR p_estrelas NOT BETWEEN 0 AND 3 THEN
        RAISE EXCEPTION 'Estrelas devem estar entre 0 e 3 (recebido: %).', p_estrelas;
    END IF;

    INSERT INTO progresso_fases (personagem_id, fase_id, estrelas)
    VALUES (p_personagem_id, p_fase_id, p_estrelas)
    ON CONFLICT (personagem_id, fase_id) DO UPDATE
        SET estrelas      = GREATEST(progresso_fases.estrelas, EXCLUDED.estrelas),
            atualizado_em = now();
    -- A trigger em progresso_fases atualiza total_estrelas e titulo_atual.
END;
$$;


-- ----------------------------------------------------------------------------
-- fn_estatisticas_personagem — desempenho por fase, para o painel do aluno
-- e para a busca de desempenho do painel do professor.
--
-- Origem: buscarEstatisticas(), js/database.js linha 698.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_estatisticas_personagem(p_personagem_id INTEGER)
RETURNS TABLE (
    reino       VARCHAR(80),
    fase_id     INTEGER,
    fase        VARCHAR(60),
    tentativas  BIGINT,
    acertos     BIGINT,
    taxa_acerto NUMERIC(5,1),
    estrelas    SMALLINT
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        r.nome,
        f.id,
        f.nome,
        COUNT(ru.id)                                             AS tentativas,
        COUNT(*) FILTER (WHERE ru.acertou)                       AS acertos,
        COALESCE(
            ROUND(
                COUNT(*) FILTER (WHERE ru.acertou)::NUMERIC
                / NULLIF(COUNT(ru.id), 0) * 100
            , 1), 0
        )                                                        AS taxa_acerto,
        COALESCE(pf.estrelas, 0::SMALLINT)                       AS estrelas
    FROM reinos r
    JOIN fases f              ON f.reino_id = r.id
    LEFT JOIN respostas_usuario ru
           ON ru.fase_id = f.id
          AND ru.personagem_id = p_personagem_id
    LEFT JOIN progresso_fases pf
           ON pf.fase_id = f.id
          AND pf.personagem_id = p_personagem_id
    GROUP BY r.id, r.nome, f.id, f.nome, pf.estrelas
    ORDER BY r.id, f.ordem, f.id;
$$;

COMMENT ON FUNCTION fn_estatisticas_personagem IS
    'Taxa de acerto e estrelas por fase. Consumida pelo dashboard do aluno e pelo painel do professor.';


-- ----------------------------------------------------------------------------
-- fn_desempenho_aluno — o painel do professor consome exatamente a mesma
-- visão do dashboard do aluno. Mantido como nome próprio para que a API
-- tenha uma rota semântica, como já ocorria no JavaScript.
--
-- Origem: buscarDesempenhoAluno(), js/database.js linha 875.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_desempenho_aluno(p_personagem_id INTEGER)
RETURNS TABLE (
    reino       VARCHAR(80),
    fase_id     INTEGER,
    fase        VARCHAR(60),
    tentativas  BIGINT,
    acertos     BIGINT,
    taxa_acerto NUMERIC(5,1),
    estrelas    SMALLINT
)
LANGUAGE sql
STABLE
AS $$
    SELECT * FROM fn_estatisticas_personagem(p_personagem_id);
$$;


-- ----------------------------------------------------------------------------
-- fn_resumo_geral — números consolidados do topo do dashboard.
--
-- Origem: buscarResumoGeral(), js/database.js linha 728.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_resumo_geral(p_personagem_id INTEGER)
RETURNS TABLE (
    total_respostas BIGINT,
    total_acertos   BIGINT,
    taxa_geral      NUMERIC(5,1),
    total_estrelas  INTEGER,
    fases_iniciadas BIGINT,
    fases_completas BIGINT
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        (SELECT COUNT(*) FROM respostas_usuario
          WHERE personagem_id = p_personagem_id),
        (SELECT COUNT(*) FROM respostas_usuario
          WHERE personagem_id = p_personagem_id AND acertou),
        (SELECT COALESCE(
                    ROUND(COUNT(*) FILTER (WHERE acertou)::NUMERIC
                          / NULLIF(COUNT(*), 0) * 100, 1), 0)
           FROM respostas_usuario WHERE personagem_id = p_personagem_id),
        (SELECT COALESCE(SUM(estrelas), 0)::INTEGER FROM progresso_fases
          WHERE personagem_id = p_personagem_id),
        (SELECT COUNT(*) FROM progresso_fases
          WHERE personagem_id = p_personagem_id AND estrelas > 0),
        (SELECT COUNT(*) FROM progresso_fases
          WHERE personagem_id = p_personagem_id AND estrelas = 3);
$$;


-- ----------------------------------------------------------------------------
-- fn_buscar_alunos — busca de alunos por nome, no painel do professor.
--
-- Origem: buscarAlunosPorNome(), js/database.js linha 849.
-- ILIKE em vez de LIKE: a busca passa a ignorar maiúsculas e minúsculas,
-- que é o que o professor espera ao digitar um nome.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_buscar_alunos(p_nome TEXT)
RETURNS TABLE (
    usuario_id      INTEGER,
    usuario_nome    VARCHAR(60),
    personagem_id   INTEGER,
    personagem_nome VARCHAR(60),
    titulo_atual    VARCHAR(20),
    total_estrelas  INTEGER
)
LANGUAGE sql
STABLE
AS $$
    SELECT u.id, u.nome, p.id, p.nome,
           p.titulo_atual, COALESCE(p.total_estrelas, 0)
      FROM usuarios u
      LEFT JOIN personagens p ON p.usuario_id = u.id
     WHERE u.papel = 'aluno'
       AND u.nome ILIKE '%' || COALESCE(p_nome, '') || '%'
     ORDER BY u.nome;
$$;
