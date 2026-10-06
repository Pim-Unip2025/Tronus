-- ============================================================================
-- TRONUS — 02_seeds.sql
-- Carga inicial: Reinos, Fases e o banco de questões do Reino Python.
--
-- ARQUIVO GERADO por db/_gerar_seeds.js a partir de js/database.js.
-- Não editar à mão: altere a fonte e gere de novo.
--
-- Idempotente: rodar duas vezes não duplica nada.
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------- Reinos
INSERT INTO reinos (nome, descricao) VALUES ('Python', 'Linguagem de programação Python')
    ON CONFLICT (nome) DO NOTHING;
INSERT INTO reinos (nome, descricao) VALUES ('C++', 'Linguagem de programação C++')
    ON CONFLICT (nome) DO NOTHING;
INSERT INTO reinos (nome, descricao) VALUES ('Engenharia de Software', 'Metodologias ágeis e boas práticas')
    ON CONFLICT (nome) DO NOTHING;
INSERT INTO reinos (nome, descricao) VALUES ('Banco de Dados', 'SQL, modelagem e consultas')
    ON CONFLICT (nome) DO NOTHING;
INSERT INTO reinos (nome, descricao) VALUES ('Redes', 'Fundamentos de redes de computadores')
    ON CONFLICT (nome) DO NOTHING;

-- ----------------------------------------------------------------- Fases
-- Três fases por Reino, numeradas pela coluna ordem.
INSERT INTO fases (reino_id, nome, ordem)
SELECT r.id, 'Fase ' || o.ordem, o.ordem
  FROM reinos r
  CROSS JOIN (VALUES (1::SMALLINT), (2), (3)) AS o(ordem)
  ON CONFLICT (reino_id, ordem) DO NOTHING;

-- -------------------------------------------------- Questões do Python
-- 5 questões por fase, 5 alternativas (A a E), exatamente 1 correta.
-- A verificação de duplicata usa o par (fase, enunciado).

-- ---------- Fase 1 ----------
-- Fase 1, questão 1
WITH alvo AS (
    SELECT f.id AS fase_id
      FROM fases f JOIN reinos r ON r.id = f.reino_id
     WHERE r.nome = 'Python' AND f.ordem = 1
), nova AS (
    INSERT INTO questoes (fase_id, enunciado, nivel_dificuldade)
    SELECT alvo.fase_id, 'Sobre tipos de dados em Python, considere:

I.   Em Python, o tipo de uma variável é inferido automaticamente (tipagem dinâmica).
II.  O tipo int em Python 3 tem tamanho fixo de 32 bits.
III. A função type() retorna o tipo de qualquer objeto.
IV.  Strings em Python são imutáveis.

Assinale a alternativa correta:', 'Médio'
      FROM alvo
     WHERE NOT EXISTS (
         SELECT 1 FROM questoes x
          WHERE x.fase_id = alvo.fase_id AND x.enunciado = 'Sobre tipos de dados em Python, considere:

I.   Em Python, o tipo de uma variável é inferido automaticamente (tipagem dinâmica).
II.  O tipo int em Python 3 tem tamanho fixo de 32 bits.
III. A função type() retorna o tipo de qualquer objeto.
IV.  Strings em Python são imutáveis.

Assinale a alternativa correta:'
     )
    RETURNING id
)
INSERT INTO alternativas (questao_id, letra, texto, correta)
    SELECT nova.id, 'A', 'Apenas I e II estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'B', 'Apenas I, III e IV estão corretas.', TRUE FROM nova
    UNION ALL
    SELECT nova.id, 'C', 'Apenas II e III estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'D', 'Apenas III e IV estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'E', 'Todas as afirmativas estão corretas.', FALSE FROM nova
;

