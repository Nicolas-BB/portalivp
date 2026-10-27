import { useRouteError } from "react-router";
import { Button } from "../../components/Button/Button.tsx";
import { StatusMessage } from "../../components/StatusMessage/StatusMessage.tsx";

// Mostrada quando algo dá errado ao abrir uma página (ex.: a API não respondeu).
// O detalhe técnico vai para o console do navegador, não para a tela.
export function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <StatusMessage
      title="Algo deu errado"
      text="Não conseguimos carregar esta página agora. Tente de novo em alguns instantes."
    >
      <Button onClick={() => window.location.reload()}>Tentar de novo</Button>
      <a href="/">Voltar ao início</a>
    </StatusMessage>
  );
}
