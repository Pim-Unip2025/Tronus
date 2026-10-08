# Banco de dados — Tronus

Esquema PostgreSQL do Tronus, portado do SQLite que hoje roda no navegador
(`js/database.js`). Hospedado no Supabase.

---

## Ordem dos scripts

Os arquivos são numerados e **a ordem importa**. O `04` depende de funções
criadas no `03`, e o `03` depende das tabelas do `01`.

| Arquivo | O que faz |
|---|---|
| `01_schema.sql` | Cria as 8 tabelas, constraints, índices e habilita RLS |
| `02_seeds.sql` | Carga inicial: 5 Reinos, 15 Fases e as 15 questões de Python |
| `02b_seed_usuarios.sql` | Usuários de teste (`admin` e `prof_python`) com senha em hash |
| `03_procedures.sql` | Procedures e funções de relatório |
| `04_triggers.sql` | Triggers de consistência |
| `99_validacao.sql` | Roteiro que prova que tudo acima funciona |
| `migracoes/` | Mudanças para aplicar num banco que **já está no ar**, em ordem de data. Base nova não precisa delas: os scripts acima já vêm atualizados |

> `01_schema.sql` começa com `DROP TABLE ... CASCADE`. **Ele apaga tudo antes
> de recriar.** É proposital — o critério de pronto exige recriar a base do
> zero — mas não rode isso num banco com dados que importam.

O `02_seeds.sql` e o `02b_seed_usuarios.sql` são **gerados**, não escritos à
mão. A fonte é `js/database.js`. Para regerar:

```bash
npm install bcryptjs      # só na primeira vez
node db/_gerar_seeds.js
```

---

## Subindo no Supabase — passo a passo

### 1. Criar o projeto

1. Entre em [supabase.com](https://supabase.com) e crie a conta (dá para
   entrar com o GitHub).
2. **New project**. Preencha:
   - **Name**: `tronus`
   - **Database Password**: gere uma forte e **guarde agora**. O Supabase
     mostra essa senha uma vez só. Se perder, dá para resetar, mas quebra
     tudo que já estiver usando ela.
   - **Region**: `South America (São Paulo)`. Região errada custa uns 150 ms
     a mais por consulta, e isso aparece na demo.
3. Espere uns dois minutos até o projeto provisionar.

### 2. Pegar as strings de conexão

No painel do projeto, clique em **Connect**, no topo. Vão aparecer três
opções, e **cada uma serve para uma coisa diferente**:

| Tipo | Porta | Use para |
|---|---|---|
| **Direct connection** | 5432 | Backend com conexão permanente. **Só IPv6** no plano free |
| **Session pooler** | 5432 | Rodar scripts, DBeaver, psql da sua máquina. IPv4 |
| **Transaction pooler** | 6543 | **A API NestJS na Vercel.** IPv4 |

A pegadinha que derruba todo mundo: a *direct connection* do plano gratuito
só responde em **IPv6**. Se a sua internet não tiver IPv6, o `psql` falha com
`could not translate host name` ou `ENOTFOUND` e parece que a senha está
errada. **Não está.** Use o *session pooler* e funciona.

Guarde as duas que vamos usar:

```bash
# Session pooler — para rodar os scripts
postgresql://postgres.SEU_REF:SENHA@aws-0-sa-east-1.pooler.supabase.com:5432/postgres

# Transaction pooler — para a API depois
postgresql://postgres.SEU_REF:SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

### 3. Rodar os scripts

Duas formas. A primeira é mais rápida de começar, a segunda é a que você vai
querer usar no dia a dia.

**Opção A — SQL Editor, pelo navegador**

Painel → **SQL Editor** → **New query**. Cole o conteúdo de um arquivo,
**Run**, e repita na ordem: `01`, `02`, `02b`, `03`, `04`.

Funciona sem instalar nada. O incômodo é que são cinco rodadas de copiar e
colar, e o `02_seeds.sql` tem 650 linhas.

**Opção B — psql, pelo terminal** *(recomendado)*

```bash
# instalar o cliente, se ainda não tiver
sudo apt install postgresql-client     # Linux
brew install libpq                     # macOS

# exportar a string do SESSION POOLER
export DATABASE_URL="postgresql://postgres.SEU_REF:SENHA@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"

