import { data } from "react-router";

// Busca dados da API (sempre por /api/..., decisão AU6-A) e devolve o JSON.
// Se a API responder 404, a tela de erro mostra "não encontrada"; com qualquer
// outro erro, ele sobe para a tela "Algo deu errado".
export async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`/api${path}`);
  if (response.status === 404) {
    throw data(null, { status: 404 });
  }
  if (!response.ok) {
    throw new Error(`A API respondeu ${response.status} em /api${path}`);
  }
  return response.json();
}
