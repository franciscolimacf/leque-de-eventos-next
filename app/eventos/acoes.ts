"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  criarEvento,
  editarEvento,
  removerEvento as removerNaApi,
} from "@/lib/api";
import { EsquemaDoEvento } from "@/lib/evento-novo";
import { porCampo, valoresDe, type Estado } from "@/lib/formulario";

/* Uma função que roda no SERVIDOR, chamada pelo <form> do navegador. Não há
   rota de API nem fetch no componente: o Next cria o endereço sozinho.

   slugOriginal: null para publicar; o slug do evento, para editar. Ele vem
   preso pelo .bind() da página, e não de um campo do formulário. */
export async function salvarEvento(
  slugOriginal: string | null,
  anterior: Estado,
  dados: FormData,
): Promise<Estado> {
  const valores = valoresDe(dados);

  // 1. DESCONFIE: este POST pode não ter vindo do seu formulário.
  const analise = EsquemaDoEvento.safeParse(Object.fromEntries(dados));
  if (!analise.success) {
    return {
      erros: porCampo(analise.error),
      valores,
      mensagem: "Há campos para corrigir.",
    };
  }

  // 2. GRAVE na API. Editar não troca o endereço: o slug é o da URL.
  const evento = analise.data;
  const gravou = slugOriginal
    ? await editarEvento(slugOriginal, evento)
    : await criarEvento(evento);

  // 3. A API RECUSOU? O 422 e o 409 trazem o campo: vão para debaixo dele.
  if (!gravou.ok)
    return { erros: gravou.erros, valores, mensagem: gravou.mensagem };

  // 4. AVISE A ETIQUETA da aula 11: o início, o catálogo, o detalhe e o
  //    organizador são refeitos no próximo pedido, e quem publicou já vê.
  updateTag("eventos");

  // 5. SAIA para a página do evento. Fora de qualquer try/catch.
  redirect(`/eventos/${slugOriginal ?? evento.slug}`);
}

export async function removerEvento(slug: string): Promise<void> {
  await removerNaApi(slug);
  updateTag("eventos");
  redirect("/eventos");
}
