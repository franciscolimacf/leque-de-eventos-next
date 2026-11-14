import Link from "next/link";
import type { Evento } from "@/lib/tipos";
import { dataCurta } from "@/lib/datas";
import { agora, situacaoDoEvento } from "@/lib/situacao";
import "./card-evento.css";

const ICONE = { Presencial: "📍", Online: "💻", Híbrido: "🔀" } as const;

// input.required<Evento>() virou uma prop. O computed() virou uma linha:
// a função roda uma vez, no servidor, e o HTML sai pronto.
export default function CardEvento({ evento: e }: { evento: Evento }) {
  const situacao = situacaoDoEvento(e, agora());

  return (
    <article className="card-evento">
      <div className="card-evento__corpo">
        <h3>
          <Link href={`/eventos/${e.slug}`}>{e.titulo}</Link>
        </h3>

        {situacao === "hoje" && (
          <p className="situacao situacao--destaque">Hoje</p>
        )}
        {situacao === "acontecendo" && (
          <p className="situacao situacao--destaque">Acontecendo agora</p>
        )}
        {situacao === "encerrado" && <p className="situacao">Já aconteceu</p>}

        <p>{e.resumo}</p>

        <p className="card-evento__meta">
          <time dateTime={e.inicioEm}>{dataCurta(e.inicioEm)}</time>
          {e.cidade && <> · {e.cidade}</>} ·{" "}
          <span aria-hidden="true">{ICONE[e.formato]}</span> {e.formato}
        </p>

        {e.gratuito && <p className="selo-gratuito">Gratuito</p>}
      </div>
    </article>
  );
}
