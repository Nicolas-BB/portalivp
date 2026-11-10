import { localWeekdayAndTime, type CompanyDetails } from "@portalivp/shared";
import type { LoaderFunctionArgs } from "react-router";
import { getJson } from "../../lib/api.ts";

export type StoreData = {
  company: CompanyDetails;
  // O dia de hoje em Brasília (0 = domingo), para destacar no horário (PG4).
  today: number;
};

// Antes de mostrar a página da loja (/lojas/<id>, decisão PG1-A), busca os
// dados dela na API. Se a loja não existir, aparece "Loja não encontrada".
export async function storeLoader({
  params,
}: LoaderFunctionArgs): Promise<StoreData> {
  const company = await getJson<CompanyDetails>(
    `/companies/${encodeURIComponent(params.id ?? "")}`,
  );
  return { company, today: localWeekdayAndTime(new Date()).weekday };
}
