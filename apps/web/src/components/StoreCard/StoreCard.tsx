import type { CompanyCard } from "@portalivp/shared";
import { ArrowRight, MapPin, Store } from "lucide-react";
import { Link } from "react-router";
import styles from "./StoreCard.module.css";

// Cartão de uma loja (decisão HP4-A): capa, categorias, nome, descrição e bairro.
// O cartão inteiro é um link para a página da loja (decisão PG6-A).
export function StoreCard({ company }: { company: CompanyCard }) {
  return (
    <Link to={`/lojas/${company.id}`} className={styles.card}>
      {company.coverImage ? (
        <img
          className={styles.cover}
          src={`/api/uploads/${company.coverImage}`}
          alt=""
        />
      ) : (
        // Sem fotos: o quadro verde-claro com o ícone de loja (decisão HP5).
        <div className={styles.placeholder} aria-hidden="true">
          <Store size={40} />
        </div>
      )}

      <div className={styles.body}>
        <ul className={styles.tags} aria-label="Categorias">
          {company.categories.slice(0, 3).map((category) => (
            <li key={category} className={styles.tag}>
              {category}
            </li>
          ))}
        </ul>
        <h3 className={styles.name}>{company.name}</h3>
        <p className={styles.description}>{company.description}</p>
        <p className={styles.neighborhood}>
          <MapPin size={16} aria-hidden="true" />
          {company.neighborhood}
        </p>
        <span className={styles.more}>
          Ver loja
          <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
