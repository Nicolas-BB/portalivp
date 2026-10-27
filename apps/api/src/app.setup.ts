import type { INestApplication } from "@nestjs/common";

// Ajustes da API usados tanto no main.ts quanto nos testes de ponta a ponta,
// para os testes rodarem a API exatamente como ela roda de verdade.
export function setupApp(app: INestApplication): void {
  // Todas as rotas da API começam com /api (ex.: /api/health),
  // porque o front e a API ficam no mesmo domínio (decisões I5-A e K7-A).
  app.setGlobalPrefix("api");
}
