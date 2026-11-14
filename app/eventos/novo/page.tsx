import type { Metadata } from "next";
import FormularioEvento from "@/components/FormularioEvento";
import { listarOrganizadores } from "@/lib/api";
import { salvarEvento } from "../acoes";

export const metadata: Metadata = { title: "Publicar evento" };

/* /eventos/novo e /eventos/[slug] moram lado a lado, e o Next escolhe a pasta
   com nome fixo primeiro. No Angular, a ordem das rotas decidia. */
export default async function PublicarEvento() {
  const organizadores = await listarOrganizadores();
  return (
    <>
      <h1>Publicar evento</h1>
      {/* .bind(null, null): o primeiro argumento da ação fica preso — publicar. */}
      <FormularioEvento
        acao={salvarEvento.bind(null, null)}
        organizadores={organizadores}
      />
    </>
  );
}
