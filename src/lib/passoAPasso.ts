"use client";

import { ScrollTrigger } from "@/lib/gsap";
import { FIM_NAVEGACAO } from "@/components/providers/SmoothScroll";

type ScrollToFn = (
  target: number,
  options: { duration: number; ease: "power3.inOut"; lock: boolean; interno: boolean; onComplete: () => void },
) => void;

/**
 * Celular: UMA passada = UMA parada numa seção fixada (pin).
 *
 * Dentro da seção, o gesto vira comando: o Observer do GSAP lê a direção da
 * passada (e bloqueia a rolagem livre) e o Lenis leva a página até a próxima
 * parada (labels da timeline). Nas pontas, o gesto devolve a rolagem e sai.
 *
 * Testado no projeto anterior (site-consorcios): passadas de 60 a 600px,
 * navegação por âncora atravessando a seção, recarregar a página abaixo dela.
 * Regras que NÃO podem sair daqui:
 *  - ignorar a entrada durante uma navegação (âncora) e assumir se ela terminar dentro;
 *  - esperar um quadro e confirmar isActive (saltos disparam entrar+sair juntos);
 *  - nunca prender o usuário (nas pontas, sair);
 *  - labels dentro do pin, nunca no início/fim exato.
 *
 * Retorna uma função de limpeza.
 */
export function passoAPasso({
  tl,
  section,
  alturaTela,
  scrollTo,
  navegando,
}: {
  tl: gsap.core.Timeline;
  section: Element;
  alturaTela: () => number;
  scrollTo: ScrollToFn;
  navegando: () => boolean;
}) {
  const st = tl.scrollTrigger!;
  const paradas = (): number[] =>
    Object.values(tl.labels)
      .sort((a, b) => a - b)
      .map((t) => t / tl.duration());
  const posicao = (i: number) => st.start + paradas()[i] * (st.end - st.start);
  let parada = 0;
  let andando = false;

  const ir = (alvo: number) => {
    andando = true;
    scrollTo(alvo, {
      duration: 0.9,
      ease: "power3.inOut",
      lock: true,
      interno: true,
      onComplete: () => {
        andando = false;
      },
    });
  };

  const stepper = ScrollTrigger.observe({
    target: window,
    type: "touch",
    tolerance: 12,
    preventDefault: true,
    onUp: () => passo(1), // dedo sobe = avançar
    onDown: () => passo(-1),
  });
  stepper.disable();

  function passo(dir: 1 | -1) {
    if (andando) return;
    const n = parada + dir;
    if (n < 0 || n >= paradas().length) {
      stepper.disable();
      ir(dir > 0 ? st.end + alturaTela() * 0.6 : st.start - alturaTela() * 0.6);
      return;
    }
    parada = n;
    ir(posicao(n));
  }

  const maisProxima = () => {
    const L = paradas();
    return L.reduce((m, v, i) => (Math.abs(v - st.progress) < Math.abs(L[m] - st.progress) ? i : m), 0);
  };
  const aoFimDaNavegacao = () => {
    if (!st.isActive) return;
    parada = maisProxima();
    stepper.enable();
    ir(posicao(parada));
  };
  window.addEventListener(FIM_NAVEGACAO, aoFimDaNavegacao);

  const guarda = ScrollTrigger.create({
    trigger: section,
    start: () => st.start,
    end: () => st.end,
    onEnter: () =>
      requestAnimationFrame(() => {
        if (!st.isActive || navegando()) return;
        parada = 0;
        stepper.enable();
        ir(posicao(0));
      }),
    onEnterBack: () =>
      requestAnimationFrame(() => {
        if (!st.isActive || navegando()) return;
        parada = paradas().length - 1;
        stepper.enable();
        ir(posicao(parada));
      }),
    onLeave: () => stepper.disable(),
    onLeaveBack: () => stepper.disable(),
  });

  return () => {
    window.removeEventListener(FIM_NAVEGACAO, aoFimDaNavegacao);
    stepper.kill();
    guarda.kill();
  };
}
