-- ============================================================================
-- Migração: título Rei passa de 50 para 45 estrelas.
--
-- 50 era inalcançável: o jogo tem 15 fases (5 Reinos x 3) e cada fase vale
-- no máximo 3 estrelas, então o teto é 45.
--
-- Para banco que JÁ ESTÁ NO AR (Supabase). Base nova não precisa disto: o
-- 03_procedures.sql já vem com 45. Pode rodar mais de uma vez sem problema.
-- ============================================================================

BEGIN;

-- 1. Novo limiar (mesma função do 03_procedures.sql).
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

-- 2. Recalcula o título de quem já tem personagem. A trigger só roda quando o
--    progresso muda; sem isto, quem já tem 45 estrelas continuaria Duque.
UPDATE personagens
   SET titulo_atual = fn_titulo_por_estrelas(total_estrelas)
 WHERE titulo_atual IS DISTINCT FROM fn_titulo_por_estrelas(total_estrelas);

COMMIT;

-- Conferência: deve voltar 0 linhas.
SELECT id, total_estrelas, titulo_atual
  FROM personagens
 WHERE titulo_atual <> fn_titulo_por_estrelas(total_estrelas);