-- Fase 1, questão 2
WITH alvo AS (
    SELECT f.id AS fase_id
      FROM fases f JOIN reinos r ON r.id = f.reino_id
     WHERE r.nome = 'Python' AND f.ordem = 1
), nova AS (
    INSERT INTO questoes (fase_id, enunciado, nivel_dificuldade)
    SELECT alvo.fase_id, 'Sobre operadores em Python, considere:

I.   O operador // realiza divisão inteira (floor division).
II.  O operador % retorna o quociente da divisão.
III. O operador ** realiza potenciação.
IV.  O operador + pode concatenar strings.

Assinale a alternativa correta:', 'Médio'
      FROM alvo
     WHERE NOT EXISTS (
         SELECT 1 FROM questoes x
          WHERE x.fase_id = alvo.fase_id AND x.enunciado = 'Sobre operadores em Python, considere:

I.   O operador // realiza divisão inteira (floor division).
II.  O operador % retorna o quociente da divisão.
III. O operador ** realiza potenciação.
IV.  O operador + pode concatenar strings.

Assinale a alternativa correta:'
     )
    RETURNING id
)
INSERT INTO alternativas (questao_id, letra, texto, correta)
    SELECT nova.id, 'A', 'Apenas I e II estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'B', 'Apenas I, III e IV estão corretas.', TRUE FROM nova
    UNION ALL
    SELECT nova.id, 'C', 'Apenas II e III estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'D', 'Todas as afirmativas estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'E', 'Apenas III e IV estão corretas.', FALSE FROM nova
;

-- Fase 1, questão 3
WITH alvo AS (
    SELECT f.id AS fase_id
      FROM fases f JOIN reinos r ON r.id = f.reino_id
     WHERE r.nome = 'Python' AND f.ordem = 1
), nova AS (
    INSERT INTO questoes (fase_id, enunciado, nivel_dificuldade)
    SELECT alvo.fase_id, 'Sobre entrada e saída em Python, considere:

I.   A função print() pode receber múltiplos argumentos separados por vírgula.
II.  A função input() sempre retorna um valor do tipo string.
III. f-strings permitem embutir expressões em strings com a sintaxe f"{variavel}".
IV.  A função print() retorna o texto impresso como valor de retorno.

Assinale a alternativa correta:', 'Fácil'
      FROM alvo
     WHERE NOT EXISTS (
         SELECT 1 FROM questoes x
          WHERE x.fase_id = alvo.fase_id AND x.enunciado = 'Sobre entrada e saída em Python, considere:

I.   A função print() pode receber múltiplos argumentos separados por vírgula.
II.  A função input() sempre retorna um valor do tipo string.
III. f-strings permitem embutir expressões em strings com a sintaxe f"{variavel}".
IV.  A função print() retorna o texto impresso como valor de retorno.

Assinale a alternativa correta:'
     )
    RETURNING id
)
INSERT INTO alternativas (questao_id, letra, texto, correta)
    SELECT nova.id, 'A', 'Apenas I e II estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'B', 'Apenas I, II e III estão corretas.', TRUE FROM nova
    UNION ALL
    SELECT nova.id, 'C', 'Apenas II e III estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'D', 'Apenas III e IV estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'E', 'Todas as afirmativas estão corretas.', FALSE FROM nova
;

-- Fase 1, questão 4
WITH alvo AS (
    SELECT f.id AS fase_id
      FROM fases f JOIN reinos r ON r.id = f.reino_id
     WHERE r.nome = 'Python' AND f.ordem = 1
), nova AS (
    INSERT INTO questoes (fase_id, enunciado, nivel_dificuldade)
    SELECT alvo.fase_id, 'Sobre conversão de tipos em Python, considere:

I.   int("42") converte a string "42" para o inteiro 42.
II.  str(3.14) converte o float 3.14 para a string "3.14".
III. float("abc") é válido e retorna 0.0.
IV.  bool(0) retorna False em Python.

Assinale a alternativa correta:', 'Médio'
      FROM alvo
     WHERE NOT EXISTS (
         SELECT 1 FROM questoes x
          WHERE x.fase_id = alvo.fase_id AND x.enunciado = 'Sobre conversão de tipos em Python, considere:

I.   int("42") converte a string "42" para o inteiro 42.
II.  str(3.14) converte o float 3.14 para a string "3.14".
III. float("abc") é válido e retorna 0.0.
IV.  bool(0) retorna False em Python.

Assinale a alternativa correta:'
     )
    RETURNING id
)
INSERT INTO alternativas (questao_id, letra, texto, correta)
    SELECT nova.id, 'A', 'Apenas I e II estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'B', 'Apenas I, II e IV estão corretas.', TRUE FROM nova
    UNION ALL
    SELECT nova.id, 'C', 'Apenas II e III estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'D', 'Apenas I e IV estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'E', 'Todas as afirmativas estão corretas.', FALSE FROM nova
