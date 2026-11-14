import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Aviso from "@/components/Aviso";
import ListaEventos from "@/components/ListaEventos";
import { buscarOrganizador, eventosDoOrganizador } from "@/lib/api";
import "./perfil-organizador.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const organizador = await buscarOrganizador(slug);
  return { title: organizador?.nome ?? "Organizador não encontrado" };
}

export default async function PerfilOrganizador({ params }: Props) {
  const { slug } = await params;
  // Os dois pedidos ao mesmo tempo: um não depende do outro.
  const [o, eventos] = await Promise.all([
    buscarOrganizador(slug),
    eventosDoOrganizador(slug),
  ]);
  if (!o) notFound();

  return (
    <>
      <nav aria-label="Trilha">
        <Link href="/eventos">← Todos os eventos</Link>
      </nav>

      <header className="perfil">
        <h1>{o.nome}</h1>
        <p>{o.sobre}</p>
        <p>
          <a href={o.site}>Site de {o.nome}</a>
        </p>
      </header>

      <section aria-labelledby="tit-eventos-organizador">
        <h2 id="tit-eventos-organizador">Eventos de {o.nome}</h2>
        {eventos.length > 0 ? (
          <ListaEventos eventos={eventos} />
        ) : (
          <Aviso icone="📅">Nenhum evento publicado por enquanto.</Aviso>
        )}
      </section>
    </>
  );
}
