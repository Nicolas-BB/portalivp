<!--
O título do PR vira o commit na main e entra nas notas da release.
Formato: tipo(escopo): descrição [PI-xx]
Ex.: feat(auth): adiciona login com e-mail e senha [PI-10]
Tipos: feat, fix, perf, security, docs, refactor, test, chore, ci
-->

## Tarefa

PI-xx: <o que a tarefa pede, em uma frase>. Decisões em AAAA-MM-DD: <códigos>.

## O que muda

-

## ⚠️ Antes do deploy (na VPS)

<!-- Só se o PR exige variável nova no .env da VPS ou outra ação manual. Senão, apague esta seção. -->

## Pontos para revisar (decididos por quem abriu o PR)

<!--
Tudo o que não veio de uma decisão registrada no Notion: textos, nomes, valores, detalhes de implementação.
Depois do OK, troque o título para "(decididos por quem abriu o PR; aprovados em AAAA-MM-DD)".
Sem pontos: "Nenhuma decisão nova".
-->

1.

## Como testar

<!-- Não há staging: teste a branch localmente (npm run dev:api e npm run dev:web). -->

1.

## Testes

<!-- O que rodou (formatação, lint, tipos, testes, build) e o que foi conferido à mão. -->

-

## Checklist de simplicidade

- [ ] O código é simples e dá para explicar ao grupo
- [ ] Não adiciona passo, campo obrigatório ou tela ao fluxo principal (ou a justificativa está acima)

## Checklist de segurança

- [ ] Nenhum segredo, dado real ou dado pessoal em código, log, teste ou imagem Docker
- [ ] Entrada validada no servidor

## Documentação

- [ ] Notion atualizado: decisões, modelo do banco e tarefa (ou não se aplica)
