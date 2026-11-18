"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useNavegacao, useScrollTo } from "@/components/providers/SmoothScroll";
import { passoAPasso } from "@/lib/passoAPasso";
import { SecaoHeader } from "@/components/doc/Secao";
import { CLINICA, TRATAMENTOS } from "@/content/clinica";

/**
 * Tratamentos (tom A2) — seção fixada (pin) com câmera.
 *
 * Cada tratamento chega como um cartão porcelana que desliza de baixo e
 * pousa sobre o anterior; os de baixo recuam e escurecem. A câmera recua
 * enquanto o cartão está no ar e volta quando ele pousa. No cartão do
 * clareamento, o "antes e depois" é revelado pelo próprio scroll.
 *
 * Cartões/câmera/antes-depois = timeline com scrub. Conteúdo de cada cartão
 * = tempo real (stagger 0.2, power3.out) quando ele pousa.
 * Celular: uma passada = um tratamento (lib/passoAPasso).
 */

const STAGGER = 0.2;
const EASE_IN = "power3.out";
const T_OPEN = 0.7;
const T_DROP = 1.1;
const T_HOLD = 1.4;
const T_END = 1.0;
const TILT = [-1.8, 1.4, -1.1];

export function Tratamentos() {
  const root = useRef<HTMLElement>(null);
  const scrollTo = useScrollTo();
  const navegando = useNavegacao();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const section = root.current!;
      const stage = q("[data-stage]")[0] as HTMLElement;

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
            section.dataset.mode = "static";
            return;
          }
          section.dataset.mode = "camera";

          const camera = q("[data-camera]")[0];
          const cards = q("[data-card]") as HTMLElement[];
          const sombras = cards.map((c) => c.querySelector("[data-sombra]"));
          const H = () => stage.clientHeight;

          /* ---------- Coluna da esquerda ---------- */
          gsap.set(q("[data-intro]"), { autoAlpha: 0, y: 26 });
          gsap.to(q("[data-intro]"), {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: EASE_IN,
            stagger: STAGGER,
            scrollTrigger: { trigger: section, start: "top 65%", toggleActions: "play none none reverse" },
          });

          /* ---------- Conteúdo de cada cartão (tempo real) ---------- */
          const cardTls = cards.map((card) => {
            const items = card.querySelectorAll("[data-ci]");
            gsap.set(items, { autoAlpha: 0, y: 18 });
            return gsap.timeline({ paused: true }).to(items, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE_IN, stagger: STAGGER });
          });
          const visto = cards.map(() => false);
          const mostrar = (i: number, on: boolean) => {
            if (visto[i] === on) return;
            visto[i] = on;
            const tl = cardTls[i];
            if (on) return void tl.play(0);
            tl.pause();
            gsap.to(cards[i].querySelectorAll("[data-ci]"), {
              autoAlpha: 0,
              duration: 0.7,
              ease: "power3.in",
              overwrite: true,
              onComplete: () => {
                if (!visto[i]) tl.pause(0);
              },
            });
          };

          /* ---------- Índice + fecho ---------- */
          const idx = q("[data-idx]");
          gsap.set(q("[data-fecho]"), { autoAlpha: 0, y: 26 });
          let ativo = -2;
          let fechoOn = false;
          const setAtivo = (n: number) => {
            if (n === ativo) return;
            ativo = n;
            idx.forEach((el, k) =>
              gsap.to(el, {
                opacity: k === n ? 1 : k < n ? 0.55 : 0.3,
                x: k === n ? 10 : 0,
                duration: 0.7,
                ease: "power3.inOut",
                overwrite: true,
              }),
            );
          };
          const setFecho = (on: boolean) => {
            if (on === fechoOn) return;
            fechoOn = on;
            gsap.to(q("[data-fecho]"), {
              autoAlpha: on ? 1 : 0,
              y: on ? 0 : 26,
              duration: on ? 0.8 : 0.7,
              ease: on ? EASE_IN : "power3.in",
              stagger: on ? STAGGER : 0,
              overwrite: true,
            });
          };

          /* ---------- A pilha ---------- */
          cards.forEach((card, i) => gsap.set(card, { y: () => H() * 1.05, rotation: TILT[i] * 3, transformOrigin: "50% 100%" }));
          gsap.set(sombras, { opacity: 0 });
          gsap.set(camera, { scale: 1, transformOrigin: "50% 60%" });
          const cortina = q("[data-depois]");
          const linha = q("[data-divisa]");
          gsap.set(cortina, { clipPath: "inset(0% 100% 0% 0%)" });
          gsap.set(linha, { left: "0%" });

          const pousos: number[] = [];
          const tl = gsap.timeline({
            defaults: { ease: "power3.inOut" },
            onUpdate() {
              const t = tl.time();
              let n = -1;
              pousos.forEach((p, i) => {
                const on = t >= p - 0.06;
                mostrar(i, on);
                if (on) n = i;
              });
              setAtivo(n);
              setFecho(t >= tl.duration() - T_END + 0.2);
            },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              // altura estável (100svh); sem anticipatePin (ver CLAUDE.md)
              end: () => "+=" + stage.clientHeight * (desktop ? 4.6 : 2.6),
              pin: true,
              scrub: desktop ? 1.1 : 0.5,
              invalidateOnRefresh: true,
            },
          });

          tl.to({}, { duration: T_OPEN });
          tl.addLabel("abertura", T_OPEN * 0.5);
          cards.forEach((card, i) => {
            const at = tl.duration();
            tl.to(card, { y: 0, rotation: TILT[i], duration: T_DROP, ease: "power3.out" }, at);
            for (let j = 0; j < i; j++) {
              const d = i - j;
              tl.to(cards[j], { y: -(desktop ? 24 : 16) * d, scale: 1 - 0.05 * d, duration: T_DROP }, at);
              tl.to(sombras[j], { opacity: Math.min(0.55, 0.25 * d), duration: T_DROP }, at);
            }
            tl.to(camera, { scale: 0.95, duration: T_DROP / 2, ease: "power3.out" }, at);
            tl.to(camera, { scale: 1, duration: T_DROP / 2, ease: "power3.in" }, at + T_DROP / 2);
            pousos.push(at + T_DROP * 0.85);
            // clareamento: a cortina do "depois" corre enquanto o cartão está pousado
            if (card.querySelector("[data-depois]")) {
              tl.to(cortina, { clipPath: "inset(0% 0% 0% 0%)", duration: T_HOLD * 0.8 }, at + T_DROP);
              tl.to(linha, { left: "100%", duration: T_HOLD * 0.8 }, at + T_DROP);
            }
            tl.addLabel(`tratamento-${i + 1}`, at + T_DROP + T_HOLD * (card.querySelector("[data-depois]") ? 0.85 : 0.35));
            tl.to({}, { duration: T_HOLD });
          });
          tl.to(camera, { scale: 0.93, duration: T_END, ease: "power3.inOut" });
          tl.addLabel("fecho", tl.duration() - T_END * 0.25);

          // Celular: uma passada = um tratamento.
          if (!desktop) {
            const limpar = passoAPasso({ tl, section, alturaTela: H, scrollTo, navegando });
            ctx.add(() => limpar);
          }

          ScrollTrigger.refresh();
          return () => {
            delete section.dataset.mode;
          };
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="tratamentos" aria-labelledby="tratamentos-titulo" className="group/trat relative bg-cacau-2 text-porcelana">
      <div data-stage className="relative flex w-full flex-col overflow-hidden group-data-[mode=camera]/trat:h-svh">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_68%_55%,#4a372e_0%,#33261f_50%,#1f1613_100%)]"
        />

        <div className="relative z-20 mx-auto w-full max-w-[1600px] px-5 pt-6 sm:px-8 lg:px-14">
          <SecaoHeader tom="A2" cor="--color-a2" titulo="Tratamentos" escuro />
        </div>

        <div className="relative mx-auto grid w-full max-w-[1600px] flex-1 gap-8 px-5 pb-10 pt-8 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-14 lg:pb-12 lg:pt-12 group-data-[mode=camera]/trat:min-h-0 group-data-[mode=camera]/trat:grid-rows-[auto_1fr] lg:group-data-[mode=camera]/trat:grid-rows-1">
          {/* ---------- Coluna da esquerda ---------- */}
          <div className="flex flex-col lg:col-span-4 lg:justify-center">
            <p data-intro data-gsap-pending className="font-mono text-xs text-porcelana/60 sm:text-sm">
              O que eu faço por você
            </p>
            <h2
              id="tratamentos-titulo"
              data-intro
              data-gsap-pending
              className="font-display mt-3 text-[clamp(2.3rem,9.5vw,3.4rem)] leading-[0.95] lg:mt-4 lg:text-[clamp(3rem,4.4vw,5.4rem)]"
            >
              Três cuidados, <em className="italic text-rose-2">um</em> sorriso.
            </h2>

            <ol className="mt-10 hidden space-y-3 lg:block">
              {TRATAMENTOS.map((t, i) => (
                <li key={t.id} data-intro data-gsap-pending className="border-b border-porcelana/15 pb-3">
                  <span data-idx className="flex items-baseline gap-4 text-lg">
                    <span className="font-mono text-xs tabular-nums text-rose-2">{String(i + 1).padStart(2, "0")}</span>
                    {t.titulo}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-8 hidden lg:block">
              <p data-fecho data-gsap-pending className="font-display text-[clamp(1.8rem,2.4vw,2.6rem)] leading-[1]">
                Qual é o <em className="italic text-rose-2">seu</em> próximo passo?
              </p>
              <a
                data-fecho
                data-gsap-pending
                href={CLINICA.agendamento}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-6 rounded-full bg-rose-2 py-2 pl-6 pr-2 text-[15px] font-medium text-cacau transition-colors hover:bg-porcelana"
              >
                Agendar avaliação
                <span className="grid size-10 place-items-center rounded-full bg-cacau text-porcelana">↗</span>
              </a>
            </div>
          </div>

          {/* ---------- A pilha ---------- */}
          <div data-camera className="relative lg:col-span-7 lg:col-start-6 group-data-[mode=camera]/trat:min-h-0">
            <div className="flex flex-col gap-6 group-data-[mode=camera]/trat:absolute group-data-[mode=camera]/trat:inset-0 group-data-[mode=camera]/trat:block">
              {TRATAMENTOS.map((t, i) => (
                <article
                  key={t.id}
                  data-card
                  aria-label={t.titulo}
                  className="w-full overflow-hidden rounded-[28px] bg-porcelana text-tinta shadow-[0_2px_0_rgba(0,0,0,0.12),0_40px_80px_-24px_rgba(10,6,4,0.7)] group-data-[mode=camera]/trat:absolute group-data-[mode=camera]/trat:inset-x-0 group-data-[mode=camera]/trat:bottom-[5%] lg:group-data-[mode=camera]/trat:bottom-[9%] lg:group-data-[mode=camera]/trat:left-[3%] lg:group-data-[mode=camera]/trat:right-[3%]"
                >
                  <div className="relative grid gap-5 p-5 sm:grid-cols-[1fr_minmax(0,15rem)] sm:gap-8 sm:p-8 lg:grid-cols-[1fr_minmax(0,17rem)]">
                    <div>
                      <p data-ci data-gsap-pending className="flex items-center gap-3 font-mono text-[11px] text-tinta-soft sm:text-xs">
                        <span
                          aria-hidden
                          className="block h-5 w-3 rounded-b-full border border-tinta/15"
                          style={{ background: `var(--color-${t.tom.toLowerCase()})` }}
                        />
                        <span className="text-tinta">{String(i + 1).padStart(2, "0")}</span> · tom {t.tom}
                      </p>
                      <h3 data-ci data-gsap-pending className="font-display mt-3 text-[2.2rem] leading-[0.95] sm:mt-4 sm:text-[3rem]">
                        {t.titulo}
                      </h3>
                      <p data-ci data-gsap-pending className="mt-3 text-[15px] leading-snug text-tinta-soft sm:text-lg">
                        {t.resumo}
                      </p>
                      <ul className="mt-4 hidden space-y-2 sm:block">
                        {t.itens.map((it) => (
                          <li key={it} data-ci data-gsap-pending className="flex gap-3 border-t border-tinta/10 pt-2 text-[15px]">
                            <span className="text-rose">—</span>
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* visual de cada cartão */}
                    <div data-ci data-gsap-pending className="relative">
                      {t.id === "clareamento" ? (
                        <figure className="relative aspect-[612/301] w-full overflow-hidden rounded-2xl sm:aspect-[4/5]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/media/antes.jpg" alt="Antes do clareamento" className="absolute inset-0 h-full w-full object-cover" />
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            data-depois
                            src="/media/depois.jpg"
                            alt="Depois do clareamento"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <span data-divisa aria-hidden className="absolute inset-y-0 block w-0.5 bg-porcelana/90" />
                          <figcaption className="absolute inset-x-2 bottom-2 flex justify-between font-mono text-[10px] text-porcelana">
                            <span className="rounded-full bg-cacau/60 px-2 py-0.5">antes</span>
                            <span className="rounded-full bg-cacau/60 px-2 py-0.5">depois</span>
                          </figcaption>
                        </figure>
                      ) : t.id === "botox" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src="/media/procedimento.jpg"
                          alt="Dra. Milena aplicando toxina botulínica"
                          className="hidden aspect-[4/5] w-full rounded-2xl object-cover sm:block"
                        />
                      ) : (
                        <div className="hidden aspect-[4/5] w-full flex-col justify-between rounded-2xl bg-nude p-5 sm:flex">
                          <span className="font-mono text-[11px] text-tinta-soft">primeira consulta</span>
                          <span className="font-display text-[2rem] italic leading-[1.05]">
                            Avaliar antes de tratar.
                          </span>
                        </div>
                      )}
                    </div>

                    <div data-sombra aria-hidden className="pointer-events-none absolute inset-0 bg-cacau opacity-0" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
