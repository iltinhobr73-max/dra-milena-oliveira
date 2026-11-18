"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScrollTo } from "@/components/providers/SmoothScroll";
import { CLINICA, whatsapp } from "@/content/clinica";

/**
 * Hero em tela cheia.
 *
 * Computador: tela dividida de ponta a ponta — à direita, a Dra. Milena em
 * vídeo (aproximação lenta) do topo ao rodapé; à esquerda, painel nude com
 * o lema em letra grande.
 * Celular: ela ocupa a tela inteira; o texto fica sobre um degradê embaixo.
 *
 * Tensão antes da primeira palavra: a tela abre como cortina — o painel
 * desliza, a foto sobe — e só então a frase entra, palavra por palavra.
 */

const FRASE = ["Transformando", "vidas", "através", "do", "sorriso."];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const scrollTo = useScrollTo();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.matchMedia().add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
          desktop: "(min-width: 1024px)",
        },
        (ctx) => {
          const { reduce, desktop } = ctx.conditions as { reduce: boolean; desktop: boolean };
          gsap.set(q("[data-gsap-pending]"), { autoAlpha: 1 });
          if (reduce) {
            video.current?.pause();
            return;
          }

          /* ---------- Estado inicial ---------- */
          gsap.set(q("[data-painel]"), { scaleX: 0, transformOrigin: "0% 50%" });
          gsap.set(q("[data-foto]"), { clipPath: "inset(100% 0% 0% 0%)" });
          gsap.set(q("[data-foto] video"), { scale: 1.18 });
          gsap.set(q("[data-hero-meta]"), { autoAlpha: 0, y: -10 });
          gsap.set(q("[data-palavra]"), { yPercent: 110 });
          gsap.set(q("[data-hero-fade]"), { autoAlpha: 0, y: 20 });
          gsap.set(q("[data-hero-indicador]"), { autoAlpha: 0 });

          gsap
            .timeline({ delay: 0.15 })
            // 1. A cortina: o painel nude desliza (no celular, direto a foto).
            .to(q("[data-painel]"), { scaleX: 1, duration: 1.2, ease: "expo.inOut" }, 0)
            // 2. Ela sobe, ocupando o quadro.
            .to(q("[data-foto]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" }, desktop ? 0.6 : 0.1)
            .to(q("[data-foto] video"), { scale: 1, duration: 2.4, ease: "expo.out" }, desktop ? 0.8 : 0.3)
            .to(q("[data-hero-meta]"), { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.2 }, 1.4)
            // 3. Só então a frase, palavra por palavra.
            .to(q("[data-palavra]"), { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.12 }, 1.7)
            .to(q("[data-hero-fade]"), { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.2 }, 2.6)
            .to(q("[data-hero-indicador]"), { autoAlpha: 1, duration: 0.8, ease: "power3.out" }, 3.2);

          /* ---------- Scroll ---------- */
          const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
          gsap.to(q("[data-hero-indicador]"), {
            autoAlpha: 0,
            ease: "power3.out",
            scrollTrigger: { trigger: root.current, start: "top top", end: "+=140", scrub: true },
          });
          gsap.to(q("[data-foto] video"), { yPercent: 8, ease: "power3.inOut", scrollTrigger: st });
          gsap.to(q("[data-hero-texto]"), { y: -60, ease: "power3.inOut", scrollTrigger: st });
        },
      );
    },
    { scope: root },
  );

  const ancora = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(href);
  };

  return (
    <section
      ref={root}
      id="top"
      aria-label="Início"
      className="relative isolate h-svh min-h-[620px] w-full overflow-hidden bg-cacau text-porcelana lg:min-h-[700px] lg:bg-porcelana lg:text-tinta"
    >
      {/* ---------- Painel nude (computador) ---------- */}
      <div data-painel aria-hidden className="absolute inset-y-0 left-0 -z-10 hidden w-[56%] bg-nude lg:block" />

      {/* ---------- Ela, em vídeo, de ponta a ponta ---------- */}
      <div data-foto className="absolute inset-x-0 top-0 -z-20 h-[66%] overflow-hidden lg:inset-y-0 lg:left-[56%] lg:right-0 lg:z-0 lg:h-auto">
        <video
          ref={video}
          className="h-full w-full object-cover object-[50%_18%] lg:object-[50%_22%]"
          src="/media/milena.mp4"
          poster="/media/milena-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Dra. Milena Oliveira em seu consultório"
        />
        {/* celular: degradê para o texto embaixo */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,#241a17_0%,rgba(36,26,23,0.7)_22%,rgba(36,26,23,0)_50%,rgba(36,26,23,0)_82%,rgba(36,26,23,0.45)_100%)] lg:hidden" />
      </div>

      <div className="relative mx-auto flex h-full w-full max-w-[1600px] flex-col px-5 pb-8 pt-6 sm:px-8 lg:px-14 lg:pb-10">
        {/* ---------- Topo ---------- */}
        <header className="flex items-center justify-between gap-6 text-sm lg:w-[calc(56%-3.5rem)]">
          <span data-hero-meta data-gsap-pending className="font-display text-lg lg:text-xl">
            {CLINICA.nome}
          </span>
          <nav data-hero-meta data-gsap-pending aria-label="Seções" className="hidden gap-7 text-tinta-soft xl:flex">
            <a href="#tratamentos" onClick={ancora("#tratamentos")} className="hover:text-tinta">Tratamentos</a>
            <a href="#sobre" onClick={ancora("#sobre")} className="hover:text-tinta">Sobre</a>
            <a href="#duvidas" onClick={ancora("#duvidas")} className="hover:text-tinta">Dúvidas</a>
          </nav>
        </header>

        {/* ---------- Texto ---------- */}
        <div data-hero-texto className="mt-auto lg:my-auto lg:w-[calc(56%-5rem)]">
          <p data-hero-fade data-gsap-pending className="text-sm text-rose-2 sm:text-base lg:text-rose">
            {CLINICA.profissao} · Fortaleza, CE
          </p>
          <h1 className="font-display mt-3 text-[clamp(2.9rem,13.2vw,4.6rem)] leading-[0.98] [@media(max-height:620px)]:text-[2.4rem] lg:mt-5 lg:text-[clamp(4.2rem,6.3vw,8rem)] lg:leading-[0.95]">
            <span className="sr-only">{FRASE.join(" ")}</span>
            <span aria-hidden className="flex flex-wrap gap-x-[0.24em]">
              {FRASE.map((p, i) => (
                <span key={i} className={`overflow-hidden pb-[0.08em] ${i === 0 ? "basis-full" : ""}`}>
                  <span data-palavra className="block">
                    {p}
                  </span>
                </span>
              ))}
            </span>
          </h1>
          <p data-hero-fade data-gsap-pending className="mt-5 max-w-[28rem] text-base [@media(max-height:620px)]:hidden leading-relaxed text-porcelana/85 lg:mt-7 lg:text-lg lg:text-tinta-soft">
            Clínica geral, clareamento e botox — com uma avaliação cuidadosa antes de qualquer tratamento.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8 lg:mt-10">
            <a
              data-hero-fade
              data-gsap-pending
              href={whatsapp()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-rose-2 px-7 py-4 text-center text-[15px] font-medium text-cacau transition-colors hover:bg-porcelana lg:bg-cacau lg:text-porcelana lg:hover:bg-rose"
            >
              Agendar avaliação pelo WhatsApp
            </a>
            <a
              data-hero-fade
              data-gsap-pending
              href="#tratamentos"
              onClick={ancora("#tratamentos")}
              className="self-center border-b border-current/40 pb-0.5 text-[15px] opacity-90 hover:opacity-100 sm:self-auto"
            >
              Conhecer os tratamentos
            </a>
          </div>
        </div>

        {/* ---------- Indicador de scroll ---------- */}
        <p data-hero-indicador data-gsap-pending aria-hidden className="mt-10 hidden text-xs text-tinta-soft lg:block">
          Role para conhecer ↓
        </p>
      </div>
    </section>
  );
}
