"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { revealSecao, SecaoHeader } from "@/components/doc/Secao";
import { CLINICA } from "@/content/clinica";

/** Consultório (tom B1): o ambiente e o convite para acompanhar os bastidores. */
export function Consultorio() {
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
          gsap.set(q("[data-moldura]"), { clipPath: "inset(12% 12% 12% 12% round 28px)" });
          tl.to(q("[data-moldura]"), { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.4, ease: "expo.inOut" }, 0.2);
          gsap.fromTo(
            q("[data-moldura] img"),
            { yPercent: -6 },
            { yPercent: 6, ease: "power3.inOut", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
          );
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="consultorio" aria-labelledby="consultorio-titulo" className="bg-nude-2 text-tinta">
      <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-6 sm:px-8 lg:px-14 lg:pb-36">
        <SecaoHeader tom="B1" cor="--color-b1" titulo="Consultório" />

        <div className="mt-14 grid items-end gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6 lg:order-2">
            <div data-moldura className="relative mx-auto aspect-[4/5] w-[min(88%,24rem)] overflow-hidden rounded-[28px] lg:w-full lg:max-w-[30rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/consultorio.jpg" alt="Consultório da Dra. Milena Oliveira" className="h-[112%] w-full object-cover" />
            </div>
          </div>
          <div className="lg:col-span-6 lg:order-1">
            <p data-item data-gsap-pending className="font-mono text-xs text-tinta-soft sm:text-sm">
              {CLINICA.cidade}
            </p>
            <h2
              id="consultorio-titulo"
              data-item
              data-gsap-pending
              className="font-display mt-4 text-[clamp(2.6rem,10vw,4rem)] leading-[0.95] lg:text-[clamp(3.4rem,5vw,6rem)]"
            >
              Um lugar pensado para você ficar <em className="italic text-rose">à vontade.</em>
            </h2>
            <p data-item data-gsap-pending className="mt-6 max-w-[46ch] text-lg leading-relaxed text-tinta-soft">
              Atendimento sem pressa, com tempo para explicar cada etapa e tirar as suas dúvidas antes de começar.
            </p>
            <a
              data-item
              data-gsap-pending
              href={CLINICA.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 border-b border-tinta pb-1 font-mono text-sm hover:text-rose"
            >
              Bastidores no Instagram {CLINICA.instagram.usuario} ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
