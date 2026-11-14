import Link from "next/link";

// Era o NaoEncontrada, na rota **. Aqui é um nome de arquivo.
export default function NaoEncontrada() {
  return (
    <>
      <h1>Página não encontrada</h1>
      <p>
        Este endereço não existe no Leque de Eventos. Pode ser um link antigo,
        um erro de digitação ou um evento que saiu do ar.
      </p>
      <p>
        <Link className="botao" href="/eventos">
          Ver todos os eventos
        </Link>
      </p>
    </>
  );
}
