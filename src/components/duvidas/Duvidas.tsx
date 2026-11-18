"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { revealSecao, SecaoHeader } from "@/components/doc/Secao";
import { DUVIDAS } from "@/content/clinica";

/**
 * Dúvidas. Respostas abertas no HTML (legíveis sem JS); o GSAP
 * fecha todas menos a primeira ao montar e anima abrir/fechar.
 */
export function Duvidas() {
  const root = useRef<HTMLElement>(null);
  const [aberta, setAberta] = useState(0);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.matchMedia().add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          gsap.set(q("[data-gsap-pending]"), { autoAlpha: 1 });
          q("[data-resposta]").forEach((el, i) => gsap.set(el, i === 0 ? { height: "auto" } : { height: 0, autoAlpha: 0 }));
          q("[data-sinal]").forEach((el, i) => gsap.set(el, { rotation: i === 0 ? 45 : 0 }));
          if ((ctx.conditions as { reduce: boolean }).reduce) return;
          revealSecao(q, root.current!);
        },
      );
    },
    { scope: root },
  );

  // Handler de evento (não roda no render).
  const alternar = (i: number, itens: HTMLElement[]) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const proxima = aberta === i ? -1 : i;
    itens.forEach((item, k) => {
      const abre = k === proxima;
      if (!abre && k !== aberta) return;
      gsap.to(item.querySelector("[data-resposta]"), {
        height: abre ? "auto" : 0,
        autoAlpha: abre ? 1 : 0,
        duration: reduce ? 0 : abre ? 0.8 : 0.6,
        ease: abre ? "power3.out" : "power3.inOut",
        overwrite: true,
        onComplete: () => ScrollTrigger.refresh(),
      });
      gsap.to(item.querySelector("[data-sinal]"), { rotation: abre ? 45 : 0, duration: reduce ? 0 : 0.6, ease: "power3.inOut", overwrite: true });
    });
    setAberta(proxima);
  };

  return (
    <section ref={root} id="duvidas" aria-labelledby="duvidas-titulo" className="bg-perola text-tinta">
      <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-6 sm:px-8 lg:px-14 lg:pb-36">
        <SecaoHeader numero="06" titulo="Dúvidas" />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2
              id="duvidas-titulo"
              data-item
              data-gsap-pending
              className="font-display text-[clamp(2.6rem,10vw,4rem)] leading-[0.95] lg:text-[clamp(3.2rem,4.6vw,5.4rem)]"
            >
              Antes de <em className="italic text-rose">agendar.</em>
            </h2>
          </div>
          <ol className="lg:col-span-8">
            {DUVIDAS.map((d, i) => {
              const id = `duvida-${i}`;
              return (
                <li key={id} data-item data-gsap-pending data-duvida className="border-t border-tinta/15 last:border-b">
                  <h3>
                    <button
                      type="button"
                      id={`${id}-btn`}
                      aria-expanded={aberta === i}
                      aria-controls={`${id}-resp`}
                      onClick={(e) => {
                        const lista = e.currentTarget.closest("ol");
                        if (lista) alternar(i, Array.from(lista.querySelectorAll<HTMLElement>("[data-duvida]")));
                      }}
                      className="flex w-full items-start justify-between gap-6 py-6 text-left outline-offset-4 focus-visible:outline-2 focus-visible:outline-rose sm:py-7"
                    >
                      <span className="font-display text-[1.6rem] leading-[1.1] sm:text-[2.1rem]">{d.pergunta}</span>
                      <span data-sinal aria-hidden className="mt-1 block font-mono text-2xl leading-none text-rose">
                        +
                      </span>
                    </button>
                  </h3>
                  <div id={`${id}-resp`} role="region" aria-labelledby={`${id}-btn`} data-resposta className="overflow-hidden">
                    <p className="max-w-[62ch] pb-7 text-base leading-relaxed text-tinta-soft sm:text-lg">{d.resposta}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
