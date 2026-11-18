"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Ponto único de registro dos plugins. Importe GSAP sempre daqui.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // No celular, a barra de endereço some/volta durante o scroll e muda só a
  // ALTURA da janela. Recalcular os triggers nesse momento faz a página
  // pular (o pin muda de comprimento no meio do gesto). Ignoramos esses
  // resizes; mudanças de largura/orientação continuam disparando refresh.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, useGSAP };
