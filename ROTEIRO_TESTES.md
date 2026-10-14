# ROTEIRO DE TESTES — TRONUS
**Versão:** 1.0 · **Data:** 23/05/2026  
**Projeto:** PIM III — ADS · UNIP  
**Ambiente:** Navegador local (`127.0.0.1:5500`) com Live Server

---

## Pré-requisitos

1. Abrir o projeto com **Live Server** (VS Code) ou servidor local equivalente
2. Ter o DevTools aberto (F12 → Console) para verificar erros
3. Antes de cada bloco de testes, limpar o banco:
   ```
   localStorage.clear();  // cole no console do navegador
   ```
4. Contas pré-criadas (disponíveis após qualquer inicialização do banco):

| Perfil     | E-mail                    | Senha          |
|------------|---------------------------|----------------|
| Admin      | admin@tronus.com          | Tronus@adm1    |
| Professor  | prof.python@tronus.com    | Python@prof1   |
| Aluno      | *(criar no registro)*     | *(à sua escolha)* |

---

## CT-01 — Landing Page

**Página:** `index.html`

| # | Ação | Resultado esperado | ✔/✘ |
|---|------|--------------------|-----|
| 1 | Abrir `index.html` | Página carrega sem erros no console | |
| 2 | Rolar a página | Seções Hero, Como Funciona, Reinos, Equipe e Rodapé visíveis | |
| 3 | Clicar em **Entrar** na navbar | Redireciona para `login.html` | |
| 4 | Clicar em **Criar Conta** (hero ou navbar) | Redireciona para `register.html` | |
| 5 | Redimensionar para mobile (<480px) | Layout responsivo, sem sobreposições | |

---

## CT-02 — Registro de Aluno

**Página:** `register.html`

| # | Ação | Resultado esperado | ✔/✘ |
|---|------|--------------------|-----|
| 1 | Submeter formulário vazio | Mensagem de erro — campos obrigatórios | |
| 2 | Inserir e-mail inválido (`abc`) | Mensagem de e-mail inválido | |
| 3 | Inserir senhas diferentes | Mensagem "senhas não coincidem" | |
| 4 | Preencher todos os campos corretamente e submeter | Conta criada, redireciona para `character.html` | |
| 5 | Tentar registrar com o mesmo e-mail novamente | Mensagem de e-mail já cadastrado | |

> **Dados sugeridos:** Nome: `Aluno Teste` · E-mail: `aluno@teste.com` · Celular: `11999999999` · Senha: `Teste@123`

---

## CT-03 — Login

**Página:** `login.html`

| # | Ação | Resultado esperado | ✔/✘ |
|---|------|--------------------|-----|
| 1 | Login com e-mail e senha errados | Mensagem de credenciais inválidas | |
| 2 | Login com e-mail correto e senha errada | Mensagem de credenciais inválidas | |
| 3 | Login com aluno recém-cadastrado (sem personagem) | Redireciona para `character.html` | |
| 4 | Login com aluno que já tem personagem | Redireciona para `reinos.html` | |
| 5 | Login com `prof.python@tronus.com` / `Python@prof1` | Redireciona para `professor.html` | |
| 6 | Login com `admin@tronus.com` / `Tronus@adm1` | Redireciona para `admin.html` | |
| 7 | Marcar **Lembrar-me** e fechar/abrir aba | Usuário permanece logado | |

---

## CT-04 — Criação de Personagem

**Página:** `character.html`  
*(acessível somente ao logar com aluno sem personagem)*

| # | Ação | Resultado esperado | ✔/✘ |
|---|------|--------------------|-----|
| 1 | Tentar avançar sem selecionar gênero | Bloqueado ou aviso | |
| 2 | Selecionar gênero masculino ou feminino | Destaque visual na opção selecionada | |
| 3 | Avançar para Passo 2 | Barra de progresso indica Passo 2/3; avatares exibidos | |
| 4 | Selecionar um avatar | Destaque visual na opção selecionada | |
| 5 | Avançar para Passo 3 | Resumo com gênero e avatar escolhidos | |
| 6 | Clicar **Confirmar** | Personagem salvo; redireciona para `reinos.html` | |

---

## CT-05 — Tela de Reinos

**Página:** `reinos.html`

