import { MapPin } from "lucide-react";
import { Link } from "react-router";
import { LinkButton } from "../components/Button/Button.tsx";
import { SITE_CITY } from "../site.ts";
import styles from "./Header.module.css";
import { Logo } from "./Logo.tsx";

// Cabeçalho de todas as páginas. O campo de busca do protótipo entra quando a
// busca funcionar (PI-24, decisão FE7-A).
export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Logo />

        <nav className={styles.nav} aria-label="Conta">
          <span className={styles.location}>
            <MapPin size={18} aria-hidden="true" />
            {SITE_CITY}
          </span>
          <Link to="/entrar" className={styles.signIn}>
            Entrar
          </Link>
          <LinkButton to="/cadastrar">Cadastrar</LinkButton>
        </nav>
      </div>
    </header>
  );
}
