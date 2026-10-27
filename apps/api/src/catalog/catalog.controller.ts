import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import type { CategoryItem, CompanyCard } from "@portalivp/shared";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import { z } from "zod";
import { CatalogService } from "./catalog.service.js";

// O filtro de categoria, se vier, precisa ser um id (UUID) válido.
const companiesQuerySchema = z.object({
  category: z.uuid().optional(),
});

// Rotas públicas do catálogo (decisão HP9): qualquer visitante pode ver,
// sem login.
@AllowAnonymous()
@Controller()
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  // GET /api/categories
  @Get("categories")
  listCategories(): Promise<CategoryItem[]> {
    return this.catalog.listCategories();
  }

  // GET /api/companies e GET /api/companies?category=<id>
  @Get("companies")
  listCompanies(@Query() query: unknown): Promise<CompanyCard[]> {
    const parsed = companiesQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException("Categoria inválida.");
    }
    return this.catalog.listCompanies(parsed.data.category);
  }
}
