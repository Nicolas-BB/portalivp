import { isRouteErrorResponse, useRouteError } from "react-router";
import { LinkButton } from "../../components/Button/Button.tsx";
import { StatusMessage } from "../../components/StatusMessage/StatusMessage.tsx";
import { ErrorPage } from "../error/ErrorPage.tsx";

// Erro ao abrir a página da loja. Aparece dentro da moldura (com cabeçalho e
// rodapé), no lugar da página.
export function StoreErrorPage() {
  const error = useRouteError();

  // A API respondeu 404: a loja não existe ou não está ativa (decisão PG2).
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <StatusMessage
        title="Loja não encontrada"
        text="Esta loja não existe ou não está mais no portal."
      >
        <LinkButton to="/">Ver outras lojas</LinkButton>
      </StatusMessage>
    );
  }

  // Qualquer outro erro: a tela de sempre.
  return <ErrorPage />;
}
