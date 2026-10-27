# Portal de Apoio ao Comércio Local

Vitrine digital do comércio de Ivaiporã: as empresas da cidade divulgam seus estabelecimentos e produtos, e os moradores encontram o que procuram perto de casa.

Projeto acadêmico (PI) em desenvolvimento.

## Stack

| Parte             | Tecnologia                                                          |
| ----------------- | ------------------------------------------------------------------- |
| Front             | React + Vite + React Router, com componentes próprios e CSS Modules |
| API               | NestJS, com Better Auth para o login                                |
| Banco             | PostgreSQL 18, com Drizzle                                          |
| Validação         | Zod, com os schemas compartilhados entre o front e a API            |
| Testes            | Vitest                                                              |
| Lint e formatação | Oxlint e Prettier                                                   |

## Pré-requisitos

- [Node.js 24](https://nodejs.org/) (LTS), que já vem com o npm
- [Docker](https://www.docker.com/) para os serviços locais (banco e e-mail de teste)

## Como rodar

```bash
# 1. Instalar as dependências dos três projetos de uma vez
npm install

# 2. Criar o .env na raiz, copiando o .env.example
#    (os valores do exemplo já servem para o desenvolvimento)

# 3. Subir o banco (Postgres) e a caixa de e-mail falsa (Mailpit)
npm run services:up

# 4. Criar as tabelas e preencher as listas fixas (categorias e bairros)
npm run db:migrate
npm run db:seed

# 5. (Opcional) Criar lojas e produtos de exemplo. Nunca na produção!
npm run db:seed:demo

# 6. Em um terminal: a API (http://localhost:3000/api)
npm run dev:api

# 7. Em outro terminal: o front (o endereço aparece no terminal)
npm run dev:web
```

Para conferir se a API está conectada ao banco, abra <http://localhost:3000/api/health>: a resposta deve ser `{"status":"ok"}`.

Os e-mails que a API envia em desenvolvimento não saem para a internet: eles aparecem no Mailpit, em <http://localhost:8025>.

No banco, a API conecta com a role `portalivp_app`, que só lê e grava dados. Quem cria e altera tabelas são as migrations, com a role dona `portalivp_owner`. As duas são criadas pelo script `database/init/01-roles.sh` na primeira vez que o Postgres sobe.

Mudou algo em `packages/shared` com tudo rodando? Deixe `npm run dev:shared` aberto num terceiro terminal: ele recompila o pacote a cada mudança.

## Comandos

Todos rodam na raiz do repositório.

| Comando                 | O que faz                                                  |
| ----------------------- | ---------------------------------------------------------- |
| `npm run services:up`   | Sobe o banco e o Mailpit (Docker)                          |
| `npm run services:down` | Desliga o banco e o Mailpit (os dados continuam salvos)    |
| `npm run db:generate`   | Gera uma migration a partir das mudanças no schema         |
| `npm run db:migrate`    | Aplica as migrations no banco                              |
| `npm run db:seed`       | Preenche categorias e bairros (pode rodar de novo)         |
| `npm run db:seed:demo`  | Cria lojas e produtos de exemplo (só no desenvolvimento)   |
| `npm run dev:api`       | Sobe a API em modo de desenvolvimento (reinicia ao salvar) |
| `npm run dev:web`       | Sobe o front em modo de desenvolvimento                    |
| `npm run dev:shared`    | Recompila o pacote compartilhado a cada mudança            |
| `npm run build`         | Compila o pacote compartilhado, a API e o front            |
| `npm run typecheck`     | Confere os tipos do TypeScript nos três projetos           |
| `npm run lint`          | Procura erros prováveis no código (Oxlint)                 |
| `npm run format`        | Formata o código (Prettier)                                |
| `npm run format:check`  | Confere se o código está formatado                         |
| `npm test`              | Roda os testes                                             |

## Estrutura

```
apps/
  web/        Front (React + Vite)
  api/        API (NestJS)
packages/
  shared/     Código usado pelo front e pela API (schemas Zod)
```

O repositório é um monorepo com **npm workspaces**: o `package.json` da raiz diz onde estão os três projetos, o `npm install` instala tudo de uma vez e o front e a API usam o `@portalivp/shared` como se fosse uma biblioteca.

## Como contribuir

1. Pegue uma tarefa na [Lista de tarefas](https://app.notion.com/p/363bb280d4ce8054aca3e8508dfbfdbe) e anote o ID dela (ex.: `PI-10`).
2. Crie uma branch a partir da `main`: `<tipo>/PI-xx-descricao-curta` (ex.: `feat/PI-10-login`).
3. Abra um PR. O título segue o padrão `tipo(escopo): descrição [PI-xx]`, em português (ex.: `feat(auth): adiciona login com e-mail e senha [PI-10]`). O corpo já vem com o modelo para preencher.
4. A `main` é protegida: tudo entra por PR, e o merge é sempre "squash" (um commit por PR).

Tipos: `feat` (funcionalidade), `fix` (correção), `perf`, `security`, `docs`, `refactor`, `test`, `chore` (manutenção) e `ci`.

## Documentação

A documentação fica no Notion do grupo:

- [Portal de Apoio ao Comércio Local](https://app.notion.com/p/b0cbb280d4ce835581fc0144ba78a81e): objetivo, escopo, equipe e requisitos
- [Decisões técnicas](https://app.notion.com/p/405bb280d4ce81eab97efb3940d05bcb): cada decisão, o motivo e as alternativas consideradas
- [Modelo do banco (DER)](https://app.notion.com/p/405bb280d4ce8138a784ef5de5affdbb)
- [Lista de tarefas](https://app.notion.com/p/363bb280d4ce8054aca3e8508dfbfdbe)