;

-- Fase 1, questão 5
WITH alvo AS (
    SELECT f.id AS fase_id
      FROM fases f JOIN reinos r ON r.id = f.reino_id
     WHERE r.nome = 'Python' AND f.ordem = 1
), nova AS (
    INSERT INTO questoes (fase_id, enunciado, nivel_dificuldade)
    SELECT alvo.fase_id, 'Sobre comentários e indentação em Python, considere:

I.   A indentação define os blocos de código, substituindo as chaves {}.
II.  Comentários de linha são feitos com o caractere #.
III. Python aceita misturar tabulações e espaços na mesma indentação sem erros.
IV.  Strings com aspas triplas (""" """) podem funcionar como comentários de múltiplas linhas.

Assinale a alternativa correta:', 'Fácil'
      FROM alvo
     WHERE NOT EXISTS (
         SELECT 1 FROM questoes x
          WHERE x.fase_id = alvo.fase_id AND x.enunciado = 'Sobre comentários e indentação em Python, considere:

I.   A indentação define os blocos de código, substituindo as chaves {}.
II.  Comentários de linha são feitos com o caractere #.
III. Python aceita misturar tabulações e espaços na mesma indentação sem erros.
IV.  Strings com aspas triplas (""" """) podem funcionar como comentários de múltiplas linhas.

Assinale a alternativa correta:'
     )
    RETURNING id
)
INSERT INTO alternativas (questao_id, letra, texto, correta)
    SELECT nova.id, 'A', 'Apenas I e II estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'B', 'Apenas I e III estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'C', 'Apenas I, II e IV estão corretas.', TRUE FROM nova
    UNION ALL
    SELECT nova.id, 'D', 'Todas as afirmativas estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'E', 'Apenas II e IV estão corretas.', FALSE FROM nova
;

-- ---------- Fase 2 ----------
-- Fase 2, questão 1
WITH alvo AS (
    SELECT f.id AS fase_id
      FROM fases f JOIN reinos r ON r.id = f.reino_id
     WHERE r.nome = 'Python' AND f.ordem = 2
), nova AS (
    INSERT INTO questoes (fase_id, enunciado, nivel_dificuldade)
    SELECT alvo.fase_id, 'Sobre a estrutura if/elif/else em Python, considere:

I.   O comando elif é equivalente a else if em outras linguagens.
II.  É obrigatório ter um bloco else após o if em Python.
III. O operador ternário em Python tem a forma: valor_verdadeiro if condição else valor_falso.
IV.  É possível encadear múltiplos elif em um mesmo bloco if.

Assinale a alternativa correta:', 'Médio'
      FROM alvo
     WHERE NOT EXISTS (
         SELECT 1 FROM questoes x
          WHERE x.fase_id = alvo.fase_id AND x.enunciado = 'Sobre a estrutura if/elif/else em Python, considere:

I.   O comando elif é equivalente a else if em outras linguagens.
II.  É obrigatório ter um bloco else após o if em Python.
III. O operador ternário em Python tem a forma: valor_verdadeiro if condição else valor_falso.
IV.  É possível encadear múltiplos elif em um mesmo bloco if.

Assinale a alternativa correta:'
     )
    RETURNING id
)
INSERT INTO alternativas (questao_id, letra, texto, correta)
    SELECT nova.id, 'A', 'Apenas I e II estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'B', 'Apenas II e III estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'C', 'Apenas I, III e IV estão corretas.', TRUE FROM nova
    UNION ALL
    SELECT nova.id, 'D', 'Todas as afirmativas estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'E', 'Apenas I e IV estão corretas.', FALSE FROM nova
