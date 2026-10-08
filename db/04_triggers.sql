-- ============================================================================
-- TRONUS — 04_triggers.sql
-- Triggers de consistência. Rodar depois de 03_procedures.sql, porque a
-- trigger de progresso usa fn_titulo_por_estrelas.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. trg_progresso_atualiza_personagem
--
-- Hoje o JavaScript chama atualizarTitulo() logo depois de gravar progresso
-- (js/database.js linha 612). Se qualquer cliente — web, mobile ou WinForms —
-- esquecer essa chamada, o personagem fica com total de estrelas errado e o
-- título desatualizado, sem erro nenhum aparecer.
--
-- Com a trigger, gravar progresso é suficiente. A consistência deixa de
-- depender da disciplina de quem escreveu o cliente.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_atualiza_personagem()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_personagem_id INTEGER;
    v_total         INTEGER;
BEGIN
    v_personagem_id := COALESCE(NEW.personagem_id, OLD.personagem_id);

    -- Se o personagem foi apagado em cascata, não há nada a atualizar.
    IF NOT EXISTS (SELECT 1 FROM personagens WHERE id = v_personagem_id) THEN
        RETURN NULL;
    END IF;

    SELECT COALESCE(SUM(estrelas), 0)
      INTO v_total
      FROM progresso_fases
     WHERE personagem_id = v_personagem_id;

    UPDATE personagens
       SET total_estrelas = v_total,
           titulo_atual   = fn_titulo_por_estrelas(v_total)
     WHERE id = v_personagem_id;

    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_progresso_atualiza_personagem ON progresso_fases;

CREATE TRIGGER trg_progresso_atualiza_personagem
    AFTER INSERT OR UPDATE OR DELETE ON progresso_fases
    FOR EACH ROW
    EXECUTE FUNCTION fn_atualiza_personagem();


-- ----------------------------------------------------------------------------
-- 2. trg_resposta_timestamp
--
-- Garante data_resposta preenchida mesmo que o cliente envie NULL.
-- A coluna já tem DEFAULT now(), mas o DEFAULT só vale quando a coluna é
-- OMITIDA do INSERT. Um cliente que manda explicitamente NULL furaria o
-- DEFAULT e bateria no NOT NULL. A trigger BEFORE roda antes da checagem
-- de NOT NULL e resolve os dois casos.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_resposta_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.data_resposta IS NULL THEN
        NEW.data_resposta := now();
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_resposta_timestamp ON respostas_usuario;

CREATE TRIGGER trg_resposta_timestamp
    BEFORE INSERT ON respostas_usuario
    FOR EACH ROW
    EXECUTE FUNCTION fn_resposta_timestamp();


-- ----------------------------------------------------------------------------
-- 3. trg_valida_alternativa_correta
--
-- Corrige um defeito real do sistema atual: criarQuestao() em
-- js/database.js (linha 791) aceita qualquer conjunto de alternativas. Nada
-- impede o professor de salvar uma questão com NENHUMA correta ou com DUAS.
-- Quando isso acontece, o quiz não acusa erro — ele simplesmente nunca
-- considera a resposta certa, ou aceita duas respostas diferentes.
--
-- É uma CONSTRAINT TRIGGER DEFERIDA: a checagem roda no COMMIT, e não a
-- cada linha. Sem isso, inserir as cinco alternativas uma a uma falharia já
-- na primeira, quando ainda não existe nenhuma correta.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_valida_alternativa_correta()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_questao_id INTEGER;
    v_total      INTEGER;
    v_corretas   INTEGER;
BEGIN
    v_questao_id := COALESCE(NEW.questao_id, OLD.questao_id);

    -- A questão inteira foi apagada: as alternativas somem junto, nada a validar.
    IF NOT EXISTS (SELECT 1 FROM questoes WHERE id = v_questao_id) THEN
        RETURN NULL;
    END IF;

    SELECT COUNT(*), COUNT(*) FILTER (WHERE correta)
      INTO v_total, v_corretas
      FROM alternativas
     WHERE questao_id = v_questao_id;

    -- Questão ainda sem alternativas: está em construção.
    IF v_total = 0 THEN
        RETURN NULL;
    END IF;

    IF v_corretas <> 1 THEN
        RAISE EXCEPTION
            'A questão % precisa ter exatamente uma alternativa correta (encontradas: %).',
            v_questao_id, v_corretas
            USING ERRCODE = 'check_violation';
    END IF;

    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_valida_alternativa_correta ON alternativas;

CREATE CONSTRAINT TRIGGER trg_valida_alternativa_correta
    AFTER INSERT OR UPDATE OR DELETE ON alternativas
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW
    EXECUTE FUNCTION fn_valida_alternativa_correta();
