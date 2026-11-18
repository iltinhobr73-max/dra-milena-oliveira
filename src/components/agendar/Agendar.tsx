"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScrollTo } from "@/components/providers/SmoothScroll";
import { revealSecao, SecaoHeader } from "@/components/doc/Secao";
import { Logo } from "@/components/doc/Logo";
import { CLINICA } from "@/content/clinica";

/** Agendar (tom BL1): o fim do clareamento — a página chega ao branco porcelana. */
export function Agendar() {
  const root = useRef<HTMLElement>(null);
  const scrollTo = useScrollTo();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.matchMedia().add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          gsap.set(q("[data-gsap-pending]"), { autoAlpha: 1 });
          if ((ctx.conditions as { reduce: boolean }).reduce) return;
          revealSecao(q, root.current!);
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="agendar" aria-labelledby="agendar-titulo" className="bg-porcelana text-tinta">
      <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-6 sm:px-8 lg:px-14">
        <SecaoHeader tom="BL1" cor="--color-bl1" titulo="Agendar" />

        <div className="py-20 text-center lg:py-32">
          <p data-item data-gsap-pending className="font-mono text-xs text-tinta-soft sm:text-sm">
            A primeira consulta é uma avaliação: entendemos o que você quer e o que é possível.
          </p>
          <h2
            id="agendar-titulo"
            data-item
            data-gsap-pending
            className="font-display mx-auto mt-6 max-w-[14ch] text-[clamp(3rem,13vw,5rem)] leading-[0.92] lg:text-[clamp(4.5rem,8.6vw,10rem)]"
          >
            Vamos encontrar o <em className="italic text-rose">seu</em> tom?
          </h2>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              data-item
              data-gsap-pending
              href={CLINICA.agendamento}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-6 rounded-full bg-cacau py-2.5 pl-7 pr-2.5 text-base font-medium text-porcelana transition-colors hover:bg-rose"
            >
              Agendar avaliação
              <span className="grid size-11 place-items-center rounded-full bg-rose-2 text-cacau">↗</span>
            </a>
            <a
              data-item
              data-gsap-pending
              href={CLINICA.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-tinta/25 px-6 py-4 font-mono text-sm transition-colors hover:border-rose hover:text-rose"
            >
              {CLINICA.instagram.usuario}
            </a>
          </div>
        </div>

        <footer className="flex flex-col gap-6 border-t border-tinta/15 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <Logo className="text-[18px]" />
          <p className="max-w-[60ch] font-mono text-[11px] leading-relaxed text-tinta-soft">
            {CLINICA.nome} · {CLINICA.profissao} · {CLINICA.cro} · {CLINICA.cidade}. Resultados variam de pessoa
            para pessoa; todo tratamento depende de avaliação clínica.
          </p>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollTo(0);
            }}
            className="font-mono text-[11px] text-tinta-soft hover:text-tinta"
          >
            ↑ voltar ao início
          </a>
        </footer>
      </div>
    </section>
  );
}