;

-- Fase 2, questão 2
WITH alvo AS (
    SELECT f.id AS fase_id
      FROM fases f JOIN reinos r ON r.id = f.reino_id
     WHERE r.nome = 'Python' AND f.ordem = 2
), nova AS (
    INSERT INTO questoes (fase_id, enunciado, nivel_dificuldade)
    SELECT alvo.fase_id, 'Sobre os laços for e while em Python, considere:

I.   O laço for percorre qualquer objeto iterável.
II.  A função range(1, 10, 2) gera os números 1, 3, 5, 7, 9.
III. O laço while é executado enquanto sua condição for verdadeira.
IV.  O laço for em Python não pode ter um bloco else.

Assinale a alternativa correta:', 'Médio'
      FROM alvo
     WHERE NOT EXISTS (
         SELECT 1 FROM questoes x
          WHERE x.fase_id = alvo.fase_id AND x.enunciado = 'Sobre os laços for e while em Python, considere:

I.   O laço for percorre qualquer objeto iterável.
II.  A função range(1, 10, 2) gera os números 1, 3, 5, 7, 9.
III. O laço while é executado enquanto sua condição for verdadeira.
IV.  O laço for em Python não pode ter um bloco else.

Assinale a alternativa correta:'
     )
    RETURNING id
)
INSERT INTO alternativas (questao_id, letra, texto, correta)
    SELECT nova.id, 'A', 'Apenas I e III estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'B', 'Apenas I, II e III estão corretas.', TRUE FROM nova
    UNION ALL
    SELECT nova.id, 'C', 'Apenas II e IV estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'D', 'Todas as afirmativas estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'E', 'Apenas III e IV estão corretas.', FALSE FROM nova
;

-- Fase 2, questão 3
WITH alvo AS (
    SELECT f.id AS fase_id
      FROM fases f JOIN reinos r ON r.id = f.reino_id
     WHERE r.nome = 'Python' AND f.ordem = 2
), nova AS (
    INSERT INTO questoes (fase_id, enunciado, nivel_dificuldade)
    SELECT alvo.fase_id, 'Sobre os comandos break e continue em Python, considere:

I.   O comando break encerra o laço mais interno imediatamente.
II.  O comando continue pula para a próxima iteração do laço.
III. O bloco else de um laço for é executado somente se o laço terminar sem break.
IV.  O comando break pode ser usado fora de um laço sem gerar erro.

Assinale a alternativa correta:', 'Difícil'
      FROM alvo
     WHERE NOT EXISTS (
         SELECT 1 FROM questoes x
          WHERE x.fase_id = alvo.fase_id AND x.enunciado = 'Sobre os comandos break e continue em Python, considere:

I.   O comando break encerra o laço mais interno imediatamente.
II.  O comando continue pula para a próxima iteração do laço.
III. O bloco else de um laço for é executado somente se o laço terminar sem break.
IV.  O comando break pode ser usado fora de um laço sem gerar erro.

Assinale a alternativa correta:'
     )
    RETURNING id
)
INSERT INTO alternativas (questao_id, letra, texto, correta)
    SELECT nova.id, 'A', 'Apenas I e II estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'B', 'Apenas I, II e III estão corretas.', TRUE FROM nova
    UNION ALL
    SELECT nova.id, 'C', 'Apenas II e III estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'D', 'Todas as afirmativas estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'E', 'Apenas I e IV estão corretas.', FALSE FROM nova
;

