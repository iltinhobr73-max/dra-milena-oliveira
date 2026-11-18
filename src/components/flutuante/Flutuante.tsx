"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { whatsapp } from "@/content/clinica";

/**
 * Botão flutuante "Agendar" (WhatsApp com mensagem pronta). Aparece depois
 * do hero e some no fim, onde o convite já está na tela.
 */
export function Flutuante() {
  const root = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    const el = root.current!;
    gsap.matchMedia().add(
      { reduce: "(prefers-reduced-motion: reduce)" },
      (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean };
        let depoisDoHero = false;
        let noFim = false;
        const atualizar = () => {
          const show = depoisDoHero && !noFim;
          gsap.to(el, {
            autoAlpha: show ? 1 : 0,
            y: show ? 0 : 16,
            duration: reduce ? 0 : 0.8,
            ease: show ? "power3.out" : "power3.in",
            overwrite: true,
          });
        };
        gsap.set(el, { autoAlpha: 0, y: 16 });
        const hero = document.getElementById("top");
        const fim = document.getElementById("agendar");
        if (hero)
          ScrollTrigger.create({
            trigger: hero,
            start: "bottom 55%",
            onEnter: () => ((depoisDoHero = true), atualizar()),
            onLeaveBack: () => ((depoisDoHero = false), atualizar()),
          });
        if (fim) ScrollTrigger.create({ trigger: fim, start: "top 60%", onEnter: () => ((noFim = true), atualizar()), onLeaveBack: () => ((noFim = false), atualizar()) });
      },
    );
  });

  return (
    <a
      ref={root}
      href={whatsapp()}
      target="_blank"
      rel="noopener noreferrer"
      className="invisible fixed bottom-4 right-4 z-40 bg-cacau px-5 py-3.5 text-sm text-porcelana shadow-[0_12px_30px_-12px_rgba(20,12,9,0.55)] transition-colors hover:bg-rose sm:bottom-6 sm:right-6"
    >
      Agendar pelo WhatsApp
    </a>
  );
}
