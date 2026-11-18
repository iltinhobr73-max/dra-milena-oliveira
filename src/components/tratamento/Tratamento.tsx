"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { revealSecao, SecaoHeader } from "@/components/doc/Secao";
import { TRATAMENTOS, whatsapp } from "@/content/clinica";

/**
 * Página de um tratamento. Animação simples: entradas em sequência (0.2s,
 * power3.out) e o visual se revelando. No clareamento, o "antes e depois"
 * corre conforme você rola pela seção (sem travar a tela).
 */

type Props = { indice: number; numero: string; fundo: string; inverter?: boolean };

export function Tratamento({ indice, numero, fundo, inverter = false }: Props) {
  const t = TRATAMENTOS[indice];
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.matchMedia().add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          gsap.set(q("[data-gsap-pending]"), { autoAlpha: 1 });
          if ((ctx.conditions as { reduce: boolean }).reduce) return;
          const tl = revealSecao(q, root.current!);
          gsap.set(q("[data-visual]"), { clipPath: "inset(14% 8% 14% 8%)" });
          tl.to(q("[data-visual]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" }, 0.2);

          // Antes e depois guiado pelo scroll.
          const cortina = q("[data-depois]");
          if (cortina.length) {
            gsap.set(cortina, { clipPath: "inset(0% 100% 0% 0%)" });
            gsap.set(q("[data-divisa]"), { left: "0%" });
            const st = { trigger: q("[data-comparar]")[0], start: "top 75%", end: "bottom 45%", scrub: 0.6 };
            gsap.to(cortina, { clipPath: "inset(0% 0% 0% 0%)", ease: "power3.inOut", scrollTrigger: st });
            gsap.to(q("[data-divisa]"), { left: "100%", ease: "power3.inOut", scrollTrigger: st });
          } else {
            gsap.fromTo(
              q("[data-visual] img"),
              { yPercent: -5 },
              { yPercent: 5, ease: "power3.inOut", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
            );
          }
        },
      );
    },
    { scope: root },
  );

  const visual =
    t.id === "clareamento" ? (
      <figure data-comparar className="relative aspect-[612/301] w-full overflow-hidden sm:aspect-[5/4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/antes.jpg" alt="Antes do clareamento" className="absolute inset-0 h-full w-full object-cover" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-depois src="/media/depois.jpg" alt="Depois do clareamento" className="absolute inset-0 h-full w-full object-cover" />
        <span data-divisa aria-hidden className="absolute inset-y-0 block w-0.5 bg-porcelana" />
        <figcaption className="absolute inset-x-3 bottom-3 flex justify-between text-xs text-porcelana">
          <span className="bg-cacau/55 px-2 py-1">Antes</span>
          <span className="bg-cacau/55 px-2 py-1">Depois</span>
        </figcaption>
      </figure>
    ) : t.id === "botox" ? (
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/procedimento.jpg" alt="Dra. Milena aplicando toxina botulínica" className="h-[110%] w-full object-cover" />
        <span className="absolute bottom-3 left-3 bg-cacau/55 px-2 py-1 text-xs text-porcelana">Aplicação no consultório</span>
      </div>
    ) : (
      // Clínica geral: as etapas reais do atendimento, no lugar de uma imagem decorativa.
      <ol className="w-full border-t border-tinta/15">
        {[
          ["Avaliação", "Conversa, exame clínico e o que você deseja para o seu sorriso."],
          ["Plano", "O tratamento explicado etapa por etapa, antes de começar."],
          ["Cuidado", "Tratamento e retornos de acompanhamento e prevenção."],
        ].map(([titulo, texto], i) => (
          <li key={titulo} className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-tinta/15 py-6 sm:grid-cols-[5rem_1fr]">
            <span className="font-display text-[2.6rem] leading-none text-rose sm:text-[3.4rem]">{i + 1}</span>
            <span>
              <span className="font-display block text-2xl sm:text-3xl">{titulo}</span>
              <span className="mt-1 block text-[15px] leading-relaxed text-tinta-soft">{texto}</span>
            </span>
          </li>
        ))}
      </ol>
    );

  return (
    <section ref={root} id={t.id} aria-labelledby={`${t.id}-titulo`} className={`${fundo} text-tinta`}>
      <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-6 sm:px-8 lg:px-14 lg:pb-32">
        <SecaoHeader numero={numero} titulo={t.titulo} />
        <div className="mt-12 grid items-center gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <div className={`lg:col-span-6 ${inverter ? "lg:order-2 lg:col-start-7" : ""}`}>
            <div data-visual className="mx-auto w-full max-w-[34rem]">
              {visual}
            </div>
          </div>

          <div className={`lg:col-span-6 ${inverter ? "lg:order-1" : ""}`}>
            <h2
              id={`${t.id}-titulo`}
              data-item
              data-gsap-pending
              className="font-display text-[clamp(3rem,13vw,4.8rem)] leading-[0.92] lg:text-[clamp(4rem,6.4vw,7.6rem)]"
            >
              {t.titulo}
            </h2>
            <p data-item data-gsap-pending className="font-display mt-5 text-2xl leading-snug text-tinta sm:text-3xl">
              {t.chamada}
            </p>
            <p data-item data-gsap-pending className="mt-6 max-w-[48ch] text-lg leading-relaxed text-tinta-soft">
              {t.texto}
            </p>
            <ul className="mt-8 max-w-[34rem]">
              {t.itens.map((it) => (
                <li key={it} className="pb-3">
                  <span data-draw className="block h-px w-full bg-tinta/15" />
                  <span data-item data-gsap-pending className="flex gap-3 pt-3 text-[15px] sm:text-base">
                    <span className="text-rose">—</span>
                    {it}
                  </span>
                </li>
              ))}
            </ul>
            <a
              data-item
              data-gsap-pending
              href={whatsapp(t.assunto)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-block bg-cacau px-7 py-4 text-[15px] text-porcelana transition-colors hover:bg-rose"
            >
              Agendar avaliação de {t.assunto}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
