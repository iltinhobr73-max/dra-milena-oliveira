"use client";

import { gsap } from "@/lib/gsap";

/**
 * Cabeçalho de seção como uma "aba" da escala de cor: uma amostra do tom,
 * o código (A2, A1, B1…) e o nome da seção. Descendo a página, os tons
 * clareiam — o site inteiro é um clareamento.
 */
export function SecaoHeader({
  tom,
  cor,
  titulo,
  escuro = false,
}: {
  tom: string;
  /** cor da amostra (variável CSS da escala) */
  cor: string;
  titulo: string;
  escuro?: boolean;
}) {
  return (
    <div className={`font-mono text-[11px] leading-none sm:text-xs ${escuro ? "text-porcelana/70" : "text-tinta-soft"}`}>
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-3">
          <span
            aria-hidden
            className={`block h-5 w-3 rounded-b-full border ${escuro ? "border-porcelana/30" : "border-tinta/15"}`}
            style={{ background: `var(${cor})` }}
          />
          <span className={escuro ? "text-porcelana" : "text-tinta"}>{tom}</span>
          <span>·</span>
          <span>{titulo}</span>
        </span>
        <span className="hidden sm:inline">Dra. Milena Oliveira</span>
      </div>
      <div data-secao-rule className={`mt-3 h-px w-full ${escuro ? "bg-rose-2/50" : "bg-tinta/20"}`} />
    </div>
  );
}

export const STAGGER = 0.2;
export const EASE_IN = "power3.out";

/**
 * Entrada padrão de uma seção, disparada pelo scroll:
 *  - [data-secao-rule] linha do cabeçalho traçada (expo.inOut)
 *  - [data-item]       elementos em sequência, 0.2s entre cada (power3.out)
 *  - [data-draw]       linhas traçadas da esquerda para a direita (expo.out)
 * Chame dentro do ramo "motion" de um gsap.matchMedia().
 */
export function revealSecao(q: (sel: string) => Element[], trigger: Element, start = "top 72%") {
  const rule = q("[data-secao-rule]");
  const items = q("[data-item]");
  const draws = q("[data-draw]");
  gsap.set(rule, { scaleX: 0, transformOrigin: "0% 50%" });
  gsap.set(items, { autoAlpha: 0, y: 28 });
  gsap.set(draws, { scaleX: 0, transformOrigin: "0% 50%" });
  return gsap
    .timeline({ scrollTrigger: { trigger, start, toggleActions: "play none none reverse" } })
    .to(rule, { scaleX: 1, duration: 1.2, ease: "expo.inOut" }, 0)
    .to(items, { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE_IN, stagger: STAGGER }, 0.3)
    .to(draws, { scaleX: 1, duration: 0.9, ease: "expo.out", stagger: STAGGER }, 0.8);
}
