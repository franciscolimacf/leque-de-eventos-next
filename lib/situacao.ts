import type { Evento } from "@/lib/tipos";

export type Situacao = "futuro" | "hoje" | "acontecendo" | "encerrado";

// Função pura: o mesmo evento e a mesma hora dão sempre a mesma resposta.
// `agora` em milissegundos, como Date.now() devolve.
export function situacaoDoEvento(evento: Evento, agora: number): Situacao {
  const inicio = new Date(evento.inicioEm).getTime();
  const fim = inicio + evento.duracaoMin * 60_000;

  if (agora >= fim) return "encerrado";
  if (agora >= inicio) return "acontecendo";
  if (new Date(inicio).toDateString() === new Date(agora).toDateString())
    return "hoje";
  return "futuro";
}

// A hora em que o servidor monta a página. Mora aqui, e não no componente: o
// React pede que componente seja puro, e Date.now() muda a cada chamada.
export function agora(): number {
  return Date.now();
}
