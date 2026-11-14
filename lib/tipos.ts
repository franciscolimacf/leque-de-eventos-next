export type Formato = "Presencial" | "Online" | "Híbrido";
export type Nivel = "Iniciante" | "Intermediário" | "Avançado";

export type Evento = {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  descricao: string;
  organizador: string;
  organizadorSlug: string;
  categoria: string;
  formato: Formato;
  cidade?: string; // evento online não tem cidade
  inicioEm: string; // ISO: "2026-10-08T19:00"
  duracaoMin: number;
  gratuito: boolean;
  vagas: number | null; // null quer dizer ilimitado
  nivel: Nivel;
};

export type Organizador = {
  slug: string;
  nome: string;
  sobre: string;
  site: string;
};
