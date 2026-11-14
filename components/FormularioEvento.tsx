"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  CATEGORIAS,
  FORMATOS,
  NIVEIS,
  paraSlug,
  type EventoNovo,
} from "@/lib/evento-novo";
import { ESTADO_INICIAL, type Estado } from "@/lib/formulario";
import type { Evento, Organizador } from "@/lib/tipos";
import "./formulario-evento.css";

type Acao = (anterior: Estado, dados: FormData) => Promise<Estado>;

/* Era o formulario-evento. Os campos não são controlados: quem guarda o que
   foi digitado é o próprio <input> (defaultValue), e a Server Action recebe
   tudo pelo FormData. Só dois pedaços pedem estado na tela: o endereço que
   nasce do título, e a cidade que some quando o evento é online. */
type Props = { organizadores: readonly Organizador[]; inicial?: Evento };

export default function FormularioEvento({
  acao,
  ...props
}: Props & { acao: Acao }) {
  const [estado, enviar] = useActionState(acao, ESTADO_INICIAL);

  // Depois de um envio recusado, o foco vai para o primeiro campo errado.
  const formulario = useRef<HTMLFormElement>(null);
  useEffect(() => {
    formulario.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [estado]);

  return (
    <form ref={formulario} className="formulario" action={enviar} noValidate>
      {/* Depois de cada envio, o React 19 limpa o formulário sozinho. O texto
          volta com o defaultValue novo; o <select> e o que tem estado, não.
          A key faz os campos nascerem de novo com o que a pessoa enviou. */}
      <Campos key={JSON.stringify(estado.valores)} estado={estado} {...props} />

      <div className="formulario__acoes">
        <BotaoDeEnviar>
          {props.inicial ? "Salvar alterações" : "Publicar evento"}
        </BotaoDeEnviar>
      </div>

      {estado.mensagem && (
        <p className="erros" role="alert">
          {estado.mensagem}
        </p>
      )}
    </form>
  );
}

function Campos({
  estado,
  organizadores,
  inicial,
}: Props & { estado: Estado }) {
  const editando = inicial !== undefined;
  // O que a pessoa enviou; senão, o evento que está sendo editado; senão, o padrão.
  const v = (campo: keyof EventoNovo, padrao = "") =>
    estado.valores[campo] ?? String(inicial?.[campo] ?? padrao);

  const [formato, setFormato] = useState(v("formato", "Presencial"));
  const [slug, setSlug] = useState(v("slug"));
  const [slugMexido, setSlugMexido] = useState(editando);

  // As duas coisas que o leitor de tela precisa: "este campo está errado" e
  // "a explicação está ali". Era a diretiva AriaDoCampo.
  const aria = (campo: string) =>
    estado.erros[campo]
      ? { "aria-invalid": true, "aria-describedby": `erro-${campo}` }
      : {};
  const erro = (campo: string) =>
    estado.erros[campo] && (
      <div className="erros" id={`erro-${campo}`}>
        <p>{estado.erros[campo]}</p>
      </div>
    );

  return (
    <>
      <div className="campo">
        <label htmlFor="titulo">Título</label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          defaultValue={v("titulo")}
          onChange={(e) => !slugMexido && setSlug(paraSlug(e.target.value))}
          {...aria("titulo")}
        />
        {erro("titulo")}
      </div>

      <div className="campo">
        <label htmlFor="slug">
          Endereço <small>(/eventos/{slug || "…"})</small>
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          value={slug}
          readOnly={editando}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugMexido(true);
          }}
          {...aria("slug")}
        />
        {erro("slug")}
      </div>

      <div className="campo">
        <label htmlFor="resumo">Resumo</label>
        <input
          id="resumo"
          name="resumo"
          type="text"
          defaultValue={v("resumo")}
          {...aria("resumo")}
        />
        {erro("resumo")}
      </div>

      <div className="campo">
        <label htmlFor="descricao">Descrição</label>
        <textarea
          id="descricao"
          name="descricao"
          rows={5}
          defaultValue={v("descricao")}
          {...aria("descricao")}
        />
        {erro("descricao")}
      </div>

      <div className="campo">
        <label htmlFor="organizador">Organizador</label>
        <select
          id="organizador"
          name="organizadorSlug"
          defaultValue={v("organizadorSlug")}
          {...aria("organizadorSlug")}
        >
          <option value="">Escolha…</option>
          {organizadores.map((o) => (
            <option key={o.slug} value={o.slug}>
              {o.nome}
            </option>
          ))}
        </select>
        {erro("organizadorSlug")}
      </div>

      <div className="campo">
        <label htmlFor="categoria">Área</label>
        <select
          id="categoria"
          name="categoria"
          defaultValue={v("categoria")}
          {...aria("categoria")}
        >
          <option value="">Escolha…</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {erro("categoria")}
      </div>

      <div className="campo">
        <label htmlFor="nivel">Nível</label>
        <select id="nivel" name="nivel" defaultValue={v("nivel", "Iniciante")}>
          {NIVEIS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="campo">
        <label htmlFor="formato">Formato</label>
        <select
          id="formato"
          name="formato"
          defaultValue={formato}
          onChange={(e) => setFormato(e.target.value)}
        >
          {FORMATOS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Era o hidden(): fora da tela, fora do FormData, fora da regra. */}
      {formato !== "Online" && (
        <div className="campo">
          <label htmlFor="cidade">Cidade</label>
          <input
            id="cidade"
            name="cidade"
            type="text"
            defaultValue={v("cidade")}
            {...aria("cidade")}
          />
          {erro("cidade")}
        </div>
      )}

      <div className="campo">
        <label htmlFor="inicio">Começa em</label>
        <input
          id="inicio"
          name="inicioEm"
          type="datetime-local"
          defaultValue={v("inicioEm")}
          {...aria("inicioEm")}
        />
        {erro("inicioEm")}
      </div>

      <div className="campo">
        <label htmlFor="duracao">Duração (minutos)</label>
        <input
          id="duracao"
          name="duracaoMin"
          type="number"
          defaultValue={v("duracaoMin", "60")}
          {...aria("duracaoMin")}
        />
        {erro("duracaoMin")}
      </div>

      <div className="campo">
        <label htmlFor="vagas">
          Vagas <small>(vazio: sem limite)</small>
        </label>
        <input
          id="vagas"
          name="vagas"
          type="number"
          defaultValue={v("vagas")}
          {...aria("vagas")}
        />
        {erro("vagas")}
      </div>

      <label className="campo--marcar">
        <input
          type="checkbox"
          name="gratuito"
          defaultChecked={
            estado.valores.titulo !== undefined
              ? estado.valores.gratuito === "on"
              : (inicial?.gratuito ?? true)
          }
        />
        Gratuito
      </label>
    </>
  );
}

// O f().submitting() do Angular: o botão sabe que o formulário dele está indo.
function BotaoDeEnviar({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="botao" disabled={pending}>
      {pending ? "Enviando…" : children}
    </button>
  );
}
