"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScrollTo } from "@/components/providers/SmoothScroll";
import { CLINICA, whatsapp } from "@/content/clinica";

/**
 * Hero escuro com fundo fixo em movimento.
 *
 * - Fundo: vídeo de luz perolada em loop, FIXO na tela (a seção é recortada
 *   com clip-path e o vídeo é position: fixed — a página rola por cima dele).
 * - Na frente: a Dra. Milena recortada (sem o fundo da foto), PARADA.
 * - Tensão: só a luz se move; ela surge; então a frase entra palavra por palavra.
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
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          const { reduce } = ctx.conditions as { reduce: boolean };
          gsap.set(q("[data-gsap-pending]"), { autoAlpha: 1 });
          if (reduce) {
            video.current?.pause();
            return;
          }

          gsap.set(q("[data-fundo]"), { autoAlpha: 0 });
          gsap.set(q("[data-hero-meta]"), { autoAlpha: 0, y: -10 });
          gsap.set(q("[data-ela]"), { autoAlpha: 0, y: 60 });
          gsap.set(q("[data-palavra]"), { yPercent: 110 });
          gsap.set(q("[data-hero-fade]"), { autoAlpha: 0, y: 20 });
          gsap.set(q("[data-hero-indicador]"), { autoAlpha: 0 });

          gsap
            .timeline({ delay: 0.15 })
            // 1. Só a luz, se movendo no escuro.
            .to(q("[data-fundo]"), { autoAlpha: 1, duration: 1.8, ease: "power3.out" }, 0)
            .to(q("[data-hero-meta]"), { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.2 }, 0.4)
            // 2. Ela surge (e fica parada).
            .to(q("[data-ela]"), { autoAlpha: 1, y: 0, duration: 1.6, ease: "expo.out" }, 0.9)
            // 3. A frase, palavra por palavra.
            .to(q("[data-palavra]"), { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.12 }, 1.6)
            .to(q("[data-hero-fade]"), { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.2 }, 2.5)
            .to(q("[data-hero-indicador]"), { autoAlpha: 1, duration: 0.8, ease: "power3.out" }, 3.1);

          gsap.to(q("[data-hero-indicador]"), {
            autoAlpha: 0,
            ease: "power3.out",
            scrollTrigger: { trigger: root.current, start: "top top", end: "+=140", scrub: true },
          });
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
      // clip-path recorta o vídeo fixo à área do hero: efeito de fundo fixo
      className="relative isolate h-svh min-h-[620px] w-full overflow-hidden bg-cacau text-porcelana [clip-path:inset(0)] lg:min-h-[700px]"
    >
      {/* ---------- Fundo fixo em movimento ---------- */}
      <div data-fundo aria-hidden className="fixed inset-0 -z-20 h-svh w-full">
        <video
          ref={video}
          className="h-full w-full object-cover"
          src="/media/fundo.mp4"
          poster="/media/fundo-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
      {/* véu para o texto (esquerda no computador; topo e base no celular) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(36,26,23,0.75)_0%,rgba(36,26,23,0)_38%,rgba(36,26,23,0)_62%,rgba(36,26,23,0.9)_100%)] lg:bg-[linear-gradient(90deg,rgba(36,26,23,0.85)_0%,rgba(36,26,23,0.35)_45%,rgba(36,26,23,0)_70%)]"
      />

      {/* ---------- Ela, parada ---------- */}
      {/* o invólucro posiciona (classes do Tailwind); a imagem de dentro é que o GSAP anima */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[64%] -translate-x-1/2 lg:left-auto lg:right-[4%] lg:h-[92%] lg:translate-x-0 xl:right-[8%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-ela
          data-gsap-pending
          src="/media/milena-recorte.webp"
          alt="Dra. Milena Oliveira, cirurgiã-dentista"
          fetchPriority="high"
          className="h-full w-auto max-w-none select-none"
        />
      </div>
      {/* base em degradê para a foto "assentar" na tela */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-[18%] bg-gradient-to-t from-cacau to-transparent" />

      <div className="relative mx-auto flex h-full w-full max-w-[1600px] flex-col px-5 pb-7 pt-6 sm:px-8 lg:px-14 lg:pb-10">
        {/* ---------- Topo ---------- */}
        <header className="flex items-center justify-between gap-6 text-sm">
          <span data-hero-meta data-gsap-pending className="font-display text-lg lg:text-xl">
            {CLINICA.nome}
          </span>
          <nav data-hero-meta data-gsap-pending aria-label="Seções" className="hidden gap-8 text-porcelana/75 md:flex">
            <a href="#tratamentos" onClick={ancora("#tratamentos")} className="hover:text-porcelana">Tratamentos</a>
            <a href="#sobre" onClick={ancora("#sobre")} className="hover:text-porcelana">Sobre</a>
            <a href="#duvidas" onClick={ancora("#duvidas")} className="hover:text-porcelana">Dúvidas</a>
          </nav>
        </header>

        {/* ---------- Texto ---------- */}
        <div className="mt-6 flex flex-1 flex-col justify-between lg:mt-0 lg:max-w-[46rem] lg:justify-center">
          <div>
            <p data-hero-fade data-gsap-pending className="text-sm text-rose-2 sm:text-base">
              {CLINICA.profissao} · Fortaleza, CE
            </p>
            <h1 className="font-display mt-3 text-[clamp(2.4rem,11vw,4.4rem)] leading-[0.98] lg:mt-5 lg:text-[clamp(4.2rem,6.4vw,8rem)] lg:leading-[0.95] [@media(max-height:620px)]:text-[2.2rem]">
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
            <p data-hero-fade data-gsap-pending className="mt-7 hidden max-w-[28rem] text-lg leading-relaxed text-porcelana/80 lg:block">
              Clínica geral, clareamento e botox — com uma avaliação cuidadosa antes de qualquer tratamento.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8 lg:mt-10">
            <a
              data-hero-fade
              data-gsap-pending
              href={whatsapp()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-rose-2 px-7 py-4 text-center text-[15px] font-medium text-cacau transition-colors hover:bg-porcelana"
            >
              Agendar avaliação pelo WhatsApp
            </a>
            <a
              data-hero-fade
              data-gsap-pending
              href="#tratamentos"
              onClick={ancora("#tratamentos")}
              className="self-center border-b border-porcelana/40 pb-0.5 text-[15px] text-porcelana/90 hover:border-porcelana sm:self-auto"
            >
              Conhecer os tratamentos
            </a>
          </div>
        </div>

        <p data-hero-indicador data-gsap-pending aria-hidden className="mt-8 hidden text-xs text-porcelana/60 lg:block">
          Role para conhecer ↓
        </p>
      </div>
    </section>
  );
}
