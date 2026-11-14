import type { Metadata } from "next";
import Cabecalho from "@/components/Cabecalho";
import Rodape from "@/components/Rodape";
import "./globals.css";

// O title do app.routes.ts, num lugar só: cada página diz só o começo.
export const metadata: Metadata = {
  title: { default: "Leque de Eventos", template: "%s · Leque de Eventos" },
  description:
    "Eventos de tecnologia: meetups, workshops, hackathons e cursos.",
};

// Era o app.html: o pular, o cabeçalho, o <router-outlet /> e o rodapé.
// O children é o <router-outlet />.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="pular" href="#conteudo">
          Pular para o conteúdo
        </a>
        <Cabecalho />
        <main className="conteudo" id="conteudo">
          {children}
        </main>
        <Rodape />
      </body>
    </html>
  );
}