| # | Ação | Resultado esperado | ✔/✘ |
|---|------|--------------------|-----|
| 1 | Abrir `reinos.html` | Cards dos 5 reinos exibidos (Python, C++, Eng. Software, Banco de Dados, Redes) | |
| 2 | Verificar área do jogador | Nome do personagem, título "Plebeu", 0 estrelas | |
| 3 | Clicar no card **Python** | Redireciona para `trilha.html` com o Reino Python | |
| 4 | Abrir o menu lateral (ícone ≡) | Sidebar desliza com links de navegação | |
| 5 | Clicar em **Análise** na sidebar | Redireciona para `dashboard.html` | |

---

## CT-06 — Trilha do Reino

**Página:** `trilha.html` *(após entrar no Reino Python)*

| # | Ação | Resultado esperado | ✔/✘ |
|---|------|--------------------|-----|
| 1 | Verificar exibição das fases | Fase 1 desbloqueada; Fase 2 e 3 com cadeado | |
| 2 | Verificar estrelas iniciais | Todas as estrelas apagadas (0/9 ⭐ no topbar) | |
| 3 | Clicar na Fase 2 (bloqueada) | Nenhuma ação / cursor `not-allowed` | |
| 4 | Clicar na Fase 1 | Modal de quiz abre com a Fase 1 | |
| 5 | Fechar o quiz (✕) | Modal fecha; página recarrega | |

---

## CT-07 — Quiz

**Página:** `trilha.html` → Fase 1

| # | Ação | Resultado esperado | ✔/✘ |
|---|------|--------------------|-----|
| 1 | Abrir quiz da Fase 1 | Modal branco com cabeçalho "Fase 1", barra de progresso, questão 1 de 5 | |
| 2 | Clicar em uma alternativa **errada** | Botão fica vermelho; alternativa correta fica verde; feedback "✗ Incorreto" aparece | |
| 3 | Clicar em uma alternativa **correta** | Botão fica verde; feedback "✓ Correto!" aparece | |
| 4 | Tentar clicar em outra alternativa após responder | Bloqueado — sem efeito | |
| 5 | Clicar **Próxima →** | Avança para a questão 2; barra de progresso avança | |
| 6 | Responder todas as 5 questões | Botão muda para "Ver Resultado" na última | |
| 7 | Clicar **Ver Resultado** | Tela de resultado com estrelas e mensagem motivacional | |
| 8 | Verificar estrelas ganhas conforme acertos | 0 acertos = 0★ · 1–2 = 1★ · 3 = 2★ · 4–5 = 3★ | |
| 9 | Clicar **Concluir** | Modal fecha; página recarrega | |

---

## CT-08 — Progresso e Desbloqueio

**Página:** `trilha.html`  
*(após concluir CT-07 com pelo menos 1 acerto)*

| # | Ação | Resultado esperado | ✔/✘ |
|---|------|--------------------|-----|
| 1 | Verificar estrelas na Fase 1 | Exibe as estrelas conquistadas (1, 2 ou 3) | |
| 2 | Verificar Fase 2 | Cadeado removido — fase desbloqueada | |
| 3 | Verificar contador no topbar | Estrelas atualizadas (ex.: 2/9 ⭐) | |
| 4 | Clicar na Fase 2 | Quiz abre normalmente | |
| 5 | Repetir a Fase 1 com mais acertos | Estrelas são atualizadas **somente se o novo resultado for melhor** | |

---

## CT-09 — Dashboard

**Página:** `dashboard.html`

| # | Ação | Resultado esperado | ✔/✘ |
|---|------|--------------------|-----|
| 1 | Abrir `dashboard.html` após completar quizzes | Página carrega sem erros | |
| 2 | Verificar estatísticas do jogador | Total de estrelas, título, desempenho por fase exibidos | |
| 3 | Verificar distribuição por reino | Dados do Reino Python refletidos corretamente | |

---

## CT-10 — Sidebar e Tema

**Qualquer página com sidebar**

