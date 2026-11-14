"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { enderecoDosFiltros, type Filtros } from "@/lib/filtros";
import type { Formato } from "@/lib/tipos";
import "./filtros-eventos.css";

const OPCOES_FORMATO = ["todos", "Presencial", "Online", "Híbrido"] as const;

/* No Angular, os filtros eram quatro model() e o catálogo filtrava no navegador.
   Aqui o estado mora NA URL: este componente só escreve nela, e quem filtra é o
   servidor. O link filtrado se manda por WhatsApp, e o voltar do navegador funciona. */
export default function FiltrosEventos({
  filtros,
  cidades,
}: {
  filtros: Filtros;
  cidades: readonly string[];
}) {
  const router = useRouter();
  const [atualizando, iniciar] = useTransition();
  const espera = useRef<ReturnType<typeof setTimeout>>(undefined);

  // O texto da busca muda a cada tecla, antes de ir para a URL. Quando a URL
  // muda por fora (o "Limpar filtros" do aviso), ele acompanha — é o linkedSignal.
  const [busca, setBusca] = useState(filtros.busca);
  const [buscaDaUrl, setBuscaDaUrl] = useState(filtros.busca);
  if (filtros.busca !== buscaDaUrl) {
    setBuscaDaUrl(filtros.busca);
    setBusca(filtros.busca);
  }

  // Escolher (formato, cidade, gratuitos) vira uma entrada no histórico, e o
  // voltar desfaz. Digitar substitui a entrada: cada pausa não vira um voltar.
  function ir(novos: Partial<Filtros>, substituir = false) {
    clearTimeout(espera.current);
    const endereco = enderecoDosFiltros({ ...filtros, busca, ...novos });
    iniciar(() =>
      (substituir ? router.replace : router.push)(endereco, { scroll: false }),
    );
  }

  function digitar(texto: string) {
    setBusca(texto);
    clearTimeout(espera.current);
    // O debounceTime(300) do Angular: só vai para a URL quando a pessoa para.
    espera.current = setTimeout(() => ir({ busca: texto }, true), 300);
  }

  const ativos = [
    busca !== "",
    filtros.formato !== "todos",
    filtros.cidade !== "",
    filtros.soGratuitos,
  ].filter(Boolean).length;

  return (
    // Sem JavaScript, o form é um GET para /eventos e funciona igual.
    <form
      className="busca"
      role="search"
      action="/eventos"
      onSubmit={(evento) => {
        evento.preventDefault();
        ir({});
      }}
    >
      <label className="so-leitor" htmlFor="q">
        Buscar eventos
      </label>
      <input
        id="q"
        name="busca"
        type="search"
        placeholder="Buscar por título ou organizador"
        value={busca}
        onChange={(e) => digitar(e.target.value)}
      />

      <label className="so-leitor" htmlFor="formato">
        Formato
      </label>
      <select
        id="formato"
        name="formato"
        value={filtros.formato}
        onChange={(e) =>
          ir({ formato: e.target.value as Formato | "todos", cidade: "" })
        }
      >
        {OPCOES_FORMATO.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao === "todos" ? "Todos os formatos" : opcao}
          </option>
        ))}
      </select>

      <label className="so-leitor" htmlFor="cidade">
        Cidade
      </label>
      <select
        id="cidade"
        name="cidade"
        value={filtros.cidade}
        onChange={(e) => ir({ cidade: e.target.value })}
        disabled={cidades.length === 0}
      >
        <option value="">Todas as cidades</option>
        {cidades.map((cidade) => (
          <option key={cidade} value={cidade}>
            {cidade}
          </option>
        ))}
      </select>

      <label className="busca__check">
        <input
          type="checkbox"
          name="gratuitos"
          value="1"
          checked={filtros.soGratuitos}
          onChange={(e) => ir({ soGratuitos: e.target.checked })}
        />
        Só gratuitos
      </label>

      <button
        type="button"
        onClick={() => {
          setBusca("");
          ir({ busca: "", formato: "todos", cidade: "", soGratuitos: false });
        }}
      >
        {ativos === 0 ? "Limpar" : `Limpar (${ativos})`}
      </button>

      <p className="so-leitor" role="status">
        {atualizando ? "Atualizando a lista…" : ""}
      </p>
    </form>
  );
}
