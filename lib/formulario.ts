import type { ZodError } from "zod";

/* O que a Server Action devolve para o formulário, a cada envio: os erros de
   cada campo, o que a pessoa digitou (para voltar preenchido) e um recado. */
export type Estado = {
  erros: Record<string, string>;
  valores: Record<string, string>;
  mensagem?: string;
};

export const ESTADO_INICIAL: Estado = { erros: {}, valores: {} };

// O Zod devolve uma lista; a tela quer uma mensagem por campo — a primeira.
export function porCampo(erro: ZodError): Record<string, string> {
  const erros: Record<string, string> = {};
  for (const problema of erro.issues) {
    const campo = String(problema.path[0] ?? "_");
    erros[campo] ??= problema.message;
  }
  return erros;
}

export function valoresDe(dados: FormData): Record<string, string> {
  const valores: Record<string, string> = {};
  for (const [chave, valor] of dados.entries()) {
    if (typeof valor === "string") valores[chave] = valor;
  }
  return valores;
}
