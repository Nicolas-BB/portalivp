import { Outlet } from "react-router";
import { Footer } from "./Footer.tsx";
import { Header } from "./Header.tsx";
import styles from "./Layout.module.css";

// A moldura de todas as páginas: cabeçalho, o conteúdo da página e o rodapé.
// <Outlet /> é o lugar onde o React Router coloca a página do endereço atual.
export function Layout() {
  return (
    <div className={styles.layout}>
      {/* Quem navega pelo teclado pode pular direto para o conteúdo. */}
      <a href="#conteudo" className={styles.skipLink}>
        Ir para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
