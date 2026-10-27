import { Controller, Get } from "@nestjs/common";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";

// GET /api/me: os dados de quem está logado. Sem login, a resposta é 401
// (o guarda do Better Auth protege todas as rotas por padrão, decisão AU1-A).
@Controller("me")
export class MeController {
  @Get()
  me(@Session() session: UserSession) {
    const { id, name, email, role } = session.user;
    return { id, name, email, role };
  }
}
