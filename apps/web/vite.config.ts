import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Tudo que começa com /api vai para a API (decisão AU6-A). Assim o front
    // sempre chama /api/..., como na produção, onde o Nginx faz o mesmo papel.
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
