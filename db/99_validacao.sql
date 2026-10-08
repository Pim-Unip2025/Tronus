-- ============================================================================
-- TRONUS — 99_validacao.sql
-- Roteiro de validação do banco. Roda depois dos quatro scripts e verifica
-- que o esquema, as procedures e as triggers fazem o que prometem.
--
-- Cada bloco levanta exceção se a verificação falhar, então o script só
-- chega ao fim se estiver tudo certo. Não deixa resíduo: o usuário de teste
-- é removido no final.
--
-- Uso:  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/99_validacao.sql
-- ============================================================================

\set ON_ERROR_STOP on

DO $$
DECLARE
    v_reinos    INTEGER;
    v_fases     INTEGER;
    v_questoes  INTEGER;
    v_alts      INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_reinos   FROM reinos;
    SELECT COUNT(*) INTO v_fases    FROM fases;
    SELECT COUNT(*) INTO v_questoes FROM questoes;
    SELECT COUNT(*) INTO v_alts     FROM alternativas;

    IF v_reinos <> 5  THEN RAISE EXCEPTION 'Esperados 5 reinos, achei %',   v_reinos;  END IF;
    IF v_fases  <> 15 THEN RAISE EXCEPTION 'Esperadas 15 fases, achei %',   v_fases;   END IF;
    IF v_questoes <> 15 THEN RAISE EXCEPTION 'Esperadas 15 questões, achei %', v_questoes; END IF;
    IF v_alts   <> 75 THEN RAISE EXCEPTION 'Esperadas 75 alternativas, achei %', v_alts; END IF;

    RAISE NOTICE '[1/7] Carga inicial OK — % reinos, % fases, % questões, % alternativas',
        v_reinos, v_fases, v_questoes, v_alts;
END $$;


-- ----------------------------------------------------------------------------
-- 2. Toda questão tem exatamente uma alternativa correta
-- ----------------------------------------------------------------------------
DO $$
DECLARE v_ruins INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_ruins FROM (
        SELECT questao_id
          FROM alternativas
         GROUP BY questao_id
        HAVING COUNT(*) FILTER (WHERE correta) <> 1
    ) x;

    IF v_ruins > 0 THEN
        RAISE EXCEPTION '% questões com número errado de alternativas corretas', v_ruins;
    END IF;
    RAISE NOTICE '[2/7] Integridade das alternativas OK';
END $$;


-- ----------------------------------------------------------------------------
-- 3. Criar aluno e personagem
-- ----------------------------------------------------------------------------
DO $$
DECLARE v_uid INTEGER; v_pid INTEGER; v_titulo VARCHAR(20);
BEGIN
    INSERT INTO usuarios (nome, email, celular, senha_hash, papel)
    VALUES ('teste_validacao', 'teste.validacao@tronus.com', '99999999999',
            '$2a$10$abcdefghijklmnopqrstuv', 'aluno')
    RETURNING id INTO v_uid;

    INSERT INTO personagens (usuario_id, nome, genero, avatar)
    VALUES (v_uid, 'Validador', 'masculino', 'masc1.png')
    RETURNING id INTO v_pid;

    SELECT titulo_atual INTO v_titulo FROM personagens WHERE id = v_pid;
    IF v_titulo <> 'Plebeu' THEN
        RAISE EXCEPTION 'Personagem novo deveria nascer Plebeu, veio %', v_titulo;
    END IF;
    RAISE NOTICE '[3/7] Aluno e personagem criados — título inicial Plebeu';
END $$;


-- ----------------------------------------------------------------------------
-- 4. Trigger de progresso: 5 fases com 3 estrelas = 15 = Cavaleiro,
--    SEM nenhuma chamada da aplicação para recalcular.
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    v_pid    INTEGER;
    v_fase   RECORD;
    v_total  INTEGER;
    v_titulo VARCHAR(20);
BEGIN
    SELECT p.id INTO v_pid FROM personagens p
      JOIN usuarios u ON u.id = p.usuario_id
     WHERE u.nome = 'teste_validacao';

    FOR v_fase IN
        SELECT f.id FROM fases f JOIN reinos r ON r.id = f.reino_id
         ORDER BY r.id, f.ordem LIMIT 5
    LOOP
        CALL sp_registrar_progresso(v_pid, v_fase.id, 3::SMALLINT);
    END LOOP;

    SELECT total_estrelas, titulo_atual INTO v_total, v_titulo
      FROM personagens WHERE id = v_pid;

    IF v_total <> 15 THEN
        RAISE EXCEPTION 'Esperadas 15 estrelas, achei %', v_total;
    END IF;
    IF v_titulo <> 'Cavaleiro' THEN
        RAISE EXCEPTION 'Com 15 estrelas o título deveria ser Cavaleiro, veio %', v_titulo;
    END IF;
    RAISE NOTICE '[4/7] Trigger de progresso OK — 15 estrelas, título Cavaleiro automático';
END $$;


-- ----------------------------------------------------------------------------
-- 5. Refazer uma fase com nota pior NÃO reduz as estrelas
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    v_pid   INTEGER;
    v_fase  INTEGER;
    v_antes SMALLINT;
    v_depois SMALLINT;
    v_total INTEGER;
