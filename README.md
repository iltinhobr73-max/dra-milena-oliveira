# Dra. Milena Oliveira — site

Site de apresentação da Dra. Milena Oliveira, cirurgiã-dentista em Fortaleza/CE. Conceito: **o site é um clareamento** — cada seção é um tom da escala de cor, do A3,5 (hero) ao BL1 (agendamento).

Stack: Next.js · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis. Regras de animação em [`CLAUDE.md`](./CLAUDE.md).

```bash
npm install
npm run dev
```

## Antes de publicar

1. **Autorização da Dra. Milena** — textos e fotos vieram do Instagram público dela, como proposta.
2. **CRO** — preencher em `src/content/clinica.ts` (obrigatório na publicidade odontológica).
3. **Antes e depois** — confirmar a autorização do(a) paciente da foto.
4. **Logo "MO"** — trocar a assinatura tipográfica provisória (`src/components/doc/Logo.tsx`) e o ícone pelo arquivo do logo.
5. **Fotos e vídeo** — as fotos têm ~600px; versões maiores e um vídeo real do consultório deixam o site bem melhor.
