import {
  HeartPulse,
  PawPrint,
  Shirt,
  ShoppingCart,
  Sparkles,
  Store,
  Utensils,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from "lucide-react";

// Ícone de cada categoria, pelo nome (decisão HP3-A).
// Uma categoria nova, que não está aqui, ganha o ícone de loja.
const icons: Record<string, LucideIcon> = {
  Alimentação: Utensils,
  Restaurantes: UtensilsCrossed,
  Mercados: ShoppingCart,
  "Pet Shop": PawPrint,
  Saúde: HeartPulse,
  Beleza: Sparkles,
  Moda: Shirt,
  Serviços: Wrench,
};

export function categoryIcon(name: string): LucideIcon {
  return icons[name] ?? Store;
}
