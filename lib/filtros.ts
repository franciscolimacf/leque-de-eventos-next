import type { Evento, Formato } from "@/lib/tipos";

export type Filtros = {
  busca: string;
  formato: Formato | "todos";
  cidade: string;
  soGratuitos: boolean;
};

export function aplicarFiltros(
  eventos: readonly Evento[],
  f: Filtros,
): Evento[] {
  const busca = f.busca.trim().toLowerCase();
  return eventos
    .filter((e) => !f.soGratuitos || e.gratuito)
    .filter((e) => f.formato === "todos" || e.formato === f.formato)
    .filter((e) => f.cidade === "" || e.cidade === f.cidade)
    .filter(
      (e) =>
        busca === "" ||
        e.titulo.toLowerCase().includes(busca) ||
        e.organizador.toLowerCase().includes(busca),
    )
    .toSorted((a, b) => a.inicioEm.localeCompare(b.inicioEm));
}

export function cidadesDoFormato(
  eventos: readonly Evento[],
  formato: Formato | "todos",
): string[] {
  const cidades = eventos
    .filter((e) => formato === "todos" || e.formato === formato)
    .map((e) => e.cidade)
    .filter((cidade) => cidade !== undefined);
  return [...new Set(cidades)].toSorted((a, b) => a.localeCompare(b, "pt-BR"));
}

// (aula 11) O que vem depois do ? no endereço. Um parâmetro pode vir repetido
// (?formato=a&formato=b): por isso string | string[].
export type ParametrosDaBusca = Record<string, string | string[] | undefined>;

const FORMATOS: readonly Formato[] = ["Presencial", "Online", "Híbrido"];

// A URL é texto, e qualquer um digita qualquer coisa nela: o que não é
// reconhecido vira o valor padrão.
export function lerFiltros(parametros: ParametrosDaBusca): Filtros {
  const texto = (valor: string | string[] | undefined) =>
    typeof valor === "string" ? valor : "";
  return {
    busca: texto(parametros.busca),
    formato: FORMATOS.find((f) => f === parametros.formato) ?? "todos",
    cidade: texto(parametros.cidade),
    soGratuitos: parametros.gratuitos === "1",
  };
}

// O caminho de volta: dos filtros para o endereço. O que está no padrão fica
// de fora, e /eventos sem nada é "todos os eventos".
export function enderecoDosFiltros(f: Filtros): string {
  const parametros = new URLSearchParams();
  if (f.busca.trim() !== "") parametros.set("busca", f.busca.trim());
  if (f.formato !== "todos") parametros.set("formato", f.formato);
  if (f.cidade !== "") parametros.set("cidade", f.cidade);
  if (f.soGratuitos) parametros.set("gratuitos", "1");
  const consulta = parametros.toString();
  return consulta === "" ? "/eventos" : `/eventos?${consulta}`;
}
