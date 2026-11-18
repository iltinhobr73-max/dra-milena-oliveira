import { Hero } from "@/components/hero/Hero";
import { Tratamentos } from "@/components/tratamentos/Tratamentos";
import { Sobre } from "@/components/sobre/Sobre";
import { Consultorio } from "@/components/consultorio/Consultorio";
import { Duvidas } from "@/components/duvidas/Duvidas";
import { Agendar } from "@/components/agendar/Agendar";
import { Flutuante } from "@/components/flutuante/Flutuante";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Tratamentos />
        <Sobre />
        <Consultorio />
        <Duvidas />
        <Agendar />
      </main>
      {/* Depois das seções: precisa do pin dos tratamentos já criado. */}
      <Flutuante />
    </>
  );
}