| # | Ação | Resultado esperado | ✔/✘ |
|---|------|--------------------|-----|
| 1 | Clicar no ícone ≡ | Sidebar abre com overlay escuro | |
| 2 | Clicar fora da sidebar | Sidebar fecha | |
| 3 | Verificar que o ícone ≡ não sobrepõe o botão Voltar | Botão Voltar visível e clicável | |
| 4 | Clicar em **Trocar Tema** | Tema alterna entre escuro e claro | |
| 5 | Verificar modo claro | Topbar, textos e cards legíveis (fundo claro, texto escuro) | |
| 6 | Clicar em **Sair** | Caixa de confirmação: "Tem certeza que deseja sair?" | |
| 7 | Confirmar saída | Sessão encerrada; redireciona para `login.html` | |
| 8 | Cancelar saída | Permanece na página atual | |

---

## CT-11 — Glossário LIBRAS

**Página:** `trilha.html`

| # | Ação | Resultado esperado | ✔/✘ |
|---|------|--------------------|-----|
| 1 | Clicar no botão flutuante **LIBRAS** | Modal abre com fundo branco e texto preto | |
| 2 | Verificar os 10 termos | Cards com termo, descrição e link "Ver sinal ↗" | |
| 3 | Clicar em **Ver sinal ↗** | Abre o Spread The Sign em nova aba | |
| 4 | Clicar fora do modal ou no ✕ | Modal fecha | |

---

## CT-12 — Recuperação de Senha

**Página:** `forgot_password.html`

| # | Ação | Resultado esperado | ✔/✘ |
|---|------|--------------------|-----|
| 1 | Inserir celular **não cadastrado** | Mensagem: "Celular não encontrado" | |
| 2 | Inserir celular do aluno cadastrado (ex.: `11999999999`) | Avanço para Passo 2; código exibido | |
| 3 | Inserir código incorreto | Mensagem de código inválido | |
| 4 | Inserir código correto | Campo para nova senha aparece | |
| 5 | Definir nova senha e confirmar | Senha atualizada; redireciona para `login.html` | |
| 6 | Login com a nova senha | Login efetuado com sucesso | |

---

## CT-13 — Painel do Professor

**Página:** `professor.html`  
**Login:** `prof.python@tronus.com` / `Python@prof1`

### CT-13A — Controle de Acesso

| # | Ação | Resultado esperado | ✔/✘ |
|---|------|--------------------|-----|
| 1 | Tentar acessar `professor.html` sem login | Redireciona para `login.html` | |
| 2 | Tentar acessar `professor.html` logado como aluno | Redireciona para `login.html` | |
| 3 | Acessar logado como professor | Painel carrega; badge exibe nome do professor | |
| 4 | Verificar título das abas | "Gerenciar Questões — Reino Python" e "Desempenho dos Alunos — Reino Python" | |

### CT-13B — Gerenciar Questões

| # | Ação | Resultado esperado | ✔/✘ |
|---|------|--------------------|-----|
| 1 | Selecionar **Fase 1** no dropdown | Lista as 5 questões seedadas; botão "+ Nova Questão" aparece | |
| 2 | Clicar **+ Nova Questão** | Formulário expande | |
| 3 | Submeter formulário **sem enunciado** | Toast: "Preencha o enunciado" | |
| 4 | Preencher enunciado, **sem marcar alternativa correta** | Toast: "Marque a alternativa correta" | |
| 5 | Preencher enunciado + 1 alternativa e marcar correta | Toast: "Preencha ao menos 2 alternativas" | |
| 6 | Criar questão com **2 alternativas** (A correta, B errada) deixando C/D/E em branco | Questão salva com 2 alternativas; aparece na lista | |
| 7 | Criar questão com **5 alternativas** | Questão salva com 5 alternativas | |
| 8 | Clicar **Excluir** em uma questão | Confirmação exibida; ao confirmar, questão removida da lista | |

### CT-13C — Desempenho dos Alunos

| # | Ação | Resultado esperado | ✔/✘ |
|---|------|--------------------|-----|
| 1 | Digitar 1 caractere no campo de busca | Mensagem: "Digite ao menos 2 caracteres" | |
| 2 | Buscar nome de aluno inexistente | Mensagem: "Nenhum aluno encontrado" | |
| 3 | Buscar aluno que completou quizzes (ex.: `Aluno`) | Card do aluno exibido com total de estrelas | |
| 4 | Clicar no card do aluno | Tabela de desempenho expandida | |
| 5 | Verificar filtro de reino | **Somente linhas do Reino Python** exibidas (não C++, Eng. Software etc.) | |
| 6 | Clicar novamente no card | Tabela colapsa | |

