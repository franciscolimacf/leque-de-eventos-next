"use client";

import { useFormStatus } from "react-dom";

// O confirm() roda no navegador, antes de o form chamar a Server Action.
export default function BotaoRemover({ titulo }: { titulo: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="formulario__remover"
      disabled={pending}
      onClick={(e) => {
        if (!confirm(`Remover "${titulo}"? Isso não tem volta.`))
          e.preventDefault();
      }}
    >
      {pending ? "Removendo…" : "Remover evento"}
    </button>
  );
}
