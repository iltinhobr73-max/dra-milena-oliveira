import { Hero } from "@/components/hero/Hero";
import { TratamentosIntro } from "@/components/tratamento/TratamentosIntro";
import { Tratamento } from "@/components/tratamento/Tratamento";
import { Sobre } from "@/components/sobre/Sobre";
import { Duvidas } from "@/components/duvidas/Duvidas";
import { Agendar } from "@/components/agendar/Agendar";
import { Flutuante } from "@/components/flutuante/Flutuante";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <TratamentosIntro />
        <Tratamento indice={0} numero="02" fundo="bg-nude" />
        <Tratamento indice={1} numero="03" fundo="bg-nude-2" inverter />
        <Tratamento indice={2} numero="04" fundo="bg-nude" />
        <Sobre />
        <Duvidas />
        <Agendar />
      </main>
      <Flutuante />
    </>
  );
}
