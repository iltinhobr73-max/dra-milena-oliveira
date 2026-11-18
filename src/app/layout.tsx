import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Inter_Tight } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import "./globals.css";

const serif = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  style: ["normal", "italic"],
});

const sans = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Dra. Milena Oliveira | Dentista em Fortaleza — Clareamento, Botox e Clínica Geral",
  description:
    "Cirurgiã-dentista em Fortaleza/CE. Clareamento dental, toxina botulínica (botox) e clínica geral. Agende sua avaliação.",
  openGraph: {
    title: "Dra. Milena Oliveira — seu sorriso, no tom certo",
    description: "Clareamento, botox e clínica geral em Fortaleza. Agende sua avaliação.",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#241a17",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable} ${mono.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Marca que há JS: só então o conteúdo animado começa escondido (ver globals.css). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
