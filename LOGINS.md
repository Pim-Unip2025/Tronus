# Logins Pré-cadastrados — TRONUS

Estes usuários são criados automaticamente na primeira inicialização do banco de dados
(ou na migração de um banco existente).

---

## 🛡️ Administrador

| Campo  | Valor                  |
|--------|------------------------|
| Nome   | `admin`                |
| E-mail | `admin@tronus.com`     |
| Senha  | `Tronus@adm1`          |
| Papel  | `admin`                |

**Acesso:** após login é redirecionado para `admin.html`  
**Pode:** ver estatísticas gerais, listar e excluir usuários

---

## 🎓 Professor — Python

| Campo   | Valor                       |
|---------|-----------------------------|
| Nome    | `prof_python`               |
| E-mail  | `prof.python@tronus.com`    |
| Senha   | `Python@prof1`              |
| Papel   | `professor`                 |
| Reino   | Python                      |

**Acesso:** após login é redirecionado para `professor.html`  
**Pode:** criar e excluir questões nas fases do Reino Python; buscar e visualizar desempenho de alunos por nome

---

## 🧙 Aluno (exemplo para testes)

Qualquer usuário cadastrado pela tela de registro (`register.html`) recebe automaticamente o papel `aluno`.

Exemplo sugerido para testes:

| Campo  | Valor              |
|--------|--------------------|
| Nome   | `aluno_teste`      |
| E-mail | `aluno@teste.com`  |
| Senha  | `Aluno123`         |
| Papel  | `aluno` (padrão)   |

**Acesso:** após login cria personagem e acessa os Reinos normalmente

---

## ⚠️ Observações

- As senhas são armazenadas em texto simples no banco SQLite local (sql.js / localStorage).
  Em produção real seria necessário aplicar hashing (ex.: bcrypt).
- O banco de dados fica no `localStorage` do navegador sob a chave `tronusDB`.
- Para forçar a recriação dos usuários especiais, limpe o `localStorage` do navegador
  (`localStorage.clear()`) e recarregue qualquer página do sistema.