BEGIN
    SELECT p.id INTO v_pid FROM personagens p
      JOIN usuarios u ON u.id = p.usuario_id
     WHERE u.nome = 'teste_validacao';

    SELECT fase_id, estrelas INTO v_fase, v_antes
      FROM progresso_fases WHERE personagem_id = v_pid ORDER BY fase_id LIMIT 1;

    CALL sp_registrar_progresso(v_pid, v_fase, 1::SMALLINT);

    SELECT estrelas INTO v_depois
      FROM progresso_fases WHERE personagem_id = v_pid AND fase_id = v_fase;
    SELECT total_estrelas INTO v_total FROM personagens WHERE id = v_pid;

    IF v_depois <> v_antes THEN
        RAISE EXCEPTION 'Refazer pior reduziu as estrelas de % para %', v_antes, v_depois;
    END IF;
    IF v_total <> 15 THEN
        RAISE EXCEPTION 'Total deveria continuar 15, veio %', v_total;
    END IF;
    RAISE NOTICE '[5/7] Melhor nota preservada OK — refazer pior não rebaixa o aluno';
END $$;


-- ----------------------------------------------------------------------------
-- 6. Trigger de validação: questão com DUAS alternativas corretas é recusada
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    v_fase INTEGER;
    v_qid  INTEGER;
    v_erro BOOLEAN := FALSE;
BEGIN
    SELECT f.id INTO v_fase FROM fases f JOIN reinos r ON r.id = f.reino_id
     WHERE r.nome = 'Python' AND f.ordem = 1;

    BEGIN
        INSERT INTO questoes (fase_id, enunciado, nivel_dificuldade)
        VALUES (v_fase, 'QUESTÃO INVÁLIDA DE TESTE', 'Fácil')
        RETURNING id INTO v_qid;

        INSERT INTO alternativas (questao_id, letra, texto, correta) VALUES
            (v_qid, 'A', 'Primeira correta', TRUE),
            (v_qid, 'B', 'Segunda correta',  TRUE);

        -- força a checagem da constraint deferida ainda dentro do bloco
        SET CONSTRAINTS ALL IMMEDIATE;
    EXCEPTION WHEN check_violation THEN
        v_erro := TRUE;
    END;

    IF NOT v_erro THEN
        RAISE EXCEPTION 'O banco ACEITOU questão com duas alternativas corretas';
    END IF;
    RAISE NOTICE '[6/7] Validação de alternativas OK — duas corretas foram recusadas';
END $$;


-- ----------------------------------------------------------------------------
-- 7. Funções de relatório devolvem números coerentes
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    v_pid    INTEGER;
    v_fase   INTEGER;
    v_questao INTEGER;
    v_linhas INTEGER;
    v_taxa   NUMERIC;
    v_estrelas INTEGER;
BEGIN
    SELECT p.id INTO v_pid FROM personagens p
      JOIN usuarios u ON u.id = p.usuario_id
     WHERE u.nome = 'teste_validacao';

    SELECT f.id INTO v_fase FROM fases f JOIN reinos r ON r.id = f.reino_id
     WHERE r.nome = 'Python' AND f.ordem = 1;

    -- três respostas: duas certas, uma errada => 66,7%
    FOR v_questao IN SELECT id FROM questoes WHERE fase_id = v_fase ORDER BY id LIMIT 3
    LOOP
        INSERT INTO respostas_usuario (personagem_id, questao_id, fase_id, acertou)
        VALUES (v_pid, v_questao, v_fase,
                (SELECT COUNT(*) FROM respostas_usuario WHERE personagem_id = v_pid) < 2);
    END LOOP;

    SELECT COUNT(*) INTO v_linhas FROM fn_estatisticas_personagem(v_pid);
    IF v_linhas <> 15 THEN
        RAISE EXCEPTION 'fn_estatisticas_personagem deveria devolver 15 linhas, veio %', v_linhas;
    END IF;

    SELECT taxa_acerto INTO v_taxa
      FROM fn_estatisticas_personagem(v_pid) WHERE fase_id = v_fase;
    IF v_taxa <> 66.7 THEN
        RAISE EXCEPTION 'Taxa de acerto esperada 66.7, veio %', v_taxa;
    END IF;

    SELECT total_estrelas INTO v_estrelas FROM fn_resumo_geral(v_pid);
    IF v_estrelas <> 15 THEN
        RAISE EXCEPTION 'fn_resumo_geral: esperadas 15 estrelas, veio %', v_estrelas;
    END IF;

    IF (SELECT COUNT(*) FROM fn_buscar_alunos('VALIDA')) <> 1 THEN
        RAISE EXCEPTION 'fn_buscar_alunos deveria achar o aluno de teste (busca sem case)';
    END IF;

    RAISE NOTICE '[7/7] Relatórios OK — 15 linhas, taxa 66.7%%, 15 estrelas, busca por nome';
END $$;


-- ----------------------------------------------------------------------------
-- Limpeza: remove o usuário de teste. O CASCADE leva personagem, progresso
-- e respostas junto — o que também prova que as FKs estão certas.
-- ----------------------------------------------------------------------------
DO $$
DECLARE v_sobrou INTEGER;
BEGIN
    DELETE FROM questoes WHERE enunciado = 'QUESTÃO INVÁLIDA DE TESTE';
    DELETE FROM usuarios WHERE nome = 'teste_validacao';

    SELECT COUNT(*) INTO v_sobrou FROM personagens p
      WHERE NOT EXISTS (SELECT 1 FROM usuarios u WHERE u.id = p.usuario_id);
    IF v_sobrou > 0 THEN
        RAISE EXCEPTION 'Sobraram % personagens órfãos — o CASCADE não funcionou', v_sobrou;
    END IF;

    RAISE NOTICE 'Limpeza OK — nenhum resíduo, CASCADE funcionando';
    RAISE NOTICE '====== VALIDAÇÃO CONCLUÍDA COM SUCESSO ======';
END $$;
