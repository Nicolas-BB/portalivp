import type { CompanyCard } from "@portalivp/shared";
import { MapPin, Store } from "lucide-react";
import styles from "./StoreCard.module.css";

// Cartão de uma loja (decisão HP4-A): capa, categorias, nome, descrição e bairro.
// O botão "Ver loja" entra quando a página da loja existir (PI-25).
export function StoreCard({ company }: { company: CompanyCard }) {
  return (
    <article className={styles.card}>
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
      </div>
    </article>
  );
}
