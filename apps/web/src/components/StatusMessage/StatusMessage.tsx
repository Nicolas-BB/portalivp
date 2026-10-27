import type { ReactNode } from "react";
import styles from "./StatusMessage.module.css";

type StatusMessageProps = {
  title: string;
  text: string;
  // Botões ou links que aparecem embaixo (ex.: "Voltar ao início").
  children?: ReactNode;
};

// Mensagem centralizada, usada nas páginas "não encontrada" e de erro.
export function StatusMessage({ title, text, children }: StatusMessageProps) {
  return (
    <section className={styles.message}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.text}>{text}</p>
      {children && <div className={styles.actions}>{children}</div>}
    </section>
  );
}
