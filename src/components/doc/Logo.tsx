import { CLINICA } from "@/content/clinica";

/**
 * Assinatura tipográfica provisória (Fraunces itálico + mono).
 * Quando houver o arquivo do logo "MO" da Dra. Milena, troque por ele aqui.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col leading-none ${className}`} aria-label={CLINICA.nome}>
      <span className="font-display text-[1.35em] italic">{CLINICA.nomeCurto}</span>
      <span className="mt-1 font-mono text-[0.62em] uppercase tracking-[0.18em] opacity-70">odontologia</span>
    </span>
  );
}