# rodar tudo na ordem, parando no primeiro erro
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 \
  -f db/01_schema.sql \
  -f db/02_seeds.sql \
  -f db/02b_seed_usuarios.sql \
  -f db/03_procedures.sql \
  -f db/04_triggers.sql
```

O `-v ON_ERROR_STOP=1` é importante: sem ele, o psql engole o erro e segue,
e você termina com um banco pela metade achando que deu certo.

### 4. Validar

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/99_validacao.sql
```

Saída esperada:

```
NOTICE:  [1/7] Carga inicial OK — 5 reinos, 15 fases, 15 questões, 75 alternativas
NOTICE:  [2/7] Integridade das alternativas OK
NOTICE:  [3/7] Aluno e personagem criados — título inicial Plebeu
NOTICE:  [4/7] Trigger de progresso OK — 15 estrelas, título Cavaleiro automático
NOTICE:  [5/7] Melhor nota preservada OK — refazer pior não rebaixa o aluno
NOTICE:  [6/7] Validação de alternativas OK — duas corretas foram recusadas
NOTICE:  [7/7] Relatórios OK — 15 linhas, taxa 66.7%, 15 estrelas, busca por nome
NOTICE:  Limpeza OK — nenhum resíduo, CASCADE funcionando
NOTICE:  ====== VALIDAÇÃO CONCLUÍDA COM SUCESSO ======
```

Se qualquer linha faltar ou aparecer `ERROR`, **alguma coisa está errada** —
o script foi escrito para falhar alto, não para avisar baixinho.

### 5. Conferir no painel

**Table Editor** deve mostrar as 8 tabelas. Em cada uma, repare no cadeado
de **RLS enabled** — ele precisa estar ligado. Explicação na seção de
segurança abaixo.

### 6. Impedir que o projeto seja pausado

No plano gratuito, **o Supabase pausa o projeto após uma semana sem
atividade**. Se isso acontecer na véspera da apresentação, o banco estará
fora do ar e vai levar alguns minutos para voltar.

Crie `.github/workflows/keepalive.yml`:

```yaml
name: keep-alive do banco

on:
  schedule:
    - cron: '0 12 * * 1'   # toda segunda, 12h UTC (9h de Brasília)
  workflow_dispatch:        # permite rodar na mão pelo botão

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: consulta trivial para manter o projeto ativo
        run: |
          sudo apt-get update -qq && sudo apt-get install -y postgresql-client
          psql "${{ secrets.DATABASE_URL }}" -c "SELECT 1;"
```

Depois vá em **Settings → Secrets and variables → Actions** no GitHub e
crie o secret `DATABASE_URL` com a string do **session pooler**.

---

## Conectando a API depois

Quando o NestJS entrar, use a string do **transaction pooler (6543)** e
preste atenção em três coisas, porque a Vercel roda serverless:

- **Pool de 1 conexão** por instância. Serverless abre muita conexão curta;
  pool grande estoura o limite do Supabase.
- **Prepared statements desligados.** O modo transação do pooler não suporta.
  No Prisma, isso é `?pgbouncer=true` no fim da URL.
- **SSL obrigatório** (`sslmode=require`).

Ignorar o segundo item causa um erro intermitente e difícil de achar: funciona
em desenvolvimento e quebra em produção sem padrão aparente.

---

## Segurança: por que RLS está ligado

O Supabase publica automaticamente uma API REST sobre o schema `public`,
acessível com a chave anônima do projeto — que é pública por definição, já
que fica no front-end.

**Sem RLS, qualquer pessoa com essa chave lê e escreve as suas tabelas
direto, contornando a nossa API.** Incluindo a tabela `usuarios`.

O `01_schema.sql` habilita RLS nas 8 tabelas **sem criar policy nenhuma**.
Na prática isso nega todo acesso pela API pública. A nossa API NestJS conecta
com o usuário dono do banco, que não é afetado por RLS e continua enxergando
tudo.

Se alguém precisar consultar as tabelas pelo painel do Supabase, funciona
normalmente — o painel usa a chave de serviço.

> Nunca commite a `service_role key` nem a senha do banco. Elas vão em
> variável de ambiente e em secret do GitHub, e o `.env` fica no
> `.gitignore`.

