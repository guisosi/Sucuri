// Tipos usados pela API e pelo site, para os dois falarem a mesma língua

export interface Tema {
  id: number;
  nome: string;
}

// Pergunta completa, como fica no banco
export interface Pergunta {
  id: number;
  tema_id: number;
  enunciado: string;
  alternativa_1: string;
  alternativa_2: string;
  alternativa_3: string;
  correta: number; // 1, 2 ou 3
}

// Pergunta enviada ao quiz: sem o gabarito
export type PerguntaQuiz = Omit<Pergunta, "correta">;

// Resposta enviada pelo usuário ao quiz
export interface RespostaEnviada {
  pergunta_id: number;
  alternativa: number;
}

// O que a API devolve depois de corrigir
export interface ResultadoQuiz {
  acertos: number;
  total: number;
  detalhes: {
    pergunta_id: number;
    escolhida: number;
    correta: number;
    acertou: boolean;
  }[];
}
