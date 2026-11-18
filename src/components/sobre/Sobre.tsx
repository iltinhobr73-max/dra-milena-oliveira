"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { revealSecao, SecaoHeader } from "@/components/doc/Secao";
import { CLINICA } from "@/content/clinica";

/**
 * Sobre. A foto se revela de baixo para cima (base arredondada) e a
 * formação é uma linha do tempo traçada.
 */
export function Sobre() {
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
          gsap.set(q("[data-foto]"), { clipPath: "inset(100% 0% 0% 0% round 0px 0px 999px 999px)" });
          gsap.set(q("[data-foto-img]"), { scale: 1.2 });
          tl.to(q("[data-foto]"), { clipPath: "inset(0% 0% 0% 0% round 0px 0px 999px 999px)", duration: 1.4, ease: "expo.inOut" }, 0.2)
            .to(q("[data-foto-img]"), { scale: 1, duration: 1.8, ease: "expo.out" }, 0.4);
          // leve parallax da foto
          gsap.to(q("[data-foto-img]"), {
            yPercent: -8,
            ease: "power3.inOut",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          });
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="sobre" aria-labelledby="sobre-titulo" className="bg-nude-2 text-tinta">
      <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-6 sm:px-8 lg:px-14 lg:pb-36">
        <SecaoHeader numero="05" titulo="Sobre" />

        <div className="mt-14 grid items-center gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div data-foto className="relative mx-auto aspect-[4/5] w-[min(82%,22rem)] overflow-hidden rounded-b-[999px] bg-nude-2 lg:mx-0 lg:w-full lg:max-w-[26rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                data-foto-img
                src="/media/consultorio.jpg"
                alt="Dra. Milena Oliveira no consultório"
                className="h-[112%] w-full object-cover object-[50%_15%]"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <p data-item data-gsap-pending className="font-mono text-xs text-tinta-soft sm:text-sm">
              {CLINICA.profissao} · {CLINICA.cidade}
            </p>
            <h2
              id="sobre-titulo"
              data-item
              data-gsap-pending
              className="font-display mt-4 text-[clamp(2.6rem,10vw,4rem)] leading-[0.95] lg:text-[clamp(3.4rem,5.4vw,6.4rem)]"
            >
              Prazer, eu sou a <em className="italic text-rose">Milena.</em>
            </h2>
            <p data-item data-gsap-pending className="mt-8 max-w-[52ch] text-lg leading-relaxed text-tinta-soft sm:text-xl">
              {CLINICA.bio}
            </p>

            <ol className="mt-12 max-w-[40rem]">
              {CLINICA.formacao.map((f) => (
                <li key={f.oque} className="grid grid-cols-[7.5rem_1fr] gap-4 pb-5 sm:grid-cols-[9rem_1fr]">
                  <span data-item data-gsap-pending className="pt-4 font-mono text-[11px] text-tinta-soft sm:text-xs">
                    {f.quando}
                  </span>
                  <div>
                    <span data-draw className="block h-px w-full bg-tinta/25" />
                    <p data-item data-gsap-pending className="pt-3 text-lg">
                      {f.oque}
                      {f.onde && <span className="text-tinta-soft"> — {f.onde}</span>}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p data-item data-gsap-pending className="mt-8 max-w-[52ch] text-lg leading-relaxed text-tinta-soft">
              No consultório, o atendimento é sem pressa: tempo para explicar cada etapa e tirar as suas dúvidas antes
              de começar.
            </p>
            <a
              data-item
              data-gsap-pending
              href={CLINICA.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-3 border-b border-tinta pb-1 font-mono text-sm hover:text-rose"
            >
              Bastidores no Instagram {CLINICA.instagram.usuario} ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
