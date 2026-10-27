// Quem está logado, como a API responde em GET /api/me.
export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

// Pergunta à API quem está logado. Devolve null se ninguém estiver.
// Se a API der outro erro, ele sobe para a tela "Algo deu errado".
export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  const response = await fetch("/api/me");
  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`A API respondeu ${response.status} em /api/me`);
  }
  return response.json();
}
