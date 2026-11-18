"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScrollTo } from "@/components/providers/SmoothScroll";
import { revealSecao, SecaoHeader } from "@/components/doc/Secao";
import { TRATAMENTOS } from "@/content/clinica";

/** Abertura dos tratamentos: os três, em lista, cada um levando à sua página. */
export function TratamentosIntro() {
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
    <section ref={root} id="tratamentos" aria-labelledby="tratamentos-titulo" className="bg-cacau-2 text-porcelana">
      <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-6 sm:px-8 lg:px-14 lg:pb-32">
        <SecaoHeader numero="01" titulo="Tratamentos" escuro />
        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12">
          <h2
            id="tratamentos-titulo"
            data-item
            data-gsap-pending
            className="font-display text-[clamp(2.7rem,11vw,4.4rem)] leading-[0.95] lg:col-span-5 lg:text-[clamp(3.6rem,5.6vw,6.6rem)]"
          >
            Três cuidados, <em className="italic text-rose-2">um</em> sorriso.
          </h2>
          <ol className="lg:col-span-6 lg:col-start-7">
            {TRATAMENTOS.map((t, i) => (
              <li key={t.id} data-item data-gsap-pending className="border-t border-porcelana/15 last:border-b">
                <a
                  href={`#${t.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(`#${t.id}`);
                  }}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 py-6 sm:py-7"
                >
                  <span className="font-mono text-xs text-rose-2">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="font-display block text-[2rem] leading-none transition-colors group-hover:text-rose-2 sm:text-[2.6rem]">
                      {t.titulo}
                    </span>
                    <span className="mt-2 block text-[15px] text-porcelana/65">{t.chamada}</span>
                  </span>
                  <span aria-hidden className="text-xl text-porcelana/50 group-hover:text-rose-2">↓</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
