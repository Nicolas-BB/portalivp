# Portal de Apoio ao Comércio Local: instruções para agentes

Vitrine digital do comércio de Ivaiporã, para empresas da cidade divulgarem estabelecimentos e produtos e para os moradores encontrarem o que procuram (slug técnico `portalivp`). Projeto acadêmico (PI) feito em grupo. Monorepo com React + Vite (front) e NestJS (API), PostgreSQL 18 com Drizzle, Better Auth e Zod, numa **VPS própria com Docker Compose e Nginx**.
Produção (ainda não no ar): <https://portalivp.nbbrdev.com> · Repo: `Nicolas-BB/portalivp` (público).

## Fontes da verdade

Tudo fica no **Notion do grupo**, não no Linear nem em `docs/`:

- [Decisões técnicas](https://app.notion.com/p/405bb280d4ce81eab97efb3940d05bcb): cada decisão com código (ex.: `S6-B`), motivo e alternativas consideradas, e o **Histórico de mudanças** no fim. Leia antes de propor algo que contrarie uma decisão.
- [Modelo do banco (DER)](https://app.notion.com/p/405bb280d4ce8138a784ef5de5affdbb): aprovado; o schema do Drizzle segue ele.
- [Lista de tarefas](https://app.notion.com/p/363bb280d4ce8054aca3e8508dfbfdbe): toda tarefa de código tem um ID `PI-xx`, usado na branch e no título do PR.
- [Página do projeto](https://app.notion.com/p/b0cbb280d4ce835581fc0144ba78a81e): escopo, equipe e requisitos.

**Atualize o Notion na mesma sessão** sempre que mudar stack, schema, diagramas, regras ou o status de uma tarefa: registre a decisão (código + opção), o motivo, as alternativas consideradas e uma entrada no Histórico de mudanças. Não edite o trabalho de colegas (ex.: o Diagrama de Classe do Analista) sem combinar.

## Fase atual

**Apresentação parcial em 2026-11-11:** demonstração local de ponta a ponta (cadastro, login e página inicial com lojas de exemplo vindas do banco). Tarefas com esse prazo: PI-5 (concluída), PI-6, PI-8, PI-9, PI-10, PI-12, PI-13 e PI-23. Ordem combinada em 2026-10-26: PI-6 → PI-7 → PI-36 → as demais.

Lembretes:

- O `npm run db:seed` usa bairros fictícios ("Bairro Exemplo 1" a "6") até o Analista entregar a lista oficial de Ivaiporã (PI-32, decisão E1-A). Quando chegar, trocar os nomes em `apps/api/src/database/seeds/seed.ts`.
- `overrides` no `package.json` da raiz, a remover quando as dependências corrigirem: `multer` 2.5.0 (o Nest 12.2 trava o 2.4.0, vulnerável) e o `esbuild` dentro do `@esbuild-kit/core-utils` (o `drizzle-kit` traz uma versão vulnerável).
- O schema das tabelas do Better Auth (`apps/api/src/database/schema/auth.ts`) é **gerado** pelo `npm run auth:generate -w @portalivp/api`: não edite à mão, gere de novo (ex.: ao adicionar um plugin).
- O Dependabot ignora o TypeScript 7, o Vitest 5 e as versões grandes do `@types/node` (regras no `.github/dependabot.yml`). Reavaliar o TypeScript 7 quando o Nest CLI suportar e o Vitest 5 quando o modelo do `nest new` adotar; o `@types/node` sobe junto com o Node.
- O `gh` precisa estar com a conta **Nicolas-BB** ativa (`gh auth switch`) para mexer neste repositório.

Stack de ferramentas: Node 24 LTS, npm workspaces (`apps/web`, `apps/api`, `packages/shared`), TypeScript 6.0 (o 7 ainda não é suportado pelo Nest CLI), Oxlint, Prettier (estilo padrão), Vitest, Docker Compose para os serviços locais (`compose.dev.yaml`: Postgres 18 na 5432 e Mailpit na 8025/1025; o nome `compose.yaml` fica reservado para a produção), um `.env` só na raiz (validado com Zod ao subir a API), Drizzle com o driver `pg` (schema em `apps/api/src/database/schema/`, um arquivo por assunto; migrations em `apps/api/drizzle/`; scripts iniciais `db:seed`, que roda também na produção, e `db:seed:demo`, só no desenvolvimento). A API conecta com a role `portalivp_app`; as migrations usam a `portalivp_owner`. Todas as rotas da API ficam sob `/api`.

Login: Better Auth (`apps/api/src/auth/auth.ts`) ligado ao Nest pela `@thallesp/nestjs-better-auth`, que **protege todas as rotas por padrão**: rota pública precisa de `@AllowAnonymous()`, e o usuário logado vem de `@Session()`. As rotas de cadastro, login e logout são do próprio Better Auth (`/api/auth/...`). Os comandos do Better Auth (`auth:generate`, `auth:create-admin`) usam `src/auth/cli.ts`. Atenção: o Better Auth desliga a checagem de origem dentro dos testes; por isso o `disableOriginCheck: false` é explícito, e não deve ser removido.

## Como trabalhar com o usuário

- Siga a skill **`modo-de-trabalho`** (decisões, pt-BR, PRs, releases), com as diferenças deste projeto: **Notion** no lugar do Linear, **npm** no lugar do pnpm e **deploy manual** na VPS, sem workflow de produção.
- O usuário (Nícolas, responsável por front, back e DevOps) quer **participar das decisões técnicas e aprender**. **Nenhuma decisão sozinho, nem as pequenas** (valores, limites, nomes, textos, regras novas, configurações extras): explique o problema, as opções com prós e contras e uma recomendação, e pergunte **antes** de escrever. Se algo foi decidido sem ele, aponte em "Pontos para revisar" no PR.
- **Confira antes de recomendar:** versões e padrões das ferramentas mudam (ex.: o Nest 12 trocou o Jest pelo Vitest e o ESLint pelo Oxlint). Verifique com `npm view` ou rodando o gerador.
- Responda sempre em **pt-BR**.
- **Eu implemento, ele revisa:** um PR por tarefa, com a explicação do que e por quê; o merge (squash) é feito por ele, depois do OK.

## Regras de trabalho (definidas pelo usuário)

1. **Sempre use as ferramentas Write e Edit para criar ou editar arquivos.** Nada de scripts Python, `sed`, `awk`, heredocs ou redirecionamento de shell para modificar arquivos: o usuário acompanha as mudanças pelos diffs. Exceção: geradores e CLIs oficiais (`npm create vite`, `nest new` e `nest generate`, `drizzle-kit generate`, `npm install`) podem criar arquivos, e o Prettier pode reformatar; arquivos binários só com autorização do usuário; tudo é revisado no PR.
2. **Código sempre em inglês:** variáveis, funções, classes, tipos, arquivos de código, tabelas e colunas. Textos da interface, URLs e mensagens para o usuário final ficam em pt-BR.

## Regras inegociáveis

- **Simplicidade:** o grupo está começando na área. Código simples, que qualquer pessoa do grupo consiga ler e explicar; nada de lógica que um humano não consiga explicar. Nada adiciona passo, campo obrigatório ou tela ao fluxo principal sem justificativa.
- **Segurança:** validação no servidor (schemas Zod), rotas protegidas só com a sessão validada pelo Better Auth, banco com roles separadas (o app nunca conecta como dono ou superusuário).
- **Repo público:** nenhum segredo, dado real ou dado pessoal em código, docs, seeds, testes ou imagem Docker. Dados de teste sempre fictícios (`@example.com`). Segredos só nos `.env` da VPS e no `.env` local de quem desenvolve.
- Commits e **títulos de PR** em Conventional Commits, pt-BR, com o ID da tarefa (ex.: `feat(auth): adiciona login com e-mail e senha [PI-10]`): viram o histórico da `main` e as notas das releases.
- Produção só recebe **versões criadas pelo usuário** (release com tag `vX.Y.Z`), e o **deploy é manual na VPS**, feito por ele. O agente **nunca** cria tags, releases nem faz deploy.
- Backup do banco da produção antes de cada deploy.