---

## Decisões de modelagem

O que mudou em relação ao SQLite, e por quê. Isso aqui vira texto da Etapa 7
da documentação.

| SQLite (antes) | PostgreSQL (agora) | Motivo |
|---|---|---|
| `INTEGER PRIMARY KEY AUTOINCREMENT` | `GENERATED ALWAYS AS IDENTITY` | Padrão SQL; impede escrita manual no id |
| `correta INTEGER` (0/1) | `correta BOOLEAN` | O dado é booleano; 0/1 é gambiarra herdada do SQLite |
| `acertou INTEGER` (0/1) | `acertou BOOLEAN` | Idem |
| `data_resposta TEXT` | `data_resposta TIMESTAMPTZ` | Data como texto impede ordenar e filtrar por período |
| `senha TEXT` (texto puro) | `senha_hash TEXT` | Limitação conhecida do PIM III, agora corrigida |
| sem FK em `respostas_usuario.fase_id` | FK criada | Faltava; permitia resposta apontando para fase inexistente |
| sem FK em `professor_reino_id` | FK criada | Idem |

**Constraints que valem citar na defesa:**

- `UNIQUE (personagem_id, fase_id)` em `progresso_fases` — um personagem tem
  no máximo um registro por fase. Sem isso, a soma de estrelas duplicaria.
- `CHECK (estrelas BETWEEN 0 AND 3)` — a regra do jogo vira regra do banco.
- `CHECK` no papel do usuário cruzado com `professor_reino_id` — professor
  obrigatoriamente tem Reino; aluno e admin obrigatoriamente não têm. Hoje
  nada impede um aluno vinculado a um Reino.
- `UNIQUE (questao_id, letra)` — impede duas alternativas "B" na mesma questão.

**Política de exclusão:** quase tudo é `ON DELETE CASCADE`, porque os dados
são hierárquicos — apagar um Reino sem apagar suas Fases deixaria lixo
inacessível. A exceção é `usuarios.professor_reino_id`, que é `RESTRICT`:
apagar um Reino que ainda tem professor vinculado deve falhar e exigir uma
decisão humana.

---

## Mudança de comportamento que o time precisa aprovar

`sp_registrar_progresso` **não se comporta igual ao código atual.**

O `atualizarProgresso()` de hoje (`js/database.js` linha 606) faz
`DO UPDATE SET estrelas = excluded.estrelas` — sobrescreve com a última nota.
Consequência: o aluno que tirou 3 estrelas, refaz a fase e vai mal, **perde
as estrelas** e pode até cair de título.

A procedure usa `GREATEST`: mantém a melhor nota já conquistada. Refazer uma
fase só melhora.

Se a equipe preferir o comportamento antigo, é uma linha em
`03_procedures.sql` — troque `GREATEST(progresso_fases.estrelas,
EXCLUDED.estrelas)` por `EXCLUDED.estrelas`.

---

## Como resetar o banco

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 \
  -f db/01_schema.sql -f db/02_seeds.sql -f db/02b_seed_usuarios.sql \
  -f db/03_procedures.sql -f db/04_triggers.sql
```

O `01` derruba tudo antes de recriar, então rodar a sequência completa já é
o reset.

---

## Usuários de teste

| Papel | Usuário | Senha |
|---|---|---|
| Administrador | `admin` | `Tronus@adm1` |
| Professor (Python) | `prof_python` | `Python@prof1` |

As senhas estão gravadas como hash bcrypt, custo 10 — as mesmas do guia de
onboarding, para o time não precisar decorar senha nova. Existem para teste
e demonstração; antes de qualquer uso real, troque.

---

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| `could not translate host name` / `ENOTFOUND` | Usou a *direct connection* sem IPv6. Troque pelo session pooler |
| `password authentication failed` | Senha do banco errada, ou faltou trocar `SEU_REF` na string |
| `relation "reinos" does not exist` | Rodou o `02` antes do `01` |
| `function fn_titulo_por_estrelas does not exist` | Rodou o `04` antes do `03` |
| Projeto "paused" no painel | Ficou uma semana sem acesso. Despause no painel e configure o keep-alive |
| `prepared statement already exists` | API conectada no pooler de transação sem desligar prepared statements |
