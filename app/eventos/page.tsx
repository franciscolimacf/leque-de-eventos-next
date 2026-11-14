import type { Metadata } from "next";
import Aviso from "@/components/Aviso";
import FiltrosEventos from "@/components/FiltrosEventos";
import ListaEventos from "@/components/ListaEventos";
import { listarEventos } from "@/lib/api";
import {
  aplicarFiltros,
  cidadesDoFormato,
  lerFiltros,
  type ParametrosDaBusca,
} from "@/lib/filtros";

export const metadata: Metadata = { title: "Eventos" };

// O que vem depois do ? no endereço. Como o params, é uma Promise.
type Props = { searchParams: Promise<ParametrosDaBusca> };

export default async function Catalogo({ searchParams }: Props) {
  const filtros = lerFiltros(await searchParams);
  const todos = await listarEventos();

  // O linkedSignal da cidade, no servidor: cidade que não existe no formato
  // escolhido volta a ser "todas as cidades".
  const cidades = cidadesDoFormato(todos, filtros.formato);
  const valendo = {
    ...filtros,
    cidade: cidades.includes(filtros.cidade) ? filtros.cidade : "",
  };

  // O mesmo aplicarFiltros do Angular, sem mudar uma linha.
  const visiveis = aplicarFiltros(todos, valendo);
  const total = visiveis.length;
  const resumo =
    total === 0
      ? "Nenhum evento encontrado"
      : total === 1
        ? "1 evento encontrado"
        : `${total} eventos encontrados`;

  return (
    <>
      <h1>Todos os eventos</h1>

      <FiltrosEventos filtros={valendo} cidades={cidades} />

      <h2 aria-live="polite">{resumo}</h2>
      {total > 0 ? (
        <ListaEventos eventos={visiveis} />
      ) : (
        <Aviso icone="🔍" acao={{ rotulo: "Limpar filtros", href: "/eventos" }}>
          Nenhum evento com esses filtros. Tente <strong>tirar um deles</strong>
          .
        </Aviso>
      )}
    </>
  );
}
