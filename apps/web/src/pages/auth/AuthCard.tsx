import type { ReactNode } from "react";
import styles from "./AuthCard.module.css";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

// O cartão branco centralizado das telas de entrar e cadastrar (do protótipo).
export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <header className={styles.head}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </header>
        {children}
      </div>
    </section>
  );
}
