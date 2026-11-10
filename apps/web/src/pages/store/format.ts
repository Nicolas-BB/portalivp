import type {
  CompanyDetails,
  OpeningHoursRange,
  PaymentMethod,
  ServiceType,
  SocialPlatform,
} from "@portalivp/shared";
import { SITE_CITY } from "../../site.ts";

// Textos e formatos da página da loja. O banco guarda códigos em inglês
// (ex.: "credit_card"); a tela mostra os nomes em português.

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: "Dinheiro",
  pix: "Pix",
  credit_card: "Cartão de crédito",
  debit_card: "Cartão de débito",
  meal_voucher: "Vale-alimentação",
};

export const serviceTypeLabels: Record<ServiceType, string> = {
  in_person: "Atendimento no local",
  online: "Atendimento on-line",
  delivery: "Entrega",
  pickup: "Retirada no local",
};

export const socialPlatformLabels: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  website: "Site",
};

// Os dias da semana, começando pela segunda (decisão PG4).
// weekday: 0 = domingo ... 6 = sábado, como no banco.
export const weekdays = [
  { weekday: 1, name: "Segunda" },
  { weekday: 2, name: "Terça" },
  { weekday: 3, name: "Quarta" },
  { weekday: 4, name: "Quinta" },
  { weekday: 5, name: "Sexta" },
  { weekday: 6, name: "Sábado" },
  { weekday: 0, name: "Domingo" },
];

// As faixas de um dia, ex.: ["8:00–12:00", "14:00–18:00"]. A página mostra
// "8:00–12:00 e 14:00–18:00", ou "Fechado" se o dia não tem faixas (PG4).
export function dayRanges(
  hours: OpeningHoursRange[],
  weekday: number,
): string[] {
  return (
    hours
      .filter((range) => range.weekday === weekday)
      // "08:00" vira "8:00", mais fácil de ler.
      .map(
        (range) =>
          `${range.opensAt.replace(/^0/, "")}–${range.closesAt.replace(/^0/, "")}`,
      )
  );
}

// Preço em reais (ex.: "R$ 16,90"); sem preço, "Consulte o preço" (P5).
export function formatPrice(price: number | null): string {
  if (price === null) {
    return "Consulte o preço";
  }
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Só os números do telefone, ex.: "(43) 90000-0001" vira "43900000001".
function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

// Link que abre a conversa no WhatsApp, com o código do Brasil (55) na frente (PG5).
export function whatsappLink(phone: string): string {
  return `https://wa.me/55${digitsOnly(phone)}`;
}

// Link que liga para o telefone, no celular (PG5).
export function phoneLink(phone: string): string {
  return `tel:+55${digitsOnly(phone)}`;
}

// O endereço numa linha só, ex.: "Rua Exemplo, 100, Sala 2 – Centro – Ivaiporã, PR" (LJ7).
export function formatAddress(company: CompanyDetails): string {
  const { street, number, complement } = company.address;
  const streetLine = [street, number, complement].filter(Boolean).join(", ");
  return `${streetLine} – ${company.neighborhood} – ${SITE_CITY}`;
}

// Só endereços da web viram link. Os links das redes são digitados pela loja;
// isto impede que algo como "javascript:..." vire um link na página.
// (O cadastro também vai validar, no servidor.)
export function isWebLink(url: string): boolean {
  return url.startsWith("https://") || url.startsWith("http://");
}

// Link "Ver no mapa" (LJ7): pelo ponto marcado, se a loja marcou; senão,
// pela busca do endereço.
export function mapLink(company: CompanyDetails): string {
  const query = company.location
    ? `${company.location.latitude},${company.location.longitude}`
    : formatAddress(company);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
