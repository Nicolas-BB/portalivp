import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Testes do front (decisão TL11-A): rodam num navegador "de mentira" (jsdom),
// e a Testing Library usa as telas como uma pessoa usaria.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
