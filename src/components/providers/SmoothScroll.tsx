"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type ScrollTarget = string | number | HTMLElement;
type ScrollToOptions = {
  offset?: number;
  /** segundos (padrão 1.6) */
  duration?: number;
  /** curva: "expo.out" (padrão) ou "power3.inOut" */
  ease?: "expo.out" | "power3.inOut";
  /** bloqueia a rolagem do usuário durante o movimento */
  lock?: boolean;
  onComplete?: () => void;
  /**
   * Movimento interno de um componente (ex.: passo-a-passo da leitura guiada).
   * Sem isso, o movimento conta como NAVEGAÇÃO (âncora/sumário): componentes
   * que reagem ao scroll devem deixá-la passar (ver `useNavegacao`).
   */
  interno?: boolean;
};
type ScrollToFn = (target: ScrollTarget, options?: ScrollToOptions) => void;

// As curvas do GSAP, para o Lenis (só power3/expo — ver CLAUDE.md).
const EASINGS = {
  "expo.out": (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  "power3.inOut": (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};

type ScrollApi = {
  scrollTo: ScrollToFn;
  lock: () => void;
  unlock: () => void;
  navegando: () => boolean;
};

const ScrollContext = createContext<ScrollApi>({
  scrollTo: () => {},
  lock: () => {},
  unlock: () => {},
  navegando: () => false,
});

/** Evento disparado no window quando uma navegação (âncora/sumário) termina. */
export const FIM_NAVEGACAO = "lenis:fim-navegacao";

/** Rola até um alvo pelo Lenis (ou scroll nativo instantâneo com reduced motion). */
export const useScrollTo = () => useContext(ScrollContext).scrollTo;

/** `navegando()` = true enquanto o Lenis leva a página até uma âncora. */
export const useNavegacao = () => useContext(ScrollContext).navegando;

/** Trava/destrava o scroll da página (ex.: sobreposição aberta). */
export const useScrollLock = () => {
  const { lock, unlock } = useContext(ScrollContext);
  return { lock, unlock };
};

/**
 * Instância única de Lenis do site, rodando no ticker do GSAP e
 * sincronizada com o ScrollTrigger. Com prefers-reduced-motion, fica
 * desligada e o scroll é o nativo.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const navegandoRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback<ScrollToFn>((target, options) => {
    const lenis = lenisRef.current;
    const navegacao = !options?.interno;
    if (navegacao) navegandoRef.current = true;
    const terminou = () => {
      options?.onComplete?.();
      if (navegacao) {
        navegandoRef.current = false;
        window.dispatchEvent(new Event(FIM_NAVEGACAO));
      }
    };
    // Âncora de uma seção fixada (pin): o elemento pode estar "estacionado" no
    // fim do pin; o destino certo é o início dela (o pin-spacer).
    let extra = 0;
    if (typeof target === "string") {
      const el = document.querySelector<HTMLElement>(target);
      const pai = el?.parentElement;
      if (pai?.classList.contains("pin-spacer")) {
        target = pai;
        extra = 2; // 2px para dentro: na borda exata a seção ainda não conta como ativa
      }
    }
    if (lenis) {
      lenis.scrollTo(target, {
        offset: (options?.offset ?? 0) + extra,
        duration: options?.duration ?? 1.6,
        easing: EASINGS[options?.ease ?? "expo.out"],
        lock: options?.lock ?? false,
        force: true,
        onComplete: terminou,
      });
      return;
    }
    // Fallback sem Lenis (reduced motion): salto direto, sem suavização.
    const el =
      typeof target === "string"
        ? document.querySelector<HTMLElement>(target)
        : typeof target === "number"
          ? null
          : target;
    const top =
      typeof target === "number"
        ? target
        : el
          ? el.getBoundingClientRect().top + window.scrollY
          : 0;
    window.scrollTo({ top: top + (options?.offset ?? 0) + extra, behavior: "instant" });
    terminou();
  }, []);

  const lock = useCallback(() => {
    if (lenisRef.current) lenisRef.current.stop();
    else document.documentElement.style.overflow = "hidden";
  }, []);
  const unlock = useCallback(() => {
    if (lenisRef.current) lenisRef.current.start();
    else document.documentElement.style.overflow = "";
  }, []);

  const navegando = useCallback(() => navegandoRef.current, []);
  const api = useMemo(() => ({ scrollTo, lock, unlock, navegando }), [scrollTo, lock, unlock, navegando]);

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}
