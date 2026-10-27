import { Controller, Get, Inject } from "@nestjs/common";
import { sql } from "drizzle-orm";
import { DATABASE, type Database } from "../database/database.module.js";

// GET /api/health: diz se a API está de pé e conseguindo falar com o banco (decisão K7-A).
@Controller("health")
export class HealthController {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  @Get()
  async check(): Promise<{ status: string }> {
    // Uma consulta mínima: se o banco não responder, a rota devolve erro 500.
    await this.db.execute(sql`select 1`);
    return { status: "ok" };
  }
}