-- Fase 2, questão 4
WITH alvo AS (
    SELECT f.id AS fase_id
      FROM fases f JOIN reinos r ON r.id = f.reino_id
     WHERE r.nome = 'Python' AND f.ordem = 2
), nova AS (
    INSERT INTO questoes (fase_id, enunciado, nivel_dificuldade)
    SELECT alvo.fase_id, 'Sobre o comando match/case (Python 3.10+), considere:

I.   O comando match é equivalente ao switch de outras linguagens.
II.  O padrão case _ funciona como um caso padrão (default).
III. O match só aceita valores inteiros como expressão de controle.
IV.  É possível usar guardas (if) dentro dos casos do match.

Assinale a alternativa correta:', 'Difícil'
      FROM alvo
     WHERE NOT EXISTS (
         SELECT 1 FROM questoes x
          WHERE x.fase_id = alvo.fase_id AND x.enunciado = 'Sobre o comando match/case (Python 3.10+), considere:

I.   O comando match é equivalente ao switch de outras linguagens.
II.  O padrão case _ funciona como um caso padrão (default).
III. O match só aceita valores inteiros como expressão de controle.
IV.  É possível usar guardas (if) dentro dos casos do match.

Assinale a alternativa correta:'
     )
    RETURNING id
)
INSERT INTO alternativas (questao_id, letra, texto, correta)
    SELECT nova.id, 'A', 'Apenas I e II estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'B', 'Apenas I, II e IV estão corretas.', TRUE FROM nova
    UNION ALL
    SELECT nova.id, 'C', 'Apenas I e III estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'D', 'Todas as afirmativas estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'E', 'Apenas II e III estão corretas.', FALSE FROM nova
;

-- Fase 2, questão 5
WITH alvo AS (
    SELECT f.id AS fase_id
      FROM fases f JOIN reinos r ON r.id = f.reino_id
     WHERE r.nome = 'Python' AND f.ordem = 2
), nova AS (
    INSERT INTO questoes (fase_id, enunciado, nivel_dificuldade)
    SELECT alvo.fase_id, 'Sobre funções de iteração embutidas em Python, considere:

I.   enumerate() retorna pares (índice, valor) ao iterar sobre uma sequência.
II.  zip() combina dois ou mais iteráveis em pares de tuplas.
III. map() retorna diretamente uma lista com os resultados.
IV.  filter() retorna apenas os elementos para os quais a função fornecida retorna True.

Assinale a alternativa correta:', 'Médio'
      FROM alvo
     WHERE NOT EXISTS (
         SELECT 1 FROM questoes x
          WHERE x.fase_id = alvo.fase_id AND x.enunciado = 'Sobre funções de iteração embutidas em Python, considere:

I.   enumerate() retorna pares (índice, valor) ao iterar sobre uma sequência.
II.  zip() combina dois ou mais iteráveis em pares de tuplas.
III. map() retorna diretamente uma lista com os resultados.
IV.  filter() retorna apenas os elementos para os quais a função fornecida retorna True.

Assinale a alternativa correta:'
     )
    RETURNING id
)
INSERT INTO alternativas (questao_id, letra, texto, correta)
    SELECT nova.id, 'A', 'Apenas I e II estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'B', 'Apenas I, II e IV estão corretas.', TRUE FROM nova
    UNION ALL
    SELECT nova.id, 'C', 'Apenas II e III estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'D', 'Todas as afirmativas estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'E', 'Apenas III e IV estão corretas.', FALSE FROM nova
;

