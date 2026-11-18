"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScrollTo } from "@/components/providers/SmoothScroll";
import { CLINICA, whatsapp } from "@/content/clinica";
import { Logo } from "@/components/doc/Logo";

/**
 * Hero — foto da Dra. Milena + o lema dela.
 *
 * Tensão antes da primeira palavra: só uma linha rosé se desenha e o nome
 * dela aparece; a foto se revela de baixo para cima num arco; só então a
 * frase sobe, linha a linha, de dentro de máscaras.
 */

const LINHAS: { texto: string; enfase?: boolean }[] = [
  { texto: "Transformando" },
  { texto: "vidas através" },
  { texto: "do sorriso.", enfase: true },
];
const FRASE = LINHAS.map((l) => l.texto).join(" ");

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

          /* ---------- Estado inicial ---------- */
          gsap.set(q("[data-hero-video]"), { autoAlpha: 0, scale: 1.08 });
          gsap.set(q("[data-hero-meta]"), { autoAlpha: 0, y: -10 });
          gsap.set(q("[data-fio]"), { scaleY: 0, transformOrigin: "50% 0%" });
          gsap.set(q("[data-assinatura]"), { autoAlpha: 0, y: 12 });
          gsap.set(q("[data-foto]"), { clipPath: "inset(100% 0% 0% 0% round 999px 999px 0px 0px)" });
          gsap.set(q("[data-foto-img]"), { scale: 1.25 });
          gsap.set(q("[data-linha]"), { yPercent: 115 });
          gsap.set(q("[data-hero-fade]"), { autoAlpha: 0, y: 22 });
          gsap.set(q("[data-hero-indicador]"), { autoAlpha: 0 });

          gsap
            .timeline({ delay: 0.2 })
            .to(q("[data-hero-video]"), { autoAlpha: 1, scale: 1, duration: 2.2, ease: "power3.out" }, 0)
            .to(q("[data-hero-meta]"), { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.2 }, 0.2)
            // 1. Silêncio: uma linha rosé desce e o nome dela aparece.
            .to(q("[data-fio]"), { scaleY: 1, duration: 1.2, ease: "expo.inOut" }, 0.5)
            .to(q("[data-assinatura]"), { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 1.0)
            // 2. A foto se revela de baixo para cima, num arco.
            .to(q("[data-foto]"), { clipPath: "inset(0% 0% 0% 0% round 999px 999px 0px 0px)", duration: 1.5, ease: "expo.inOut" }, 1.4)
            .to(q("[data-foto-img]"), { scale: 1, duration: 2.0, ease: "expo.out" }, 1.6)
            // 3. Só então a frase, linha a linha.
            .to(q("[data-linha]"), { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.2 }, 2.4)
            .to(q("[data-hero-fade]"), { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.2 }, 3.2)
            .to(q("[data-hero-indicador]"), { autoAlpha: 1, duration: 0.8, ease: "power3.out" }, 3.9);

          gsap
            .timeline({ repeat: -1, repeatDelay: 0.4 })
            .fromTo(q("[data-hero-ponto]"), { y: 0, autoAlpha: 0 }, { y: 44, autoAlpha: 1, duration: 1.2, ease: "power3.inOut" })
            .to(q("[data-hero-ponto]"), { autoAlpha: 0, duration: 0.6, ease: "power3.in" });

          /* ---------- Scroll ---------- */
          const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
          gsap.to(q("[data-hero-indicador-inner]"), {
            autoAlpha: 0,
            y: 20,
            ease: "power3.out",
            scrollTrigger: { trigger: root.current, start: "top top", end: "+=160", scrub: true },
          });
          gsap.to(q("[data-hero-video-wrap]"), { yPercent: 14, ease: "power3.inOut", scrollTrigger: st });
          gsap.to(q("[data-foto-img]"), { yPercent: -7, ease: "power3.inOut", scrollTrigger: st });
          gsap.to(q("[data-hero-texto]"), { y: -60, autoAlpha: 0.2, ease: "power3.inOut", scrollTrigger: st });
        },
      );
    },
    { scope: root },
  );

  const ancora = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(id);
  };

  return (
    <section
      ref={root}
      id="top"
      aria-label="Início"
      className="relative isolate flex min-h-svh w-full flex-col overflow-hidden bg-cacau text-porcelana lg:h-svh lg:min-h-[680px]"
    >
      {/* ---------- Vídeo: luz perolada ---------- */}
      <div data-hero-video-wrap aria-hidden className="absolute inset-0 -z-10">
        <video
          ref={video}
          data-hero-video
          className="h-full w-full object-cover"
          src="/media/perola.mp4"
          poster="/media/perola-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(36,26,23,0.92)_0%,rgba(36,26,23,0.6)_55%,rgba(36,26,23,0.35)_100%)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 pb-8 pt-6 sm:px-8 lg:px-14">
        {/* ---------- Topo ---------- */}
        <div className="flex items-center justify-between gap-4">
          <span data-hero-meta data-gsap-pending>
            <Logo className="text-[15px] sm:text-[17px]" />
          </span>
          <nav data-hero-meta data-gsap-pending aria-label="Seções" className="hidden gap-7 font-mono text-xs text-porcelana/70 md:flex">
            <a href="#tratamentos" onClick={ancora("#tratamentos")} className="hover:text-porcelana">Tratamentos</a>
            <a href="#sobre" onClick={ancora("#sobre")} className="hover:text-porcelana">Sobre</a>
            <a href="#duvidas" onClick={ancora("#duvidas")} className="hover:text-porcelana">Dúvidas</a>
          </nav>
          <a
            data-hero-meta
            data-gsap-pending
            href={whatsapp()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-porcelana/30 px-4 py-2 font-mono text-[11px] text-porcelana transition-colors hover:border-rose-2 hover:text-rose-2 sm:text-xs"
          >
            WhatsApp
          </a>
        </div>

        <div className="mt-8 grid flex-1 items-center gap-10 lg:mt-0 lg:grid-cols-12 lg:gap-8">
          {/* ---------- Foto ---------- */}
          <div className="relative order-1 lg:order-2 lg:col-span-5 lg:col-start-8 lg:self-end">
            <span data-fio aria-hidden className="absolute -top-2 left-1/2 hidden h-16 w-px bg-rose-2 lg:block" />
            <div
              data-foto
              className="relative mx-auto aspect-[4/5] w-[min(78%,20rem)] overflow-hidden rounded-t-[999px] lg:w-full lg:max-w-[32rem]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                data-foto-img
                src="/media/perfil.jpg"
                alt="Dra. Milena Oliveira, cirurgiã-dentista"
                className="h-[110%] w-full object-cover object-[50%_25%]"
                fetchPriority="high"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-cacau/70 to-transparent" />
            </div>
            <p
              data-assinatura
              data-gsap-pending
              className="mx-auto mt-4 w-[min(78%,20rem)] font-mono text-[11px] text-porcelana/70 lg:w-full lg:max-w-[32rem] lg:text-xs"
            >
              {CLINICA.nome} · {CLINICA.profissao} · {CLINICA.cidade}
            </p>
          </div>

          {/* ---------- Texto ---------- */}
          <div data-hero-texto className="order-2 lg:order-1 lg:col-span-7">
            <h1 className="font-display text-[clamp(2.9rem,13vw,4.6rem)] leading-[0.95] lg:text-[clamp(4rem,7.2vw,8.6rem)]">
              <span className="sr-only">{FRASE}</span>
              <span aria-hidden>
                {LINHAS.map((l) => (
                  <span key={l.texto} className="block overflow-hidden pb-[0.08em]">
                    <span data-linha className={`block whitespace-nowrap ${l.enfase ? "italic text-rose-2" : ""}`}>
                      {l.texto}
                    </span>
                  </span>
                ))}
              </span>
            </h1>
            <p data-hero-fade data-gsap-pending className="mt-7 max-w-[32rem] text-base leading-relaxed text-porcelana/80 sm:text-lg">
              Clínica geral, clareamento e botox em Fortaleza — sempre com uma avaliação cuidadosa antes de qualquer
              tratamento.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                data-hero-fade
                data-gsap-pending
                href={whatsapp()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between gap-6 rounded-full bg-rose-2 py-2 pl-6 pr-2 text-[15px] font-medium text-cacau transition-colors hover:bg-porcelana"
              >
                Agendar pelo WhatsApp
                <span className="grid size-10 place-items-center rounded-full bg-cacau text-porcelana">↗</span>
              </a>
              <a
                data-hero-fade
                data-gsap-pending
                href="#tratamentos"
                onClick={ancora("#tratamentos")}
                className="px-2 py-3 text-center font-mono text-xs text-porcelana/75 underline decoration-porcelana/30 underline-offset-4 hover:text-porcelana"
              >
                Ver tratamentos
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Indicador de scroll ---------- */}
      <div data-hero-indicador data-gsap-pending aria-hidden className="pointer-events-none absolute bottom-8 left-1/2 hidden lg:block">
        <div data-hero-indicador-inner className="flex flex-col items-center gap-3">
          <span className="font-mono text-[10px] text-porcelana/60">role</span>
          <span className="relative block h-14 w-px overflow-hidden bg-porcelana/20">
            <span data-hero-ponto className="absolute left-0 top-0 block h-2.5 w-px bg-rose-2" />
          </span>
        </div>
      </div>
    </section>
  );
}
