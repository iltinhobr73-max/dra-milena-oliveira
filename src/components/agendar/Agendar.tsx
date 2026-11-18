"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScrollTo } from "@/components/providers/SmoothScroll";
import { revealSecao, SecaoHeader } from "@/components/doc/Secao";
import { Logo } from "@/components/doc/Logo";
import { CLINICA, whatsapp } from "@/content/clinica";

/** Agendar: convite final pelo WhatsApp + rodapé. */
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
        <SecaoHeader numero="07" titulo="Agendar" />

        <div className="py-20 text-center lg:py-32">
          <p data-item data-gsap-pending className="text-sm text-tinta-soft sm:text-base">
            A primeira consulta é uma avaliação: entendemos o que você quer e o que é possível.
          </p>
          <h2
            id="agendar-titulo"
            data-item
            data-gsap-pending
            className="font-display mx-auto mt-6 max-w-[14ch] text-[clamp(3rem,13vw,5rem)] leading-[0.92] lg:text-[clamp(4.5rem,8.6vw,10rem)]"
          >
            Vamos cuidar do seu sorriso?
          </h2>
          <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
            <a
              data-item
              data-gsap-pending
              href={whatsapp()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-cacau px-7 py-4 text-[15px] text-porcelana transition-colors hover:bg-rose"
            >
              Agendar pelo WhatsApp
            </a>
            <a
              data-item
              data-gsap-pending
              href={CLINICA.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-tinta/40 pb-0.5 text-[15px] hover:border-tinta"
            >
              {CLINICA.instagram.usuario}
            </a>
          </div>
          <p data-item data-gsap-pending className="mt-6 text-sm text-tinta-soft">
            WhatsApp {CLINICA.whatsappExibicao}
          </p>
        </div>

        <footer className="flex flex-col gap-6 border-t border-tinta/15 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <Logo className="text-[18px]" />
          <p className="max-w-[60ch] text-xs leading-relaxed text-tinta-soft">
            {CLINICA.nome} · {CLINICA.profissao}{CLINICA.cro ? ` · ${CLINICA.cro}` : ""} · {CLINICA.cidade}. Resultados variam de pessoa
            para pessoa; todo tratamento depende de avaliação clínica.
          </p>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollTo(0);
            }}
            className="text-xs text-tinta-soft hover:text-tinta"
          >
            ↑ voltar ao início
          </a>
        </footer>
      </div>
    </section>
  );
}
