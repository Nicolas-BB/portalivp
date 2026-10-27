import { createBrowserRouter } from "react-router";
import { Layout } from "./layout/Layout.tsx";
import { ErrorPage } from "./pages/error/ErrorPage.tsx";
import { HomePage } from "./pages/home/HomePage.tsx";
import { NotFoundPage } from "./pages/not-found/NotFoundPage.tsx";

// O "mapa" do site: cada endereço e a página que ele mostra.
// As páginas que buscam dados ganham um loader (decisão I3-C).
export const router = createBrowserRouter([
  {
    // A moldura (cabeçalho e rodapé) envolve todas as páginas.
    Component: Layout,
    // Se algo der errado ao abrir uma página, mostra esta tela no lugar.
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: HomePage },
      // Qualquer endereço que não existe.
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
