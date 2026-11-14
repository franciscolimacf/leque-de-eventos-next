import type { Evento, Organizador } from "@/lib/tipos";

/* O mesmo endereço do API_URL do Angular (aula 08), com o SEU usuário: a sala
   que já tem os eventos que você publicou. Aqui não há InjectionToken — quem
   chama é o servidor, e um arquivo só sabe o endereço. */
const API =
  "https://aulas.umlequedetecnologia.com.br/api/leque-de-eventos/sala/franciscolimacf";

async function ler<T>(caminho: string): Promise<T | undefined> {
  const resposta = await fetch(`${API}${caminho}`);
  if (resposta.status === 404) return undefined;
  if (!resposta.ok)
    throw new Error(`GET ${caminho} respondeu ${resposta.status}`);
  return resposta.json();
}

export async function listarEventos(): Promise<Evento[]> {
  return (await ler<Evento[]>("/eventos")) ?? [];
}

export async function buscarEvento(slug: string): Promise<Evento | undefined> {
  return ler<Evento>(`/eventos/${encodeURIComponent(slug)}`);
}

export async function buscarOrganizador(
  slug: string,
): Promise<Organizador | undefined> {
  return ler<Organizador>(`/organizadores/${encodeURIComponent(slug)}`);
}

export async function eventosDoOrganizador(slug: string): Promise<Evento[]> {
  return (
    (await ler<Evento[]>(
      `/organizadores/${encodeURIComponent(slug)}/eventos`,
    )) ?? []
  );
}
