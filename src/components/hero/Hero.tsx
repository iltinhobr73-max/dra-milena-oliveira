"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScrollTo } from "@/components/providers/SmoothScroll";
import { CLINICA, whatsapp } from "@/content/clinica";

/**
 * Hero editorial (como capa de revista de beleza).
 *
 * Vídeo em loop = a própria Dra. Milena, numa aproximação lenta de câmera.
 * Tensão antes da primeira palavra: uma linha fina em forma de SORRISO se
 * desenha atravessando a tela; a foto aparece; só então o lema sobe.
 */

const LINHAS = ["Transformando vidas", "através do sorriso."];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const scrollTo = useScrollTo();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.matchMedia().add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          const { reduce } = ctx.conditions as { reduce: boolean };
          gsap.set(q("[data-gsap-pending]"), { autoAlpha: 1 });
          const curva = root.current?.querySelector<SVGPathElement>("[data-sorriso]") ?? undefined;
          const comprimento = curva?.getTotalLength() ?? 0;
          if (reduce) {
            video.current?.pause();
            return;
          }

          /* ---------- Estado inicial ---------- */
          gsap.set(q("[data-hero-meta]"), { autoAlpha: 0 });
          if (curva) gsap.set(curva, { strokeDasharray: comprimento, strokeDashoffset: comprimento });
          gsap.set(q("[data-foto]"), { clipPath: "inset(0% 0% 100% 0%)" });
          gsap.set(q("[data-foto] video"), { scale: 1.15 });
          gsap.set(q("[data-legenda]"), { autoAlpha: 0, y: 10 });
          gsap.set(q("[data-linha]"), { yPercent: 110 });
          gsap.set(q("[data-hero-fade]"), { autoAlpha: 0, y: 20 });
          gsap.set(q("[data-hero-indicador]"), { autoAlpha: 0 });

          gsap
            .timeline({ delay: 0.25 })
            .to(q("[data-hero-meta]"), { autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.2 }, 0)
            // 1. Silêncio: só a linha do sorriso se desenha, devagar.
            .to(curva ?? {}, { strokeDashoffset: 0, duration: 1.8, ease: "expo.inOut" }, 0.3)
            // 2. A foto desce como uma cortina se abrindo.
            .to(q("[data-foto]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" }, 1.5)
            .to(q("[data-foto] video"), { scale: 1, duration: 2.2, ease: "expo.out" }, 1.6)
            .to(q("[data-legenda]"), { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 2.6)
            // 3. Só então o lema.
            .to(q("[data-linha]"), { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.2 }, 2.3)
            .to(q("[data-hero-fade]"), { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.2 }, 3.1)
            .to(q("[data-hero-indicador]"), { autoAlpha: 1, duration: 0.8, ease: "power3.out" }, 3.8);

          /* ---------- Scroll ---------- */
          const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
          gsap.to(q("[data-hero-indicador]"), {
            autoAlpha: 0,
            ease: "power3.out",
            scrollTrigger: { trigger: root.current, start: "top top", end: "+=140", scrub: true },
          });
          gsap.to(q("[data-foto]"), { yPercent: -6, ease: "power3.inOut", scrollTrigger: st });
          gsap.to(q("[data-hero-texto]"), { y: -50, ease: "power3.inOut", scrollTrigger: st });
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-label="Início"
      className="relative isolate flex min-h-svh w-full flex-col overflow-hidden bg-porcelana text-tinta lg:h-svh lg:min-h-[700px]"
    >
      {/* A linha do sorriso, atravessando a tela atrás de tudo */}
      <svg aria-hidden viewBox="0 0 1440 900" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 -z-10 hidden h-full w-full lg:block">
        <path
          data-sorriso
          d="M -40 800 C 380 975, 1000 960, 1500 610"
          fill="none"
          stroke="var(--color-rose-2)"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="relative mx-auto flex w-full max-w-[1500px] flex-1 flex-col px-5 pb-8 pt-6 sm:px-8 lg:px-14">
        {/* ---------- Topo ---------- */}
        <header className="flex items-baseline justify-between gap-4 text-sm">
          <span data-hero-meta data-gsap-pending className="font-display text-lg">
            {CLINICA.nome}
          </span>
          <nav data-hero-meta data-gsap-pending aria-label="Seções" className="hidden gap-8 text-tinta-soft md:flex">
            {[
              ["#tratamentos", "Tratamentos"],
              ["#sobre", "Sobre"],
              ["#duvidas", "Dúvidas"],
            ].map(([href, nome]) => (
              <a
                key={href}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(href);
                }}
                className="hover:text-tinta"
              >
                {nome}
              </a>
            ))}
          </nav>
          <a
            data-hero-meta
            data-gsap-pending
            href={whatsapp()}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-tinta pb-0.5 hover:border-rose hover:text-rose"
          >
            Agendar
          </a>
        </header>

        <div className="mt-10 grid flex-1 items-center gap-10 lg:mt-0 lg:grid-cols-12 lg:gap-12">
          {/* ---------- Foto (vídeo) ---------- */}
          <figure className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
            <div data-foto className="relative mx-auto aspect-[4/5] w-full max-w-[24rem] overflow-hidden bg-nude lg:max-w-none">
              <video
                ref={video}
                className="h-full w-full object-cover"
                src="/media/milena.mp4"
                poster="/media/milena-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-label="Dra. Milena Oliveira em seu consultório"
              />
            </div>
            <figcaption
              data-legenda
              data-gsap-pending
              className="mx-auto mt-3 flex max-w-[24rem] justify-between gap-4 text-xs text-tinta-soft lg:max-w-none"
            >
              <span>{CLINICA.nome}, no consultório</span>
              <span>Fortaleza, CE</span>
            </figcaption>
          </figure>

          {/* ---------- Texto ---------- */}
          <div data-hero-texto className="order-2 lg:order-1 lg:col-span-7">
            <p data-hero-fade data-gsap-pending className="text-sm text-rose sm:text-base">
              {CLINICA.profissao} em Fortaleza
            </p>
            <h1 className="font-display mt-4 text-[clamp(2.7rem,11.5vw,4.4rem)] leading-[1] lg:text-[clamp(4rem,6.6vw,7.8rem)] lg:leading-[0.98]">
              {LINHAS.map((l) => (
                <span key={l} className="block overflow-hidden pb-[0.06em]">
                  <span data-linha className="block">
                    {l}
                  </span>
                </span>
              ))}
            </h1>
            <p data-hero-fade data-gsap-pending className="mt-7 max-w-[30rem] text-base leading-relaxed text-tinta-soft sm:text-lg">
              Clínica geral, clareamento e botox, com uma avaliação cuidadosa antes de qualquer tratamento.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                data-hero-fade
                data-gsap-pending
                href={whatsapp()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cacau px-7 py-4 text-[15px] text-porcelana transition-colors hover:bg-rose"
              >
                Agendar avaliação pelo WhatsApp
              </a>
              <a
                data-hero-fade
                data-gsap-pending
                href="#tratamentos"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#tratamentos");
                }}
                className="border-b border-tinta/40 pb-0.5 text-[15px] hover:border-tinta"
              >
                Conhecer os tratamentos
              </a>
            </div>
          </div>
        </div>

        {/* ---------- Indicador de scroll ---------- */}
        <p data-hero-indicador data-gsap-pending aria-hidden className="mt-8 hidden text-xs text-tinta-soft lg:block">
          Role para conhecer ↓
        </p>
      </div>
    </section>
  );
}
