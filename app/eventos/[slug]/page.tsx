import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ListaEventos from "@/components/ListaEventos";
import { buscarEvento, listarEventos } from "@/lib/api";
import { dataPorExtenso, duracao } from "@/lib/datas";
import "./detalhe-evento.css";

// O :slug do endereço. No Next 16, params é uma Promise: leva await.
type Props = { params: Promise<{ slug: string }> };

// Era o ResolveFn tituloDoEvento do eventos.routes.ts.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const evento = await buscarEvento(slug);
  return { title: evento?.titulo ?? "Evento não encontrado" };
}

export default async function DetalheEvento({ params }: Props) {
  const { slug } = await params;
  const e = await buscarEvento(slug);
  // Era o canMatch eventoExiste: slug que a API não conhece cai no not-found.tsx.
  if (!e) notFound();

  const relacionados = (await listarEventos())
    .filter((outro) => outro.categoria === e.categoria && outro.slug !== e.slug)
    .slice(0, 3);

  return (
    <>
      <nav aria-label="Trilha">
        <Link href="/eventos">← Todos os eventos</Link>
      </nav>

      <article className="evento">
        <div className="evento__corpo">
          <h1>{e.titulo}</h1>

          <p className="evento__meta">
            <time dateTime={e.inicioEm}>{dataPorExtenso(e.inicioEm)}</time>
            {e.cidade && <> · {e.cidade}</>} · {e.formato}
          </p>

          <p>{e.descricao}</p>

          <dl className="programacao">
            <dt>Organiza</dt>
            <dd>
              <Link href={`/organizadores/${e.organizadorSlug}`}>
                {e.organizador}
              </Link>
            </dd>
            <dt>Área</dt>
            <dd>{e.categoria}</dd>
            <dt>Nível</dt>
            <dd>{e.nivel}</dd>
            <dt>Duração</dt>
            <dd>{duracao(e.duracaoMin)}</dd>
            <dt>Vagas</dt>
            <dd>{e.vagas ?? "Sem limite"}</dd>
            <dt>Investimento</dt>
            <dd>{e.gratuito ? "Gratuito" : "Pago"}</dd>
          </dl>
        </div>
      </article>

      {relacionados.length > 0 && (
        <section aria-labelledby="tit-relacionados">
          <h2 id="tit-relacionados">Mais eventos de {e.categoria}</h2>
          <ListaEventos eventos={relacionados} />
        </section>
      )}
    </>
  );
}
