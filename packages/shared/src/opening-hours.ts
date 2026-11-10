import type { OpeningHoursRange } from "./catalog.js";

// O portal é só de Ivaiporã, então o "agora" é sempre o horário de Brasília,
// mesmo que o servidor ou o celular estejam em outro fuso (decisão LJ6-A).
// Usado pela API (loja aberta agora) e pelo front (dia de hoje em negrito).
const TIME_ZONE = "America/Sao_Paulo";

const weekdayNumbers: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

// O dia da semana (0 = domingo) e a hora ("14:05") de um momento, em Brasília.
export function localWeekdayAndTime(now: Date): {
  weekday: number;
  time: string;
} {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const part = (type: string) =>
    parts.find((item) => item.type === type)?.value ?? "";

  return {
    weekday: weekdayNumbers[part("weekday")],
    time: `${part("hour")}:${part("minute")}`,
  };
}

// A loja está aberta se o horário atual cai dentro de alguma faixa do dia de
// hoje. Ex.: com 08:00–12:00 e 14:00–18:00, às 13:00 está fechada (almoço).
// A abertura conta como aberto; o fechamento, como fechado.
export function isOpenNow(hours: OpeningHoursRange[], now: Date): boolean {
  const { weekday, time } = localWeekdayAndTime(now);
  return hours.some(
    (range) =>
      range.weekday === weekday &&
      range.opensAt <= time &&
      time < range.closesAt,
  );
}
