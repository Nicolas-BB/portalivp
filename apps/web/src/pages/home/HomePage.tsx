import { Link, useLoaderData } from "react-router";
import { LinkButton } from "../../components/Button/Button.tsx";
import { StoreCard } from "../../components/StoreCard/StoreCard.tsx";
import { categoryIcon } from "./categoryIcons.ts";
import styles from "./HomePage.module.css";
import type { HomeData } from "./loader.ts";

// Página inicial (PI-23). Os dados vêm do homeLoader (loader.ts).
// Sem a barra de busca (HP2), as ofertas (HP6) e o convite ao comerciante (HP7),
// que entram quando a busca, as promoções e o cadastro de empresas existirem.
export function HomePage() {
  const { categories, companies, selectedCategory } = useLoaderData<HomeData>();

  return (
    <>
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

      <section className={styles.section} aria-labelledby="categorias-titulo">
        <h2 id="categorias-titulo" className={styles.sectionTitle}>
          Categorias
        </h2>
        {/* Clicar numa categoria filtra as lojas abaixo (decisão HP3-A).
            preventScrollReset: a página não volta para o topo ao filtrar. */}
        <ul className={styles.categories}>
          <li>
            <Link
              to="/"
              preventScrollReset
              className={styles.category}
              aria-current={selectedCategory === null ? "page" : undefined}
            >
              Todas
            </Link>
          </li>
          {categories.map((category) => {
            const Icon = categoryIcon(category.name);
            return (
              <li key={category.id}>
                <Link
                  to={`/?categoria=${category.slug}`}
                  preventScrollReset
                  className={styles.category}
                  aria-current={
                    selectedCategory === category.slug ? "page" : undefined
                  }
                >
                  <Icon size={24} aria-hidden="true" />
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="lojas-titulo">
        <h2 id="lojas-titulo" className={styles.sectionTitle}>
          Lojas de Ivaiporã
        </h2>
        <p className={styles.sectionSubtitle}>Conheça o comércio da cidade.</p>

        {companies.length > 0 ? (
          <ul className={styles.stores}>
            {companies.map((company) => (
              <li key={company.id}>
                <StoreCard company={company} />
              </li>
            ))}
          </ul>
        ) : (
          // Sem lojas (decisão HP8).
          <div className={styles.empty}>
            {selectedCategory ? (
              <>
                <p>Nenhuma loja nesta categoria ainda.</p>
                <LinkButton to="/" preventScrollReset variant="secondary">
                  Ver todas
                </LinkButton>
              </>
            ) : (
              <p>Ainda não há lojas no portal. Volte em breve!</p>
            )}
          </div>
        )}
      </section>
    </>
  );
}
