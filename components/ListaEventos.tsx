import type { Evento } from "@/lib/tipos";
import CardEvento from "./CardEvento";
import "./lista-eventos.css";

// O @for com track virou um .map() com key: o key é o track.
export default function ListaEventos({
  eventos,
}: {
  eventos: readonly Evento[];
}) {
  return (
    <ul className="lista-eventos">
      {eventos.map((evento) => (
        <li key={evento.id}>
          <CardEvento evento={evento} />
        </li>
      ))}
    </ul>
  );
}
