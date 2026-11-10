import { describe, expect, it } from "vitest";
import type { OpeningHoursRange } from "./catalog.js";
import { isOpenNow, localWeekdayAndTime } from "./opening-hours.js";

// Segunda a sexta: 08:00–12:00 e 14:00–18:00 (com intervalo de almoço).
const hours: OpeningHoursRange[] = [1, 2, 3, 4, 5].flatMap((weekday) => [
  { weekday, opensAt: "08:00", closesAt: "12:00" },
  { weekday, opensAt: "14:00", closesAt: "18:00" },
]);

// Os momentos são escritos em UTC (o "Z" no fim): Brasília fica 3 horas atrás.
// 2026-11-09 foi uma segunda-feira.
describe("isOpenNow", () => {
  it("converte para o horário de Brasília", () => {
    // 01:30 de terça em UTC ainda é 22:30 de segunda em Brasília.
    expect(localWeekdayAndTime(new Date("2026-11-10T01:30:00Z"))).toEqual({
      weekday: 1,
      time: "22:30",
    });
  });

  it("está aberta dentro de uma faixa", () => {
    // Segunda, 10:00 em Brasília.
    expect(isOpenNow(hours, new Date("2026-11-09T13:00:00Z"))).toBe(true);
  });

  it("está fechada no intervalo de almoço", () => {
    // Segunda, 13:00 em Brasília.
    expect(isOpenNow(hours, new Date("2026-11-09T16:00:00Z"))).toBe(false);
  });

  it("abre na hora exata da abertura e fecha na hora exata do fechamento", () => {
    // Segunda, 08:00 e 18:00 em Brasília.
    expect(isOpenNow(hours, new Date("2026-11-09T11:00:00Z"))).toBe(true);
    expect(isOpenNow(hours, new Date("2026-11-09T21:00:00Z"))).toBe(false);
  });

  it("está fechada num dia sem faixas", () => {
    // Domingo, 10:00 em Brasília.
    expect(isOpenNow(hours, new Date("2026-11-08T13:00:00Z"))).toBe(false);
  });
});
