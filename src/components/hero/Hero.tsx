"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScrollTo } from "@/components/providers/SmoothScroll";
import { CLINICA } from "@/content/clinica";
import { Logo } from "@/components/doc/Logo";

/**
 * Hero — "seu sorriso, no tom certo".
 *
 * Tensão tipográfica: antes de qualquer palavra, só a escala de cor aparece,
 * com o marcador parado no A3,5. A frase surge AMARELADA (no tom A3,5) e,
 * enquanto o marcador percorre a escala, ela clareia tom a tom até o branco
 * porcelana — o título passa por um clareamento.
 */

const ESCALA = [
  { tom: "A3,5", cor: "#d8bf8a" },
  { tom: "A3", cor: "#e2cc9d" },
  { tom: "A2", cor: "#ebdab6" },
  { tom: "A1", cor: "#f2e7cf" },
  { tom: "B1", cor: "#f7f0e3" },
  { tom: "BL2", cor: "#fbf6ee" },
  { tom: "BL1", cor: "#fdfbf8" },
];

const LINHAS = ["Seu sorriso,", "no tom certo."];

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
          const codigo = q("[data-codigo]")[0];
          const abas = q("[data-aba]") as HTMLElement[];
          const marcador = q("[data-marcador]")[0];
          const xDaAba = (i: number) => abas[i].offsetLeft + abas[i].offsetWidth / 2;

          if (reduce) {
            video.current?.pause();
            gsap.set(marcador, { x: xDaAba(abas.length - 1) });
            return;
          }

          /* ---------- Estado inicial ---------- */
          gsap.set(q("[data-hero-video]"), { autoAlpha: 0, scale: 1.08 });
          gsap.set(q("[data-hero-meta]"), { autoAlpha: 0, y: -10 });
          gsap.set(abas, { autoAlpha: 0, y: 14 });
          gsap.set(q("[data-escala-legenda]"), { autoAlpha: 0 });
          gsap.set(marcador, { autoAlpha: 0, x: xDaAba(0) });
          if (codigo) codigo.textContent = ESCALA[0].tom;
          gsap.set(q("[data-linha]"), { autoAlpha: 0, y: 40, filter: "blur(10px)", color: ESCALA[0].cor });
          gsap.set(q("[data-hero-fade]"), { autoAlpha: 0, y: 22 });
          gsap.set(q("[data-hero-indicador]"), { autoAlpha: 0 });

          // Clareamento: um número 0→1 que percorre a escala.
          const cor = gsap.utils.interpolate(ESCALA.map((e) => e.cor));
          const estado = { p: 0 };
          const aplicar = () => {
            const i = Math.round(estado.p * (ESCALA.length - 1));
            gsap.set(q("[data-linha]"), { color: cor(estado.p) });
            if (codigo) codigo.textContent = ESCALA[i].tom;
            const x = gsap.utils.interpolate(xDaAba(0), xDaAba(abas.length - 1), estado.p);
            gsap.set(marcador, { x });
          };

          gsap
            .timeline({ delay: 0.2 })
            .to(q("[data-hero-video]"), { autoAlpha: 1, scale: 1, duration: 2.4, ease: "power3.out" }, 0)
            .to(q("[data-hero-meta]"), { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.2 }, 0.2)
            // 1. Só a escala de cor, aba por aba. O marcador para no A3,5.
            .to(abas, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 }, 0.5)
            .to([marcador, ...q("[data-escala-legenda]")], { autoAlpha: 1, duration: 0.7, ease: "power3.out" }, 1.0)
            // 2. A frase aparece… amarelada.
            .to(q("[data-linha]"), { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: "power3.out", stagger: 0.2 }, 1.7)
            // 3. Clareia: o marcador percorre a escala e a tinta da frase acompanha.
            .to(estado, { p: 1, duration: 2.0, ease: "power3.inOut", onUpdate: aplicar }, 2.9)
            // 4. O resto.
            .to(q("[data-hero-fade]"), { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.2 }, 4.2)
            .to(q("[data-hero-indicador]"), { autoAlpha: 1, duration: 0.8, ease: "power3.out" }, 4.8);

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
          gsap.to(q("[data-hero-conteudo]"), { y: -70, autoAlpha: 0.2, ease: "power3.inOut", scrollTrigger: st });
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
      className="relative isolate flex h-svh min-h-[640px] w-full flex-col overflow-hidden bg-cacau text-porcelana"
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
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(36,26,23,0.9)_0%,rgba(36,26,23,0.55)_50%,rgba(36,26,23,0.15)_100%)]" />
      </div>

      <div
        data-hero-conteudo
        className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 pb-7 pt-6 sm:px-8 sm:pb-9 lg:px-14"
      >
        {/* ---------- Topo ---------- */}
        <div className="flex items-center justify-between gap-4">
          <span data-hero-meta data-gsap-pending>
            <Logo className="text-[15px] sm:text-[17px]" />
          </span>
          <span data-hero-meta data-gsap-pending className="hidden font-mono text-xs text-porcelana/65 md:inline">
            Clínica Geral · Clareamento · Botox
          </span>
          <a
            data-hero-meta
            data-gsap-pending
            href={CLINICA.agendamento}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-porcelana/30 px-4 py-2 font-mono text-[11px] text-porcelana transition-colors hover:border-rose-2 hover:text-rose-2 sm:text-xs"
          >
            Agendar
          </a>
        </div>

        {/* ---------- Escala de cor + título ---------- */}
        <div className="my-auto pt-10">
          <div className="relative w-max">
            <div className="flex items-end gap-1.5 sm:gap-2" aria-hidden>
              {ESCALA.map((e) => (
                <span key={e.tom} data-aba className="flex flex-col items-center gap-1.5">
                  <span
                    className="block h-8 w-4 rounded-b-full shadow-[inset_0_-6px_8px_rgba(0,0,0,0.08)] sm:h-10 sm:w-5"
                    style={{ background: e.cor }}
                  />
                  <span className="font-mono text-[8.5px] text-porcelana/50 sm:text-[9.5px]">{e.tom}</span>
                </span>
              ))}
            </div>
            {/* marcador que percorre a escala */}
            <span data-marcador aria-hidden className="absolute -top-3 left-0 block h-2 w-px bg-rose-2">
              <span className="absolute -left-[3px] -top-1.5 block size-[7px] rounded-full bg-rose-2" />
            </span>
          </div>
          <p data-escala-legenda className="mt-3 font-mono text-[11px] text-porcelana/60 sm:text-xs" aria-hidden>
            tom: <span data-codigo className="text-porcelana">BL1</span>
          </p>

          <h1 className="font-display mt-6 text-[clamp(3rem,13.5vw,10.5rem)] leading-[0.92] sm:mt-8 md:text-[clamp(3.6rem,11.2vw,12.5rem)]">
            {LINHAS.map((l, i) => (
              <span key={l} data-linha data-gsap-pending className="block whitespace-nowrap pb-[0.04em]">
                {i === 1 ? (
                  <>
                    no tom <em className="italic">certo.</em>
                  </>
                ) : (
                  l
                )}
              </span>
            ))}
          </h1>
        </div>

        {/* ---------- Base ---------- */}
        <div className="mt-8 grid gap-7 md:grid-cols-[minmax(0,32rem)_auto] md:items-end md:justify-between">
          <p data-hero-fade data-gsap-pending className="max-w-[32rem] text-base leading-relaxed text-porcelana/80 sm:text-lg">
            {CLINICA.profissao} em Fortaleza. Clínica geral, clareamento e botox — sempre com avaliação
            cuidadosa antes de qualquer tratamento.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:justify-end">
            <a
              data-hero-fade
              data-gsap-pending
              href={CLINICA.agendamento}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-6 rounded-full bg-rose-2 py-2 pl-6 pr-2 text-[15px] font-medium text-cacau transition-colors hover:bg-porcelana"
            >
              Agendar avaliação
              <span className="grid size-10 place-items-center rounded-full bg-cacau text-porcelana">↗</span>
            </a>
            <a
              data-hero-fade
              data-gsap-pending
              href="#tratamentos"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#tratamentos");
              }}
              className="px-2 py-3 text-center font-mono text-xs text-porcelana/75 underline decoration-porcelana/30 underline-offset-4 hover:text-porcelana"
            >
              Ver tratamentos
            </a>
          </div>
        </div>
      </div>

      {/* ---------- Indicador de scroll ---------- */}
      <div
        data-hero-indicador
        data-gsap-pending
        aria-hidden
        className="pointer-events-none absolute bottom-24 right-6 hidden lg:block xl:right-10"
      >
        <div data-hero-indicador-inner className="flex flex-col items-center gap-3">
          <span className="font-mono text-[10px] text-porcelana/60 [writing-mode:vertical-rl]">role</span>
          <span className="relative block h-14 w-px overflow-hidden bg-porcelana/20">
            <span data-hero-ponto className="absolute left-0 top-0 block h-2.5 w-px bg-rose-2" />
          </span>
        </div>
      </div>
    </section>
  );
}
