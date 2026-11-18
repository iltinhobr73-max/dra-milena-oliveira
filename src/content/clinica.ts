/**
 * Dados da Dra. Milena Oliveira — fonte única do site.
 *
 * PROPOSTA: preenchida com informações públicas do Instagram dela. Publicar
 * só com autorização, revisar textos e completar o CRO (obrigatório na
 * publicidade odontológica — Resolução CFO nº 196/2019).
 */

export const CLINICA = {
  nome: "Dra. Milena Oliveira",
  nomeCurto: "Milena Oliveira",
  profissao: "Cirurgiã-Dentista",
  cro: "CRO-CE [nº]", // TODO: preencher
  cidade: "Fortaleza · Ceará",
  instagram: { usuario: "@dramilenaoliveira", url: "https://www.instagram.com/dramilenaoliveira/" },
  agendamento: "https://contate.me/dramilenaoliveira",
  lema: "Transformando vidas através do sorriso.",
  formacao: [
    { quando: "Graduação", oque: "Odontologia", onde: "Universidade de Fortaleza (UNIFOR)" },
    { quando: "Em andamento", oque: "Pós-graduação em Estética Dentária", onde: "" },
  ],
  bio: "Sou Milena Oliveira, cirurgiã-dentista formada pela Universidade de Fortaleza e pós-graduanda em Estética Dentária. E é só o começo da minha jornada na Odontologia.",
} as const;

/** Tratamentos (a "pilha" da seção fixa). `tom` = posição simbólica na escala de cor. */
export const TRATAMENTOS = [
  {
    id: "clinica-geral",
    tom: "A2",
    titulo: "Clínica Geral",
    resumo: "A base de qualquer sorriso bonito é um sorriso saudável.",
    itens: ["Avaliação completa e plano de tratamento", "Limpeza e prevenção", "Restaurações"],
  },
  {
    id: "clareamento",
    tom: "A1",
    titulo: "Clareamento",
    resumo: "Dentes alguns tons mais claros, com acompanhamento em cada etapa.",
    itens: ["Avaliação de cor antes de começar", "Técnica de consultório ou caseira supervisionada", "Orientação para manter o resultado"],
  },
  {
    id: "botox",
    tom: "BL1",
    titulo: "Botox",
    resumo: "Toxina botulínica para suavizar linhas de expressão e tratar o bruxismo.",
    itens: ["Linhas de expressão do terço superior", "Bruxismo e tensão muscular", "Aplicação planejada para um resultado natural"],
  },
] as const;

/** Dúvidas frequentes (sem promessa de resultado). */
export const DUVIDAS = [
  {
    pergunta: "Clareamento estraga o dente?",
    resposta:
      "Feito com indicação e acompanhamento de um dentista, não. Pode haver sensibilidade passageira durante o tratamento — por isso a avaliação vem antes e o protocolo é ajustado para você.",
  },
  {
    pergunta: "Quanto tempo dura o clareamento?",
    resposta:
      "Depende dos hábitos: café, chá, vinho e cigarro escurecem os dentes com o tempo. Com cuidados simples e retornos de manutenção, o resultado se mantém por bastante tempo.",
  },
  {
    pergunta: "Dentista pode aplicar botox?",
    resposta:
      "Sim. O Conselho Federal de Odontologia reconhece o uso da toxina botulínica pelo cirurgião-dentista na região da face, tanto para fins estéticos quanto para tratar o bruxismo.",
  },
  {
    pergunta: "Como agendar?",
    resposta: "Pelo botão “Agendar avaliação”: você escolhe o melhor canal e o melhor horário. Na primeira consulta, avaliamos e montamos o plano juntos.",
  },
] as const;

/** Rótulos das seções na escala de cor: a página "clareia" de cima para baixo. */
export const SECOES = [
  { tom: "A3,5", titulo: "Início", href: "#top" },
  { tom: "A2", titulo: "Tratamentos", href: "#tratamentos" },
  { tom: "A1", titulo: "Sobre", href: "#sobre" },
  { tom: "B1", titulo: "Consultório", href: "#consultorio" },
  { tom: "BL2", titulo: "Dúvidas", href: "#duvidas" },
  { tom: "BL1", titulo: "Agendar", href: "#agendar" },
] as const;
