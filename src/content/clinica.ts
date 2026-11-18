/**
 * Dados da Dra. Milena Oliveira — fonte única do site.
 *
 * PROPOSTA: preenchida com informações públicas do Instagram dela. Publicar
 * só com autorização, revisar textos e completar o CRO (obrigatório na
 * publicidade odontológica — Resolução CFO nº 196/2019).
 */

const WHATSAPP = "5585999446404";

/** Link do WhatsApp com mensagem pronta (opcionalmente citando o tratamento). */
export const whatsapp = (assunto?: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    assunto
      ? `Olá, Dra. Milena! Vim pelo site e gostaria de agendar uma avaliação de ${assunto}.`
      : "Olá, Dra. Milena! Vim pelo site e gostaria de agendar uma avaliação.",
  )}`;

export const CLINICA = {
  nome: "Dra. Milena Oliveira",
  nomeCurto: "Milena Oliveira",
  profissao: "Cirurgiã-Dentista",
  /** Ex.: "CRO-CE 12345". Vazio = não aparece. Obrigatório antes de publicar (CFO 196/2019). */
  cro: "",
  cidade: "Fortaleza · Ceará",
  whatsappExibicao: "(85) 99944-6404",
  instagram: { usuario: "@dramilenaoliveira", url: "https://www.instagram.com/dramilenaoliveira/" },
  lema: "Transformando vidas através do sorriso.",
  formacao: [
    { quando: "Graduação", oque: "Odontologia", onde: "Universidade de Fortaleza (UNIFOR)" },
    { quando: "Em andamento", oque: "Pós-graduação em Estética Dentária", onde: "" },
  ],
  bio: "Sou Milena Oliveira, cirurgiã-dentista formada pela Universidade de Fortaleza e pós-graduanda em Estética Dentária. E é só o começo da minha jornada na Odontologia.",
} as const;

/** Tratamentos: cada um tem a própria seção. */
export const TRATAMENTOS = [
  {
    id: "clinica-geral",
    titulo: "Clínica Geral",
    assunto: "clínica geral",
    chamada: "A base de qualquer sorriso bonito é um sorriso saudável.",
    texto:
      "Tudo começa por uma avaliação completa: entender a sua saúde bucal, o que incomoda e o que você deseja. A partir dela, montamos juntos o plano de tratamento — sem pressa e sem procedimentos desnecessários.",
    itens: ["Avaliação completa e plano de tratamento", "Limpeza e prevenção", "Restaurações"],
  },
  {
    id: "clareamento",
    titulo: "Clareamento",
    assunto: "clareamento",
    chamada: "Dentes mais claros, com acompanhamento em cada etapa.",
    texto:
      "Antes de clarear, avaliamos a cor e a saúde dos dentes para indicar a técnica certa para você — de consultório ou caseira supervisionada — e acompanhamos de perto até o resultado.",
    itens: ["Avaliação de cor antes de começar", "Técnica de consultório ou caseira supervisionada", "Orientação para manter o resultado"],
  },
  {
    id: "botox",
    titulo: "Botox",
    assunto: "botox",
    chamada: "Suavizar linhas de expressão e aliviar o bruxismo, com naturalidade.",
    texto:
      "A toxina botulínica, aplicada pelo cirurgião-dentista, trata linhas de expressão do terço superior da face e o bruxismo. A aplicação é planejada para manter a sua expressão natural.",
    itens: ["Linhas de expressão do terço superior", "Bruxismo e tensão muscular", "Aplicação planejada e acompanhamento"],
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
    resposta: "Pelo botão “Agendar avaliação”: ele abre o WhatsApp com a mensagem pronta. Na primeira consulta, avaliamos e montamos o plano juntos.",
  },
] as const;