-- ---------- Fase 3 ----------
-- Fase 3, questão 1
WITH alvo AS (
    SELECT f.id AS fase_id
      FROM fases f JOIN reinos r ON r.id = f.reino_id
     WHERE r.nome = 'Python' AND f.ordem = 3
), nova AS (
    INSERT INTO questoes (fase_id, enunciado, nivel_dificuldade)
    SELECT alvo.fase_id, 'Sobre definição de funções em Python, considere:

I.   Funções são definidas com a palavra-chave def.
II.  Uma função pode retornar múltiplos valores separados por vírgula (como tupla).
III. Parâmetros com valor padrão devem sempre vir antes dos sem valor padrão.
IV.  O uso de *args permite receber um número variável de argumentos posicionais.

Assinale a alternativa correta:', 'Médio'
      FROM alvo
     WHERE NOT EXISTS (
         SELECT 1 FROM questoes x
          WHERE x.fase_id = alvo.fase_id AND x.enunciado = 'Sobre definição de funções em Python, considere:

I.   Funções são definidas com a palavra-chave def.
II.  Uma função pode retornar múltiplos valores separados por vírgula (como tupla).
III. Parâmetros com valor padrão devem sempre vir antes dos sem valor padrão.
IV.  O uso de *args permite receber um número variável de argumentos posicionais.

Assinale a alternativa correta:'
     )
    RETURNING id
)
INSERT INTO alternativas (questao_id, letra, texto, correta)
    SELECT nova.id, 'A', 'Apenas I e II estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'B', 'Apenas I, II e IV estão corretas.', TRUE FROM nova
    UNION ALL
    SELECT nova.id, 'C', 'Apenas II e III estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'D', 'Todas as afirmativas estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'E', 'Apenas I e IV estão corretas.', FALSE FROM nova
;

-- Fase 3, questão 2
WITH alvo AS (
    SELECT f.id AS fase_id
      FROM fases f JOIN reinos r ON r.id = f.reino_id
     WHERE r.nome = 'Python' AND f.ordem = 3
), nova AS (
    INSERT INTO questoes (fase_id, enunciado, nivel_dificuldade)
    SELECT alvo.fase_id, 'Sobre listas e seus métodos em Python, considere:

I.   O método append() adiciona um elemento ao final da lista.
II.  O método sort() retorna uma nova lista ordenada sem modificar a original.
III. O método pop() remove e retorna o último elemento da lista por padrão.
IV.  O método extend() adiciona todos os elementos de um iterável ao final da lista.

Assinale a alternativa correta:', 'Médio'
      FROM alvo
     WHERE NOT EXISTS (
         SELECT 1 FROM questoes x
          WHERE x.fase_id = alvo.fase_id AND x.enunciado = 'Sobre listas e seus métodos em Python, considere:

I.   O método append() adiciona um elemento ao final da lista.
II.  O método sort() retorna uma nova lista ordenada sem modificar a original.
III. O método pop() remove e retorna o último elemento da lista por padrão.
IV.  O método extend() adiciona todos os elementos de um iterável ao final da lista.

Assinale a alternativa correta:'
     )
    RETURNING id
)
INSERT INTO alternativas (questao_id, letra, texto, correta)
    SELECT nova.id, 'A', 'Apenas I e II estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'B', 'Apenas I, III e IV estão corretas.', TRUE FROM nova
    UNION ALL
    SELECT nova.id, 'C', 'Apenas II e III estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'D', 'Todas as afirmativas estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'E', 'Apenas I e IV estão corretas.', FALSE FROM nova
;

-- Fase 3, questão 3
WITH alvo AS (
    SELECT f.id AS fase_id
      FROM fases f JOIN reinos r ON r.id = f.reino_id
     WHERE r.nome = 'Python' AND f.ordem = 3
), nova AS (
    INSERT INTO questoes (fase_id, enunciado, nivel_dificuldade)
    SELECT alvo.fase_id, 'Sobre herança e POO em Python, considere:

I.   Uma classe herda de outra usando a sintaxe: class Filha(Mae):.
II.  Python não permite herança múltipla de classes.
III. O método __init__ é o construtor da classe em Python.
IV.  A função super() permite chamar métodos da classe pai.

Assinale a alternativa correta:', 'Médio'
      FROM alvo
     WHERE NOT EXISTS (
         SELECT 1 FROM questoes x
          WHERE x.fase_id = alvo.fase_id AND x.enunciado = 'Sobre herança e POO em Python, considere:

I.   Uma classe herda de outra usando a sintaxe: class Filha(Mae):.
II.  Python não permite herança múltipla de classes.
III. O método __init__ é o construtor da classe em Python.
IV.  A função super() permite chamar métodos da classe pai.

Assinale a alternativa correta:'
     )
    RETURNING id
)
INSERT INTO alternativas (questao_id, letra, texto, correta)
    SELECT nova.id, 'A', 'Apenas I e III estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'B', 'Apenas I, III e IV estão corretas.', TRUE FROM nova
    UNION ALL
    SELECT nova.id, 'C', 'Apenas II e III estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'D', 'Todas as afirmativas estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'E', 'Apenas I e II estão corretas.', FALSE FROM nova