---

## CT-14 — Painel do Administrador

**Página:** `admin.html`  
**Login:** `admin@tronus.com` / `Tronus@adm1`

### CT-14A — Controle de Acesso

| # | Ação | Resultado esperado | ✔/✘ |
|---|------|--------------------|-----|
| 1 | Tentar acessar `admin.html` sem login | Redireciona para `login.html` | |
| 2 | Tentar acessar `admin.html` logado como aluno | Redireciona para `login.html` | |
| 3 | Acessar logado como admin | Painel carrega; badge exibe "admin" | |

### CT-14B — Estatísticas e Usuários

| # | Ação | Resultado esperado | ✔/✘ |
|---|------|--------------------|-----|
| 1 | Verificar cards de estatísticas | Usuários, Alunos, Personagens, Questões, Respostas com números corretos | |
| 2 | Verificar tabela de usuários | Lista com colunas: #, Nome, E-mail, Papel, Ação | |
| 3 | Verificar linha do admin | Coluna Ação exibe "protegido" (sem botão excluir) | |
| 4 | Verificar linha do professor | Coluna Ação exibe "protegido" | |
| 5 | Clicar **Excluir** em um aluno | Diálogo de confirmação exibido | |
| 6 | Cancelar exclusão | Aluno permanece na tabela | |
| 7 | Confirmar exclusão | Linha removida; contadores de Usuários e Alunos decrementados | |

---

## CT-15 — Testes de Regressão

Após todas as correções aplicadas, verificar que os bugs anteriores não reaparecem:

| # | Cenário | Resultado esperado | ✔/✘ |
|---|---------|-------------------|-----|
| 1 | Clicar na Fase 1 da trilha | Quiz abre (não falha silenciosamente) | |
| 2 | Concluir quiz e recarregar a trilha | Estrelas exibidas; próxima fase desbloqueada | |
| 3 | Abrir `professor.html` | Nenhum erro no console | |
| 4 | Abrir `admin.html` | Nenhum erro no console | |
| 5 | Abrir `trilha.html` | Nenhum erro `q.nivel_dificuldade` no console | |
| 6 | Sidebar em `admin.html` | Botão Voltar visível e não sobreposto | |
| 7 | Modo claro em `admin.html` | Textos do topbar legíveis | |
| 8 | Modal LIBRAS | Fundo branco, texto preto | |
| 9 | Modal de Quiz | Fundo branco, texto preto | |

---

## Critérios de Aprovação

| Bloco | Casos | Mínimo para aprovação |
|-------|-------|-----------------------|
| CT-01 Landing | 5 | 5/5 |
| CT-02 Registro | 5 | 4/5 |
| CT-03 Login | 7 | 6/7 |
| CT-04 Personagem | 6 | 5/6 |
| CT-05 Reinos | 5 | 5/5 |
| CT-06 Trilha | 5 | 5/5 |
| CT-07 Quiz | 9 | 8/9 |
| CT-08 Progresso | 5 | 5/5 |
| CT-09 Dashboard | 3 | 2/3 |
| CT-10 Sidebar/Tema | 8 | 7/8 |
| CT-11 LIBRAS | 4 | 4/4 |
| CT-12 Recuperação | 6 | 4/6 |
| CT-13 Professor | 14 | 12/14 |
| CT-14 Admin | 8 | 7/8 |
| CT-15 Regressão | 9 | 9/9 |
| **TOTAL** | **99** | **88/99 (≥89%)** |

---

## Observações

- **Reset do banco:** `localStorage.clear(); location.reload()` no console do navegador
- **Banco persiste** entre recarregamentos — use reset entre blocos independentes
- Senhas são armazenadas em texto simples (escopo acadêmico — sem hash por limitação do ambiente client-side)
- Os reinos C++, Engenharia de Software, Banco de Dados e Redes **não possuem questões seedadas** — comportamento esperado: "Este reino ainda não tem questões cadastradas"
- `forgot_password.html` usa código de recuperação **simulado** (exibido em tela por ser ambiente local sem SMS)
