import Link from "next/link";
import BotaoTema from "./BotaoTema";
import LinkDoMenu from "./LinkDoMenu";
import "./cabecalho.css";

export default function Cabecalho() {
  return (
    <header className="cabecalho">
      <div>
        <Link href="/">
          <strong>Leque de Eventos</strong>
        </Link>

        <nav aria-label="Principal">
          <LinkDoMenu href="/eventos">Eventos</LinkDoMenu>
        </nav>

        <BotaoTema />
      </div>
    </header>
  );
}