;

-- Fase 3, questão 4
WITH alvo AS (
    SELECT f.id AS fase_id
      FROM fases f JOIN reinos r ON r.id = f.reino_id
     WHERE r.nome = 'Python' AND f.ordem = 3
), nova AS (
    INSERT INTO questoes (fase_id, enunciado, nivel_dificuldade)
    SELECT alvo.fase_id, 'Sobre tratamento de exceções em Python, considere:

I.   O bloco finally é sempre executado, independentemente de ocorrer exceção.
II.  Exceções personalizadas devem herdar da classe Exception.
III. O bloco except pode capturar tipos específicos de exceção.
IV.  Um bloco try pode ter apenas um bloco except.

Assinale a alternativa correta:', 'Difícil'
      FROM alvo
     WHERE NOT EXISTS (
         SELECT 1 FROM questoes x
          WHERE x.fase_id = alvo.fase_id AND x.enunciado = 'Sobre tratamento de exceções em Python, considere:

I.   O bloco finally é sempre executado, independentemente de ocorrer exceção.
II.  Exceções personalizadas devem herdar da classe Exception.
III. O bloco except pode capturar tipos específicos de exceção.
IV.  Um bloco try pode ter apenas um bloco except.

Assinale a alternativa correta:'
     )
    RETURNING id
)
INSERT INTO alternativas (questao_id, letra, texto, correta)
    SELECT nova.id, 'A', 'Apenas I e II estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'B', 'Apenas I, II e III estão corretas.', TRUE FROM nova
    UNION ALL
    SELECT nova.id, 'C', 'Apenas II e III estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'D', 'Todas as afirmativas estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'E', 'Apenas III e IV estão corretas.', FALSE FROM nova
;

-- Fase 3, questão 5
WITH alvo AS (
    SELECT f.id AS fase_id
      FROM fases f JOIN reinos r ON r.id = f.reino_id
     WHERE r.nome = 'Python' AND f.ordem = 3
), nova AS (
    INSERT INTO questoes (fase_id, enunciado, nivel_dificuldade)
    SELECT alvo.fase_id, 'Sobre módulos e gerenciamento de pacotes em Python, considere:

I.   O comando import permite usar módulos externos em Python.
II.  A instrução from math import sqrt importa apenas a função sqrt do módulo math.
III. Módulos criados pelo próprio programador não podem ser importados.
IV.  O comando pip é usado para instalar pacotes externos do PyPI.

Assinale a alternativa correta:', 'Fácil'
      FROM alvo
     WHERE NOT EXISTS (
         SELECT 1 FROM questoes x
          WHERE x.fase_id = alvo.fase_id AND x.enunciado = 'Sobre módulos e gerenciamento de pacotes em Python, considere:

I.   O comando import permite usar módulos externos em Python.
II.  A instrução from math import sqrt importa apenas a função sqrt do módulo math.
III. Módulos criados pelo próprio programador não podem ser importados.
IV.  O comando pip é usado para instalar pacotes externos do PyPI.

Assinale a alternativa correta:'
     )
    RETURNING id
)
INSERT INTO alternativas (questao_id, letra, texto, correta)
    SELECT nova.id, 'A', 'Apenas I e II estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'B', 'Apenas I, II e IV estão corretas.', TRUE FROM nova
    UNION ALL
    SELECT nova.id, 'C', 'Apenas II e III estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'D', 'Todas as afirmativas estão corretas.', FALSE FROM nova
    UNION ALL
    SELECT nova.id, 'E', 'Apenas I e IV estão corretas.', FALSE FROM nova
;

COMMIT;
