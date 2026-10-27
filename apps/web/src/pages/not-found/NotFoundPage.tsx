import { LinkButton } from "../../components/Button/Button.tsx";
import { StatusMessage } from "../../components/StatusMessage/StatusMessage.tsx";

// Mostrada quando o endereço não existe no site.
export function NotFoundPage() {
  return (
    <StatusMessage
      title="Página não encontrada"
      text="O endereço que você abriu não existe ou foi removido."
    >
      <LinkButton to="/">Voltar ao início</LinkButton>
    </StatusMessage>
  );
}
