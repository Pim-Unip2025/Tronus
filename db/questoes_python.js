// Banco de questões do Reino Python: uma lista por fase (Fase 1, 2, 3),
// cada questão com enunciado, nível e 5 alternativas (exatamente 1 correta).
//
// Fonte dos seeds: depois de editar, rode `npm run db:seeds` para regerar
// db/02_seeds.sql. (Antes esta lista ficava dentro do js/database.js.)

module.exports = [

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
