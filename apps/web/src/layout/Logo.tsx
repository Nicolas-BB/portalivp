import { MapPin } from "lucide-react";
import { Link } from "react-router";
import { SITE_NAME } from "../site.ts";
import styles from "./Logo.module.css";

// O logo do site: o alfinete de mapa e o nome. Leva para a página inicial.
export function Logo() {
  return (
    <Link to="/" className={styles.logo} aria-label={`${SITE_NAME}: início`}>
      <span className={styles.icon}>
        <MapPin size={20} aria-hidden="true" />
      </span>
      <span>{SITE_NAME}</span>
    </Link>
  );
}
