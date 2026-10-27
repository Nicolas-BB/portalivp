import styles from "./HomePage.module.css";

// Página inicial PROVISÓRIA: só o destaque do protótipo.
// A página de verdade, com categorias e lojas, é o PI-23.
export function HomePage() {
  return (
    <section className={styles.hero}>
      <span className={styles.tag}>Apoie o empreendedor local</span>
      <h1 className={styles.title}>
        Valorize o comércio da{" "}
        <span className={styles.highlight}>sua cidade</span>
      </h1>
      <p className={styles.subtitle}>
        Encontre lojas, produtos e serviços bem pertinho de você.
      </p>
    </section>
  );
}
