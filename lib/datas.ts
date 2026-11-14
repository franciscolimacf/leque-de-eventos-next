/* O DatePipe do Angular, em JavaScript puro. O Intl já sabe português.
   Sem timeZone: a data chega sem fuso ("2026-10-08T19:00"), é lida na hora
   local de quem roda e escrita na mesma — o 19h00 continua 19h00. */

// "8 de outubro, 19h00"
export function dataCurta(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}, ${hora(d)}`;
}

// "quinta-feira, 8 de outubro, às 19h00"
export function dataPorExtenso(iso: string): string {
  const d = new Date(iso);
  const dia = d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return `${dia}, às ${hora(d)}`;
}

// 150 → "2h30" · 480 → "8h" · 45 → "45 min"
export function duracao(minutosNoTotal: number): string {
  const horas = Math.floor(minutosNoTotal / 60);
  const minutos = minutosNoTotal % 60;
  if (horas === 0) return `${minutos} min`;
  return minutos === 0
    ? `${horas}h`
    : `${horas}h${String(minutos).padStart(2, "0")}`;
}

function hora(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}h${String(d.getMinutes()).padStart(2, "0")}`;
}
