"use client";

// Era o ErroDeCarregamento, que o withNavigationErrorHandler abria.
// Tem de ser Client Component: o botão tenta de novo, no navegador.
export default function ErroDeCarregamento({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <>
      <h1>Não foi possível abrir a página</h1>
      <p>
        A página não chegou até o seu navegador. Confira a conexão com a
        internet e tente de novo.
      </p>
      <p>
        <button type="button" className="botao" onClick={reset}>
          Tentar de novo
        </button>
      </p>
    </>
  );
}
