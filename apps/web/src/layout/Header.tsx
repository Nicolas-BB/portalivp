import { MapPin } from "lucide-react";
import { Form, Link, useRouteLoaderData } from "react-router";
import { Button, LinkButton } from "../components/Button/Button.tsx";
import type { CurrentUser } from "../lib/current-user.ts";
import { SITE_CITY } from "../site.ts";
import styles from "./Header.module.css";
import { Logo } from "./Logo.tsx";

// Cabeçalho de todas as páginas. O campo de busca do protótipo entra quando a
// busca funcionar (PI-24, decisão FE7-A).
export function Header() {
  // Quem está logado, buscado pelo loader da moldura ("root") (decisão TL2-A).
  const user = useRouteLoaderData<CurrentUser | null>("root");

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Logo />

        <nav className={styles.nav} aria-label="Conta">
          <span className={styles.location}>
            <MapPin size={18} aria-hidden="true" />
            {SITE_CITY}
          </span>

          {user ? (
            <>
              {/* Só o primeiro nome, para caber no celular (decisão TL7). */}
              <span className={styles.greeting}>
                Olá, {user.name.split(" ")[0]}
              </span>
              <Form method="post" action="/sair">
                <Button type="submit" variant="secondary">
                  Sair
                </Button>
              </Form>
            </>
          ) : (
            <>
              <Link to="/entrar" className={styles.signIn}>
                Entrar
              </Link>
              <LinkButton to="/cadastrar">Cadastrar</LinkButton>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
