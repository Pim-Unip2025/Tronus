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
| Senha  | `Aluno@123`        |
| Papel  | `aluno` (padrão)   |

**Acesso:** após login cria personagem e acessa os Reinos normalmente

---

## ⚠️ Observações

- Estes usuários vêm dos seeds do banco (`db/02b_seed_usuarios.sql`), que já estão no Supabase.
- As senhas ficam guardadas só como hash bcrypt; a API nunca devolve a senha.
- Professor e admin não usam o "esqueci a senha": pedem a redefinição ao administrador.
