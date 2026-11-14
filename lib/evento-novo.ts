import { z } from "zod";
import type { Evento } from "@/lib/tipos";

/* Era o rascunho.ts da aula 08. As opções dos <select> e o paraSlug vêm
   iguais; o schema do form() vira um esquema do Zod — as mesmas regras, com as
   mesmas mensagens, conferidas no servidor. */

export const CATEGORIAS = [
  "Front-end",
  "Back-end",
  "Dados",
  "Design",
  "Carreira",
] as const;
export const FORMATOS = ["Presencial", "Online", "Híbrido"] as const;
export const NIVEIS = ["Iniciante", "Intermediário", "Avançado"] as const;

// O que vai para a API: o evento sem o que ela inventa (o id e o nome do organizador).
export type EventoNovo = Omit<Evento, "id" | "organizador">;

// "React Recife · Meetup #42" → "react-recife-meetup-42"
export function paraSlug(titulo: string): string {
  return titulo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Tudo chega do FormData como texto. O Zod confere e converte de uma vez.
export const EsquemaDoEvento = z
  .object({
    titulo: z
      .string()
      .trim()
      .min(5, "O título precisa de pelo menos 5 caracteres.")
      .max(100, "O título pode ter até 100 caracteres."),
    slug: z
      .string()
      .trim()
      .min(1, "Diga o endereço do evento.")
      .regex(
        /^[a-z0-9]+(-[a-z0-9]+)*$/,
        "Use só letras minúsculas, números e hífens.",
      ),
    resumo: z
      .string()
      .trim()
      .min(10, "O resumo precisa de pelo menos 10 caracteres.")
      .max(160, "O resumo pode ter até 160 caracteres."),
    descricao: z
      .string()
      .trim()
      .min(20, "A descrição precisa de pelo menos 20 caracteres.")
      .max(2000, "A descrição pode ter até 2000 caracteres."),
    organizadorSlug: z.string().min(1, "Escolha quem organiza."),
    // string + refine, e não z.enum: um enum vazio interrompe a regra da cidade
    // lá embaixo, e a mensagem dela só apareceria no envio seguinte.
    categoria: z
      .string()
      .refine(
        (valor) => (CATEGORIAS as readonly string[]).includes(valor),
        "Escolha a área.",
      ),
    nivel: z.enum(NIVEIS, "Escolha o nível."),
    formato: z.enum(FORMATOS, "Escolha o formato."),
    cidade: z.string().trim().default(""),
    inicioEm: z
      .string()
      .min(1, "Diga quando começa.")
      .refine(
        (valor) => new Date(valor).getTime() > Date.now(),
        "A data precisa ser no futuro.",
      ),
    duracaoMin: z.coerce
      .number("Diga quanto tempo dura.")
      .int("Use minutos inteiros.")
      .min(15, "A duração mínima é de 15 minutos.")
      .max(20160, "A duração máxima é de 14 dias."),
    // Vazio quer dizer sem limite: vira null.
    vagas: z
      .string()
      .transform((valor) => (valor.trim() === "" ? null : Number(valor)))
      .pipe(
        z
          .number("Deixe vazio, ou diga pelo menos 1 vaga.")
          .int()
          .min(1, "Deixe vazio, ou diga pelo menos 1 vaga.")
          .nullable(),
      ),
    // O checkbox: marcado chega "on"; desmarcado, não chega.
    gratuito: z
      .literal("on")
      .optional()
      .transform((valor) => valor === "on"),
  })
  // A regra que depende de outro campo: era o hidden() + required() da cidade.
  .superRefine((evento, ctx) => {
    if (evento.formato !== "Online" && evento.cidade === "") {
      ctx.addIssue({
        code: "custom",
        path: ["cidade"],
        message: "Diga em que cidade vai ser.",
      });
    }
  })
  // Era o paraEnvio(): evento online não leva cidade.
  .transform(
    ({ cidade, ...resto }): EventoNovo =>
      resto.formato === "Online" ? resto : { ...resto, cidade },
  );
