import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BotaoRemover from "@/components/BotaoRemover";
import FormularioEvento from "@/components/FormularioEvento";
import { buscarEvento, listarOrganizadores } from "@/lib/api";
import { removerEvento, salvarEvento } from "../../acoes";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Editar evento" };

export default async function EditarEvento({ params }: Props) {
  const { slug } = await params;
  const [evento, organizadores] = await Promise.all([
    buscarEvento(slug),
    listarOrganizadores(),
  ]);
  if (!evento) notFound();

  return (
    <>
      <nav aria-label="Trilha">
        <Link href={`/eventos/${slug}`}>← Voltar ao evento</Link>
      </nav>
      <h1>Editar evento</h1>
      {/* O slug preso pelo .bind: ninguém troca qual evento se edita mexendo no HTML. */}
      <FormularioEvento
        acao={salvarEvento.bind(null, slug)}
        organizadores={organizadores}
        inicial={evento}
      />

      <form
        action={removerEvento.bind(null, slug)}
        className="formulario__acoes"
      >
        <BotaoRemover titulo={evento.titulo} />
      </form>
    </>
  );
}
