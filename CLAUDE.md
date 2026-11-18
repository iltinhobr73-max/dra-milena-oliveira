@AGENTS.md

# Projeto: site da Dra. Milena Oliveira (cirurgiã-dentista, Fortaleza/CE)

Stack: Next.js (App Router, `src/`), TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger, Lenis.

## Regra de animação (obrigatória)

**Toda animação usa Lenis no scroll e GSAP no movimento.**

- **Scroll = Lenis.** Existe uma única instância de Lenis para o site inteiro, criada num provider client-side no layout raiz. Nenhum componente cria a própria instância nem usa `window.scrollTo`, `scroll-behavior: smooth` em CSS ou bibliotecas de scroll alternativas. Âncoras e "voltar ao topo" usam `lenis.scrollTo(...)`.
- **Movimento = GSAP.** Todo movimento (entrada, parallax, reveal, hover elaborado, contadores, transições) é feito com GSAP. Nada de CSS `@keyframes`/`transition` para animações de conteúdo, nem Framer Motion ou outras libs de animação. (Transições triviais de cor/opacidade em hover via Tailwind são aceitáveis.)
- **Animação ligada ao scroll = ScrollTrigger**, sincronizado com Lenis:
  - `gsap.registerPlugin(ScrollTrigger)` uma vez, no provider.
  - `lenis.on('scroll', ScrollTrigger.update)`.
  - O loop do Lenis roda no ticker do GSAP: `gsap.ticker.add((t) => lenis.raf(t * 1000))` e `gsap.ticker.lagSmoothing(0)`. Não usar `requestAnimationFrame` próprio.
- **Em React, usar `useGSAP` (`@gsap/react`)** com `scope` no ref do componente, para que tweens e ScrollTriggers sejam limpos automaticamente ao desmontar. Componentes com animação são `"use client"`.
- **Acessibilidade:** respeitar `prefers-reduced-motion` — com ele ativo, Lenis fica desligado (scroll nativo) e as animações GSAP vão direto ao estado final (use `gsap.matchMedia()`).
- **Ritmo cinematográfico (obrigatório):**
  - Toda entrada ou saída dura **no mínimo 0.6s**. Nada de `duration: 0.01` para "aparecer": use fade de 0.6s+. `.set()` só para estados que o usuário não vê (ex.: texto sob uma tarja).
  - Saídas não são a entrada rebobinada com `timeScale` acelerado (isso encurta a saída abaixo de 0.6s): faça um tween de saída próprio (≥0.6s, `power3.in`) e só depois comece a próxima entrada.
  - **Eases permitidos: só `power3.*` e `expo.*`** — inclusive em tweens com scrub, loops e no `easing` do `lenis.scrollTo` (expo.out). Nunca deixar um tween sem `ease` (o padrão do GSAP é power1.out).
  - Em recolhimento de tarjas/barras (scaleX → 0), prefira `power3` a `expo`: a cauda da expo deixa um filete de poucos px parado na tela.
  - Exceção consciente: `transition-colors` de hover em botões (feedback de UI, não entrada/saída).
- O conteúdo deve ser legível e indexável sem JavaScript: o estado inicial "escondido" das animações é aplicado pelo GSAP (`gsap.set`/`from` no cliente), não por classes CSS no HTML do servidor.
  - Única exceção, contra o flash antes da hidratação: um script inline no `<head>` adiciona a classe `js` ao `<html>`, e `.js [data-gsap-pending]` fica `visibility: hidden`. Todo elemento com `data-gsap-pending` precisa receber `autoAlpha: 1` do GSAP ao montar (inclusive no ramo de reduced motion).

## Onde fica cada coisa

