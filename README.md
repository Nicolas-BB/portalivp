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
- [Docker](https://www.docker.com/) para os serviços locais (banco e e-mail de teste), a partir da tarefa PI-8

## Como rodar

```bash
# 1. Instalar as dependências dos três projetos de uma vez
npm install

# 2. Em um terminal: a API (http://localhost:3000)
npm run dev:api

# 3. Em outro terminal: o front (o endereço aparece no terminal)
npm run dev:web
```

Mudou algo em `packages/shared` com tudo rodando? Deixe `npm run dev:shared` aberto num terceiro terminal: ele recompila o pacote a cada mudança.

## Comandos

Todos rodam na raiz do repositório.

| Comando                | O que faz                                                  |
| ---------------------- | ---------------------------------------------------------- |
| `npm run dev:api`      | Sobe a API em modo de desenvolvimento (reinicia ao salvar) |
| `npm run dev:web`      | Sobe o front em modo de desenvolvimento                    |
| `npm run dev:shared`   | Recompila o pacote compartilhado a cada mudança            |
| `npm run build`        | Compila o pacote compartilhado, a API e o front            |
| `npm run typecheck`    | Confere os tipos do TypeScript nos três projetos           |
| `npm run lint`         | Procura erros prováveis no código (Oxlint)                 |
| `npm run format`       | Formata o código (Prettier)                                |
| `npm run format:check` | Confere se o código está formatado                         |
| `npm test`             | Roda os testes                                             |

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
