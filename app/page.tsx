import Link from "next/link";
import ListaEventos from "@/components/ListaEventos";
import { listarEventos } from "@/lib/api";
import { agora, situacaoDoEvento } from "@/lib/situacao";

// async: a página PARA e espera a API. Quem espera é o servidor, e o
// navegador recebe o HTML com os eventos dentro.
export default async function Inicio() {
  const momento = agora();
  const destaques = (await listarEventos())
    .filter((e) => situacaoDoEvento(e, momento) !== "encerrado")
    .toSorted((a, b) => a.inicioEm.localeCompare(b.inicioEm))
    .slice(0, 3);

  return (
    <>
      <h1>Eventos de tecnologia perto de você</h1>

      <section aria-labelledby="tit-proximos">
        <h2 id="tit-proximos">Próximos eventos</h2>
        <ListaEventos eventos={destaques} />
        <p>
          <Link className="botao" href="/eventos">
            Ver todos os eventos
          </Link>
        </p>
      </section>
    </>
  );
}
