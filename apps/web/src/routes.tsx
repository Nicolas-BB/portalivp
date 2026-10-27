import { createBrowserRouter } from "react-router";
import { Layout } from "./layout/Layout.tsx";
import { fetchCurrentUser } from "./lib/current-user.ts";
import {
  redirectIfSignedIn,
  signInAction,
  signOutAction,
  signUpAction,
} from "./pages/auth/actions.ts";
import { SignInPage } from "./pages/auth/SignInPage.tsx";
import { SignUpPage } from "./pages/auth/SignUpPage.tsx";
import { ErrorPage } from "./pages/error/ErrorPage.tsx";
import { HomePage } from "./pages/home/HomePage.tsx";
import { homeLoader } from "./pages/home/loader.ts";
import { NotFoundPage } from "./pages/not-found/NotFoundPage.tsx";

// O "mapa" do site: cada endereço e a página que ele mostra.
// As páginas que buscam dados ganham um loader, e os formulários, uma action (decisão I3-C).
export const router = createBrowserRouter([
  {
    // "root": o nome usado pelo cabeçalho para ler quem está logado.
    id: "root",
    // A moldura (cabeçalho e rodapé) envolve todas as páginas.
    Component: Layout,
    // Antes de mostrar a moldura, pergunta à API quem está logado (decisão TL2-A).
    // O React Router roda de novo depois de cada formulário enviado com sucesso.
    loader: fetchCurrentUser,
    // Se algo der errado ao abrir uma página, mostra esta tela no lugar.
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, loader: homeLoader, Component: HomePage },
      {
        path: "entrar",
        loader: redirectIfSignedIn,
        action: signInAction,
        Component: SignInPage,
      },
      {
        path: "cadastrar",
        loader: redirectIfSignedIn,
        action: signUpAction,
        Component: SignUpPage,
      },
      // Só recebe o envio do botão "Sair" do cabeçalho; não tem tela.
      { path: "sair", action: signOutAction },
      // Qualquer endereço que não existe.
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
