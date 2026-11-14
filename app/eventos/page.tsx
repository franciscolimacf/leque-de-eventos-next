import type { Metadata } from "next";
import Aviso from "@/components/Aviso";
import ListaEventos from "@/components/ListaEventos";
import { listarEventos } from "@/lib/api";

export const metadata: Metadata = { title: "Eventos" };

// Sem filtros por enquanto: a busca e os filtros voltam na aula 11, na URL.
export default async function Catalogo() {
  const eventos = await listarEventos();
  const total = eventos.length;
  const resumo = total === 1 ? "1 evento" : `${total} eventos`;

  return (
    <>
      <h1>Todos os eventos</h1>
      <h2>{resumo}</h2>
      {total > 0 ? (
        <ListaEventos eventos={eventos} />
      ) : (
        <Aviso icone="📅">Nenhum evento publicado por enquanto.</Aviso>
      )}
    </>
  );
}
