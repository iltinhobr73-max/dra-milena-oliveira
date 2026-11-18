"use client";

import { gsap } from "@/lib/gsap";

/** Cabeçalho de seção: só o nome, pequeno, sobre uma linha fina. */
export function SecaoHeader({ titulo, escuro = false }: { numero?: string; titulo: string; escuro?: boolean }) {
  return (
    <div className={`text-sm ${escuro ? "text-rose-2" : "text-rose"}`}>
      <p>{titulo}</p>
      <div data-secao-rule className={`mt-3 h-px w-full ${escuro ? "bg-porcelana/15" : "bg-tinta/15"}`} />
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
