import Link from "next/link";
import "./aviso.css";

/* O <ng-content /> virou children. O output() agir virou um link: um aviso de
   servidor não tem clique para avisar — ele leva para outro endereço. */
export default function Aviso({
  icone = "ℹ️",
  acao,
  children,
}: {
  icone?: string;
  acao?: { rotulo: string; href: string };
  children: React.ReactNode;
}) {
  return (
    <div className="aviso">
      <span className="aviso__icone" aria-hidden="true">
        {icone}
      </span>
      <p className="aviso__texto">{children}</p>
      {acao && (
        <Link className="aviso__acao" href={acao.href}>
          {acao.rotulo}
        </Link>
      )}
    </div>
  );
}
