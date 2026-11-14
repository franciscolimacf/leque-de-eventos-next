"use client";

import { useEffect, useState } from "react";

type Tema = "light" | "dark";

/* A primeira fronteira com o navegador. O servidor não tem localStorage nem
   document: este botão é um Client Component, e só ele — o cabeçalho em volta
   continua no servidor. O signal virou useState; o effect, useEffect. */
export default function BotaoTema() {
  // null = ainda não sabemos. O servidor desenha sem saber, e o navegador
  // confere o localStorage logo depois de montar.
  const [tema, setTema] = useState<Tema | null>(null);

  useEffect(() => {
    const salvo = localStorage.getItem("tema");
    if (salvo === "light" || salvo === "dark") aplicar(salvo);
  }, []);

  function aplicar(novo: Tema) {
    document.documentElement.dataset.tema = novo;
    localStorage.setItem("tema", novo);
    setTema(novo);
  }

  return (
    <button
      type="button"
      className="botao-tema"
      onClick={() => aplicar(tema === "dark" ? "light" : "dark")}
      aria-pressed={tema === "dark"}
    >
      {tema === "dark" ? "Tema Claro" : "Tema Escuro"}
    </button>
  );
}
