import type { EventoNovo } from "@/lib/evento-novo";
import type { Evento, Organizador } from "@/lib/tipos";

/* O mesmo endereço do API_URL do Angular (aula 08), com o SEU usuário: a sala
   que já tem os eventos que você publicou. Aqui não há InjectionToken — quem
   chama é o servidor, e um arquivo só sabe o endereço. */
const API =
  "https://aulas.umlequedetecnologia.com.br/api/leque-de-eventos/sala/franciscolimacf";

/* (aula 11) Cada resposta fica guardada 60 segundos, com a etiqueta "eventos".
   É o que deixa a página ser montada de novo sozinha, sem novo deploy, e o
   que a aula 12 vai avisar depois de gravar. */
async function ler<T>(caminho: string): Promise<T | undefined> {
  const resposta = await fetch(`${API}${caminho}`, {
    next: { revalidate: 60, tags: ["eventos"] },
  });
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

export async function listarOrganizadores(): Promise<Organizador[]> {
  return (await ler<Organizador[]>("/organizadores")) ?? [];
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

/* ─── (aula 12) GRAVAR ─────────────────────────────────────────────────────
   O EventosApi da aula 08, no servidor. Recusa da API (422, 409) não é
   exceção: é conversa, e volta para o formulário — o "campos" dela tem o
   mesmo formato do "erros" do Estado. Exceção é a API fora do ar (5xx). */
export type Gravou<T> =
  | { ok: true; dado: T }
  | { ok: false; erros: Record<string, string>; mensagem: string };

async function gravar<T>(
  metodo: string,
  caminho: string,
  corpo?: unknown,
): Promise<Gravou<T>> {
  const resposta = await fetch(`${API}${caminho}`, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
  if (resposta.status >= 500)
    throw new Error(`${metodo} ${caminho} respondeu ${resposta.status}`);
  if (resposta.status === 204) return { ok: true, dado: null as T };
  const lido = await resposta.json();
  if (resposta.ok) return { ok: true, dado: lido };
  return { ok: false, erros: lido.campos ?? {}, mensagem: lido.erro };
}

export async function criarEvento(evento: EventoNovo) {
  return gravar<Evento>("POST", "/eventos", evento);
}

export async function editarEvento(slug: string, evento: EventoNovo) {
  return gravar<Evento>("PUT", `/eventos/${encodeURIComponent(slug)}`, evento);
}

export async function removerEvento(slug: string) {
  return gravar<null>("DELETE", `/eventos/${encodeURIComponent(slug)}`);
}
