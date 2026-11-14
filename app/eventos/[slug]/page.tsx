import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ListaEventos from "@/components/ListaEventos";
import { buscarEvento, listarEventos } from "@/lib/api";
import { dataPorExtenso, duracao } from "@/lib/datas";
import type { Evento } from "@/lib/tipos";
import "./detalhe-evento.css";

type Props = { params: Promise<{ slug: string }> };

// (aula 11) Os endereços que o build já monta: um por evento que a API tem.
// Evento criado depois do build é montado no primeiro pedido, e guardado.
export async function generateStaticParams() {
  const eventos = await listarEventos();
  return eventos.map((evento) => ({ slug: evento.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const evento = await buscarEvento(slug);
  return { title: evento?.titulo ?? "Evento não encontrado" };
}

export default async function DetalheEvento({ params }: Props) {
  const { slug } = await params;
  const e = await buscarEvento(slug);
  if (!e) notFound();

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

          <p>
            <Link className="botao" href={`/eventos/${e.slug}/editar`}>
              Editar evento
            </Link>
          </p>
        </div>
      </article>

      {/* (aula 11) O evento chega primeiro; os parecidos, quando chegarem.
          O fallback é o @placeholder de um @defer — só que no servidor. */}
      <Suspense fallback={<p role="status">Carregando eventos parecidos…</p>}>
        <Relacionados evento={e} />
      </Suspense>
    </>
  );
}

// Um componente async só para a parte que espera outra coisa.
async function Relacionados({ evento }: { evento: Evento }) {
  const relacionados = (await listarEventos())
    .filter(
      (outro) =>
        outro.categoria === evento.categoria && outro.slug !== evento.slug,
    )
    .slice(0, 3);
  if (relacionados.length === 0) return null;

  return (
    <section aria-labelledby="tit-relacionados">
      <h2 id="tit-relacionados">Mais eventos de {evento.categoria}</h2>
      <ListaEventos eventos={relacionados} />
    </section>
  );
}
