-- ============================================================================
-- TRONUS — 02b_seed_usuarios.sql
-- Usuários de teste: administrador e professor do Reino Python.
--
-- ARQUIVO GERADO por db/_gerar_seeds.js.
--
-- As senhas estão gravadas como hash bcrypt (custo 10), nunca em texto
-- puro. Os hashes abaixo correspondem às mesmas senhas documentadas no
-- guia de onboarding, para que o time continue testando com elas.
--
-- IMPORTANTE: estes usuários existem para teste e demonstração. Antes de
-- qualquer uso real, troque as senhas.
-- ============================================================================

BEGIN;

-- admin / senha: Tronus@adm1
INSERT INTO usuarios (nome, email, celular, senha_hash, papel, professor_reino_id)
VALUES ('admin', 'admin@tronus.com', '00000000000', '$2b$10$.LFmtRPfn9utw95JfziPr.1KF.1Mm7Ydti0QZlazyNNQ1i/SRkdAy', 'admin', NULL)
  ON CONFLICT (email) DO NOTHING;

-- prof_python / senha: Python@prof1
INSERT INTO usuarios (nome, email, celular, senha_hash, papel, professor_reino_id)
SELECT 'prof_python', 'prof.python@tronus.com', '11111111111', '$2b$10$0Ad/3Hpza7CdiBb5J.25DOaiJ7TEVEcuFxLuVo6tbD5hqV8ZrWlYW', 'professor', r.id
  FROM reinos r WHERE r.nome = 'Python'
  ON CONFLICT (email) DO NOTHING;

COMMIT;
