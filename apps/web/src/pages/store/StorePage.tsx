import type { CompanyDetails } from "@portalivp/shared";
import {
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Store,
} from "lucide-react";
import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import {
  formatAddress,
  dayRanges,
  formatPrice,
  isWebLink,
  mapLink,
  paymentMethodLabels,
  phoneLink,
  serviceTypeLabels,
  socialPlatformLabels,
  weekdays,
  whatsappLink,
} from "./format.ts";
import type { StoreData } from "./loader.ts";
import styles from "./StorePage.module.css";

// Página da loja (PI-25), a partir do desenho loja.html do Carlos.
// Os dados vêm do storeLoader (loader.ts). Sem avaliações (LJ1-A) e sem o
// botão da "Minha lista", que entra na PI-38 (PG8).
export function StorePage() {
  const { company, today } = useLoaderData<StoreData>();
  const whatsapp = company.contacts.find((c) => c.type === "whatsapp");
  const phone = company.contacts.find((c) => c.type === "phone");
  const firstCategory = company.categories[0];

  return (
    <div className={styles.page}>
      {/* "Você está aqui": Início › categoria › loja */}
      <nav className={styles.breadcrumb} aria-label="Você está aqui">
        <ol>
          <li>
            <Link to="/">Início</Link>
          </li>
          {firstCategory && (
            <li>
              <Link to={`/?categoria=${firstCategory.slug}`}>
                {firstCategory.name}
              </Link>
            </li>
          )}
          <li aria-current="page">{company.name}</li>
        </ol>
      </nav>

      <section className={styles.hero} aria-labelledby="loja-titulo">
        {company.images[0] ? (
          <img
            className={styles.cover}
            src={`/api/uploads/${company.images[0]}`}
            alt=""
          />
        ) : (
          // Sem fotos: o quadro verde-claro com o ícone de loja, como no cartão (HP5).
          <div className={styles.coverPlaceholder} aria-hidden="true">
            <Store size={48} />
          </div>
        )}

        <div className={styles.heroBody}>
          {company.logoImage ? (
            <img
              className={styles.logo}
              src={`/api/uploads/${company.logoImage}`}
              alt={`Logo de ${company.name}`}
            />
          ) : (
            // Sem logo: a primeira letra do nome num quadro verde (LJ4-B).
            <span className={styles.logoInitial} aria-hidden="true">
              {company.name.charAt(0).toUpperCase()}
            </span>
          )}

          <div className={styles.heroInfo}>
            <div className={styles.heroTitle}>
              <h1 id="loja-titulo">{company.name}</h1>
              {/* Calculado pela API no horário de Brasília (LJ6-A). */}
              <span
                className={
                  company.isOpenNow ? styles.badgeOpen : styles.badgeClosed
                }
              >
                {company.isOpenNow ? "Aberto agora" : "Fechado agora"}
              </span>
            </div>
            <ul className={styles.meta}>
              <li>
                <MapPin size={16} aria-hidden="true" />
                {company.neighborhood}
              </li>
              <li>{company.categories.map((c) => c.name).join(" · ")}</li>
            </ul>
          </div>

          {/* Botões de contato, só se a loja informou (PG5). */}
          {(whatsapp || phone) && (
            <div className={styles.heroActions}>
              {whatsapp && (
                <a
                  className={styles.whatsappButton}
                  href={whatsappLink(whatsapp.value)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={20} aria-hidden="true" />
                  WhatsApp
                </a>
              )}
              {phone && (
                <a className={styles.phoneButton} href={phoneLink(phone.value)}>
                  <Phone size={20} aria-hidden="true" />
                  Ligar
                </a>
              )}
            </div>
          )}
        </div>

        <p className={styles.description}>{company.description}</p>
      </section>

      <div className={styles.layout}>
        {/* key: ao abrir outra loja, o filtro volta para "Todos". */}
        <Products key={company.id} products={company.products} />
        <StoreInfo company={company} today={today} />
      </div>
    </div>
  );
}

// Os produtos, com o filtro por categoria (decisão PG3-A): "Todos" e só as
// categorias que a loja usa. O filtro roda no navegador, sem nova busca na API.
function Products({ products }: { products: CompanyDetails["products"] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const productCategories = [...new Set(products.map((p) => p.category))].sort(
    (a, b) => a.localeCompare(b, "pt-BR"),
  );
  const visible = selected
    ? products.filter((product) => product.category === selected)
    : products;

  return (
    <section aria-labelledby="produtos-titulo">
      <div className={styles.sectionHead}>
        <h2 id="produtos-titulo" className={styles.sectionTitle}>
          Produtos e serviços
        </h2>
        {/* Com uma categoria só, o filtro não ajudaria em nada. */}
        {productCategories.length > 1 && (
          <div
            className={styles.filters}
            role="group"
            aria-label="Filtrar por categoria"
          >
            {[null, ...productCategories].map((category) => (
              <button
                key={category ?? "todos"}
                type="button"
                className={styles.filter}
                aria-pressed={selected === category}
                onClick={() => setSelected(category)}
              >
                {category ?? "Todos"}
              </button>
            ))}
          </div>
        )}
      </div>

      {products.length > 0 ? (
        <ul className={styles.products}>
          {visible.map((product) => (
            <li key={product.id} className={styles.product}>
              {product.image ? (
                <img
                  className={styles.productImage}
                  src={`/api/uploads/${product.image}`}
                  alt=""
                />
              ) : (
                <div className={styles.productPlaceholder} aria-hidden="true">
                  <Package size={36} />
                </div>
              )}
              <div className={styles.productBody}>
                <h3 className={styles.productName}>{product.name}</h3>
                {product.description && (
                  <p className={styles.productDescription}>
                    {product.description}
                  </p>
                )}
                <p
                  className={
                    product.price === null ? styles.noPrice : styles.price
                  }
                >
                  {formatPrice(product.price)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>Esta loja ainda não cadastrou produtos.</p>
      )}
    </section>
  );
}

// A coluna "Sobre a loja": horário, pagamento, atendimento, endereço,
// contatos e redes sociais. Cada bloco só aparece se a loja informou.
function StoreInfo({
  company,
  today,
}: {
  company: CompanyDetails;
  today: number;
}) {
  const otherContacts = company.contacts.filter((c) => c.type !== "whatsapp");
  const socialLinks = company.socialLinks.filter((link) => isWebLink(link.url));

  return (
    <aside className={styles.info} aria-labelledby="sobre-titulo">
      <h2 id="sobre-titulo" className={styles.infoTitle}>
        Sobre a loja
      </h2>

      <div className={styles.infoBlock}>
        <h3 className={styles.infoLabel}>Horário de funcionamento</h3>
        {/* Segunda primeiro, e o dia de hoje em negrito (PG4). */}
        <ul className={styles.hours}>
          {weekdays.map(({ weekday, name }) => {
            const ranges = dayRanges(company.openingHours, weekday);
            return (
              <li
                key={weekday}
                className={weekday === today ? styles.today : undefined}
              >
                <span className={styles.dayName}>
                  {name}
                  {weekday === today && " (hoje)"}
                </span>
                {/* Cada faixa fica inteira na linha; se faltar espaço, a
                    quebra acontece só no " e ". */}
                <span>
                  {ranges.length === 0
                    ? "Fechado"
                    : ranges.map((range, index) => (
                        <span key={range}>
                          {index > 0 && " e "}
                          <span className={styles.range}>{range}</span>
                        </span>
                      ))}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {company.paymentMethods.length > 0 && (
        <div className={styles.infoBlock}>
          <h3 className={styles.infoLabel}>Formas de pagamento</h3>
          <ul className={styles.chips}>
            {company.paymentMethods.map((method) => (
              <li key={method}>{paymentMethodLabels[method]}</li>
            ))}
          </ul>
        </div>
      )}

      {company.serviceTypes.length > 0 && (
        <div className={styles.infoBlock}>
          <h3 className={styles.infoLabel}>Atendimento</h3>
          <ul className={styles.chips}>
            {company.serviceTypes.map((type) => (
              <li key={type}>{serviceTypeLabels[type]}</li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.infoBlock}>
        <h3 className={styles.infoLabel}>Endereço</h3>
        <p>{formatAddress(company)}</p>
        <a
          className={styles.infoLink}
          href={mapLink(company)}
          target="_blank"
          rel="noreferrer"
        >
          <MapPin size={18} aria-hidden="true" />
          Ver no mapa
        </a>
      </div>

      {otherContacts.length > 0 && (
        <div className={styles.infoBlock}>
          <h3 className={styles.infoLabel}>Contato</h3>
          <ul className={styles.links}>
            {otherContacts.map((contact) => (
              <li key={`${contact.type}-${contact.value}`}>
                {contact.type === "email" ? (
                  <a
                    className={styles.infoLink}
                    href={`mailto:${contact.value}`}
                  >
                    <Mail size={18} aria-hidden="true" />
                    {contact.value}
                  </a>
                ) : (
                  <a
                    className={styles.infoLink}
                    href={phoneLink(contact.value)}
                  >
                    <Phone size={18} aria-hidden="true" />
                    {contact.value}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Redes sociais e site (LJ9). Ícone genérico com o nome escrito (PG10-A). */}
      {socialLinks.length > 0 && (
        <div className={styles.infoBlock}>
          <h3 className={styles.infoLabel}>Redes sociais</h3>
          <ul className={styles.links}>
            {socialLinks.map((link) => (
              <li key={link.url}>
                <a
                  className={styles.infoLink}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Globe size={18} aria-hidden="true" />
                  {socialPlatformLabels[link.platform]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