- `src/content/clinica.ts` — **todos os dados** (nome, CRO, Instagram, link de agendamento, bio, formação, tratamentos, dúvidas). Altere aqui, não nos componentes.
- `src/lib/gsap.ts` — registra os plugins. Importe `gsap`, `ScrollTrigger` e `useGSAP` sempre daqui.
- `src/components/providers/SmoothScroll.tsx` — Lenis único + `useScrollTo()` (âncoras; `duration`, `ease` power3/expo, `lock`, `onComplete`, `interno`), `useScrollLock()`, `useNavegacao()` + evento `FIM_NAVEGACAO`. Âncora de seção fixada mira o início do pin (+2px).
- `src/lib/passoAPasso.ts` — **celular: uma passada = uma parada** em qualquer seção fixada (Observer + Lenis). Já resolve navegação atravessando a seção, saltos/recarregar e saída nas pontas.
- `src/components/doc/Secao.tsx` — `SecaoHeader` (aba da escala de cor: amostra + código + nome) e `revealSecao()` (linha expo.inOut, `[data-item]` stagger 0.2 power3.out, `[data-draw]` linhas traçadas).
- Seções: `hero/` (A3,5) · `tratamentos/` (A2, pin) · `sobre/` (A1) · `consultorio/` (B1) · `duvidas/` (BL2) · `agendar/` (BL1). `flutuante/` = botão "Agendar" (renderizado depois das seções).
- Hero: a escala de cor aparece primeiro com o marcador parado em A3,5; a frase surge amarelada e **clareia** tom a tom até o branco enquanto o marcador percorre a escala.
- Tratamentos: pin; cartões porcelana empilham; no clareamento, o antes/depois é revelado pelo scroll (cortina `[data-depois]`).
- `public/media/perola.mp4` — vídeo de luz perolada (gerado, provisório). Fotos (`perfil`, `procedimento`, `consultorio`, `antes`/`depois`) vêm do Instagram dela, ~600px: exibir em tamanho contido.

## Direção de arte

- **Conceito: o site é um clareamento.** Cada seção é rotulada com um tom da escala de cor (A3,5 → BL1) e o fundo vai do cacau (hero) ao branco porcelana (agendar).
- Paleta: `cacau` (fundos escuros), `nude`/`perola`/`porcelana` (fundos claros, do mais quente ao mais branco), `rose`/`rose-2` (rosé dourado do perfil dela: destaques e botões), `tinta` (texto). Escala: `a35 a3 a2 a1 b1 bl1`.
- Tipografia: Fraunces macia (`.font-display`, itálico para a palavra de ênfase), Inter Tight (texto), IBM Plex Mono (códigos de tom e metadados).
- Fotos sempre na cor original.

## Armadilhas conhecidas

- Tailwind só gera classes escritas por extenso no código: nunca monte `group-data-[...]:classe` com template string/variável.
- Tailwind v4: `scale-*`, `rotate-*` e `translate-*` usam as propriedades CSS `scale`/`rotate`/`translate`, que se SOMAM ao `transform` do GSAP. Em elemento animado pelo GSAP, não usar essas classes — defina o estado inicial com `gsap.set`.
- GSAP não interpola `var(--cor)`: use o valor hex.
- **Pin + Lenis: nunca usar `anticipatePin`.** Ele prevê o pin pela velocidade do scroll nativo, mas aqui o `ScrollTrigger.update` vem do Lenis; em flicks no celular o palco saltava ~110px.
- **Comprimento de pin/scrub em altura estável**: use a altura de um elemento `h-svh` (ex.: `stage.clientHeight`), nunca `window.innerHeight` — no celular ele muda com a barra de endereço e o pin muda de tamanho a cada refresh.
- `ScrollTrigger.config({ ignoreMobileResize: true })` fica em `src/lib/gsap.ts` (resize só de altura no touch não recalcula triggers).
- **Snap do ScrollTrigger no celular não serve para "uma passada = um passo"**: compete com a rolagem nativa do dedo e é interrompido em passadas longas. Use `src/lib/passoAPasso.ts` (Observer + Lenis).
- Qualquer componente que reage a entrar/sair de uma seção deve: (1) ignorar a entrada durante uma navegação (`useNavegacao()`); (2) esperar um quadro e confirmar `isActive` antes de agir — saltos por cima da seção (recarregar a página, "localizar") disparam entrar+sair juntos; (3) nunca prender o usuário — nas pontas, devolver a rolagem.
- Labels de encaixe/parada ficam DENTRO do pin, nunca no início/fim exato (ali a seção ainda não conta como ativa).
- Elementos com fundo opaco empilhados devem ter a visibilidade controlada pela própria timeline, não só os filhos.

## Conteúdo e CFO

- Os dados são **proposta** (Instagram público). Publicar só com autorização da Dra. Milena.
- Publicidade odontológica (Resolução CFO nº 196/2019): exibir nome e **CRO** (preencher em `clinica.ts`); sem garantia de resultado, sem preço/promoção; "antes e depois" só com autorização do paciente.

## Convenções

- Idioma: português do Brasil. Tom acolhedor, em primeira pessoa (é a voz dela).
