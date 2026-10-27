import { Link } from "react-router";
import { SITE_NAME } from "../site.ts";
import styles from "./Footer.module.css";
import { Logo } from "./Logo.tsx";

// Ano do aviso de direitos, calculado uma vez quando o site carrega.
const CURRENT_YEAR = new Date().getFullYear();

// Rodapé enxuto (decisão FE3-A): só links para páginas que existem.
// Termos de Uso e Privacidade entram quando os textos ficarem prontos (PI-33).
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Logo />
            <p>
              Uma vitrine para o comércio de Ivaiporã. Valorize o que é daqui!
            </p>
          </div>

          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className={styles.title}>
              Explorar
            </h2>
            <ul className={styles.links}>
              <li>
                <Link to="/">Início</Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-account">
            <h2 id="footer-account" className={styles.title}>
              Sua conta
            </h2>
            <ul className={styles.links}>
              <li>
                <Link to="/entrar">Entrar</Link>
              </li>
              <li>
                <Link to="/cadastrar">Cadastrar</Link>
              </li>
            </ul>
          </nav>
        </div>

        <p className={styles.bottom}>
          © {CURRENT_YEAR} {SITE_NAME}. Feito para fortalecer o comércio local.
        </p>
      </div>
    </footer>
  );
}
