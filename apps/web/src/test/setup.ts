// Preparação que roda antes de todos os testes do front.

// Acrescenta verificações como expect(elemento).toBeVisible().
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Depois de cada teste, tira da "tela" o que foi desenhado, para um teste não
// interferir no outro.
afterEach(() => {
  cleanup();
});
