import { useEffect, type RefObject } from "react";

// Depois de um envio com erro, coloca o cursor no primeiro campo com problema
// (decisão TL4-A). Ajuda quem usa teclado ou leitor de tela a ir direto ao erro.
export function useFocusFirstError(
  formRef: RefObject<HTMLFormElement | null>,
  result: unknown,
) {
  useEffect(() => {
    const firstInvalid = formRef.current?.querySelector<HTMLElement>(
      '[aria-invalid="true"]',
    );
    firstInvalid?.focus();
  }, [formRef, result]);
}
