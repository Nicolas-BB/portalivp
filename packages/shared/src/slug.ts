// Transforma um nome num "slug", o texto usado em endereços bonitos (decisão HP11-B).
// Ex.: "Pet Shop" → "pet-shop"; "Alimentação" → "alimentacao".
export function toSlug(name: string): string {
  return (
    name
      // Separa as letras dos acentos ("ã" vira "a" + "~")...
      .normalize("NFD")
      // ...e apaga os acentos.
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      // Tudo que não é letra ou número vira hífen (espaços, "&", "/"...).
      .replace(/[^a-z0-9]+/g, "-")
      // Sem hífen no começo nem no fim.
      .replace(/^-+|-+$/g, "")
  );
}
